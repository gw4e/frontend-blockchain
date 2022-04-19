const request = require("supertest");
const {Server} = require("../server")
const {startBackends, stopBackends, sleep} = require("./utils");
const BackEnd = require("../services/backend");
const User = require("../model/User");

require('dotenv').config();

let app;

const PUBLIC_KEY = "PUBLIC_KEY 30819f300d06092a864886f70d010101050003818d0030818902818100a84689c3d98e26c73f250da9ae9459572629274518caa981a0a743e74022b40d4e228e899569ec3c1e2003ce6d491867e04c2a61e8641ce92d4a5275ea02b6309221c7cf84a08d307a0a8df32e62d4ba7b6613bc470231e70e6e46b079d41b17d383776843cfe20c8793f19ca563ef739868784f765f5051181a476f0827e3b10203010001"

jest.setTimeout(1000 * 30)

describe('Backend Entry Points Tests', () => {

    beforeAll(async () => {
        await User.registerUser("a@gmail.com", "pwd", PUBLIC_KEY);
        app = Server.createServer();
        await startBackends()
    });

    afterAll(async () => {
        await stopBackends()
    });

    async function login() {
        const agent = request.agent(app);
        await agent
            .post('/login')
            .send({loginemail: 'a', loginpwd: 'pwd'});
    }

    async function registerUser(email, pwd) {
        const keys = await BackEnd.create_key()
        await User.registerUser(email, pwd, keys['public']);
        return keys
    }

    function createCC() {
        const creditCardName = "John Doe"
        const creditCardNumber = "4387729175443174"
        const creditCardDate = "2027-08-31"
        const creditCardPict = 302
        return {
            creditCardName, creditCardNumber, creditCardDate, creditCardPict
        }
    }

    function createCCTransaction(keys, amount) {
        // credit card transaction --> fromAddress == toAddress
        const fromAddress = keys['public']
        const toAddress = fromAddress
        const fromPrivateKey = keys['private']
        const {creditCardName, creditCardNumber, creditCardDate, creditCardPict} = createCC()
        return {
            fromAddress,
            toAddress,
            fromPrivateKey,
            amount,
            creditCardName,
            creditCardNumber,
            creditCardDate,
            creditCardPict
        }
    }

    it('Should see the backend as started', async () => {
        const started = await BackEnd.init()
        expect(started).toBe(true)
    });

    it('Should return the backend urls', async () => {
        const urls = BackEnd.getAllBackendUrls()
        expect(urls).toEqual([
            "http://localhost:3001",
            "http://localhost:3002",
            "http://localhost:3003"
        ])
    });

    it('Should return the backend topology urls', async () => {
        const config = BackEnd.getAllBackendTopologyUrls()
        expect(config).toEqual({
            "http://localhost:3001": [
                "http://node2:3002",
                "http://node3:3003"
            ],
            "http://localhost:3002": [
                "http://node1:3001",
                "http://node2:3002"
            ],
            "http://localhost:3003": [
                "http://node2:3002",
                "http://node3:3003"
            ]
        })
    });

    it('Should return the current backend url', async () => {
        const url = BackEnd.getCurrentBackendUrl()
        expect(url).toEqual("http://localhost:3001")
    });

    it('Should sanitize parameters', async () => {
        const value = BackEnd.sanitizeParameters("Choose")
        expect(value).toBeNull()
        const otherValue = BackEnd.sanitizeParameters("otherValue")
        expect(otherValue).toEqual("otherValue")
    });

    it('Should describe network', async () => {
        await login()
        const agent = request.agent(app);
        await agent.post("/configure")
        const newdesc = await BackEnd.describeNetwork();
        expect(newdesc).toEqual([
            {
                "url": "http://localhost:3001",
                "other_nodes": [
                    "http://node2:3002",
                    "http://node3:3003"
                ],
                "pause":5
            },
            {
                "url": "http://localhost:3002",
                "other_nodes": [
                    "http://node1:3001",
                    "http://node3:3003"
                ],
                "pause":10
            },
            {
                "url": "http://localhost:3003",
                "other_nodes": [
                    "http://node2:3002",
                    "http://node1:3001"
                ],
                "pause":15
            }
        ]);
    })

    it('Should return the blockchain id ', async () => {
        await login()
        const id = await BackEnd.get_blockchain_id("http://localhost:3001");
        expect(id).not.toBeNull()
    })

    it('Should describe the blockchain ', async () => {
        await login()
        const desc = await BackEnd.describe_blockchain("http://localhost:3001");
        const transactions = desc['transactions']
        expect(transactions['blockNumber']).not.toBeNull()
        expect(transactions['blockNonce']).not.toBeNull()
        expect(transactions['blockTimestamp']).not.toBeNull()
        expect(transactions['transactionAmount']).not.toBeNull()
        expect(transactions['transactionFrom']).not.toBeNull()
        expect(transactions['transactionTo']).not.toBeNull()
        expect(desc['source_blockchain_id']).not.toBeNull()
        expect(desc['urlSource']).not.toBeNull()
    })

    it('Should create a key pair ', async () => {
        await login()
        const key = await BackEnd.create_key("http://localhost:3001");
        expect(key['private']).not.toBeNull()
        expect(key['public']).not.toBeNull()
    })

    it('Should return all wallets ', async () => {
        await login()
        const wallets = await BackEnd.get_wallets();
        expect(wallets.length).toBeGreaterThan(0)
    })

    it('Should add a credit card transaction ', async () => {
        await login()
        const keys = await registerUser('testbc@gmail.com', 'pwd')
        const {
            fromAddress, toAddress, fromPrivateKey, amount, creditCardName, creditCardNumber, creditCardDate,
            creditCardPict
        } = createCCTransaction(keys, 500)
        const result = await BackEnd.add_credit_card_transaction(
            fromAddress, toAddress, fromPrivateKey,
            amount, creditCardName,
            creditCardNumber, creditCardDate, creditCardPict);
        expect(result['transaction_id']).not.toBeNull()
        expect(result['amount']).toEqual(500)

    })

    it('Should add a  transaction ', async () => {

        async function assertFuncWithTimeout(context, timeout) {
            let exc = null;
            const timeoutStart = new Date().getTime()
            while (new Date().getTime() < timeoutStart + timeout) {
                try {
                    const ret = await context.func(context.arguments)
                    return ret
                } catch (e) {
                    exc = e;
                    await sleep(3000)
                }
            }
            throw exc;
        }

        async function addTransaction(contextParam) {
            const t = await BackEnd.add_transaction(
                contextParam.keysUser1['public'],
                contextParam.keysUser2['public'],
                contextParam.keysUser1['private'], 50)
            return t;
        }

        async function checkWallets(contextParam) {
            const wallet1 = await BackEnd.get_balance_for_wallet(contextParam.keysUser1['public']);
            const wallet2 = await BackEnd.get_balance_for_wallet(contextParam.keysUser2['public']);
            if (wallet1 == wallet2) {
                throw Error("transaction still pending")
            }
            return true
        }

        const agent = request.agent(app);
        const {creditCardName, creditCardNumber, creditCardDate, creditCardPict} = createCC()
        const resultUser1 = await BackEnd.register("aa", "loginpwd", 200, creditCardName, creditCardNumber, creditCardDate, creditCardPict)
        const resultUser2 = await BackEnd.register("bb", "loginpwd", 200, creditCardName, creditCardNumber, creditCardDate, creditCardPict)
        const keysUser1 = resultUser1['keys']
        const keysUser2 = resultUser2['keys']
        const context = {
            func: addTransaction,
            arguments: {
                keysUser1,
                keysUser2
            }
        }
        const t = await assertFuncWithTimeout(context, 15000);
        expect(t['transaction_id']).not.toBeNull();
        expect(t['amount']).toEqual(50);

        const context2 = {
            func: checkWallets,
            arguments: {
                keysUser1,
                keysUser2
            }
        }
        const transactionDone = await assertFuncWithTimeout(context2, 15000);
        expect(transactionDone).toBeTruthy()
    })

    it('Should configure network', async () => {
        const desc = await BackEnd.configureNetwork()
        expect(desc).toEqual([{
            "url": "http://localhost:3001",
            "other_nodes": [
                "http://node2:3002",
                "http://node3:3003"
            ],
            "pause": 5,
        },
            {
                "url": "http://localhost:3002",
                "other_nodes": [
                    "http://node1:3001",
                    "http://node3:3003"
                ],
                "pause": 10,
            },
            {
                "url": "http://localhost:3003",
                "other_nodes": [
                    "http://node2:3002",
                    "http://node1:3001"
                ],
                "pause": 15,
            }])
    })

    it('Should register the user', async () => {
        const email = 'b@gmail.com'
        const pwd = 'b'
        const amount = 122
        const name = 'b'
        const cnumber = '"4387729175443174'
        const expiration = '2027-08-31'
        const ccv = '320'
        const result = await BackEnd.register(email,pwd,amount,name,cnumber,expiration,ccv)
        expect(User.users["b"].name).toEqual(email)
        expect(User.users["b"].public_key).toEqual(result['keys']['public'])
        expect(result['transaction']['transaction_id']).not.toBeNull()
        expect(result['transaction']['amount']).toEqual(amount)
    })
});




