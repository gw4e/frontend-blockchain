const request = require("supertest");
const {Server} = require("../server")
const User = require("../model/User");
const Backend = require("../services/backend");
const PRIVATE_KEY = "PRIVATE_KEY 3082025c02010002818100a84689c3d98e26c73f250da9ae9459572629274518caa981a0a743e74022b40d4e228e899569ec3c1e2003ce6d491867e04c2a61e8641ce92d4a5275ea02b6309221c7cf84a08d307a0a8df32e62d4ba7b6613bc470231e70e6e46b079d41b17d383776843cfe20c8793f19ca563ef739868784f765f5051181a476f0827e3b10203010001028180365427d072a201851caef2dd50bf16a51b6df7fec8054e7aca8a9652c8132c3c8b787eba8ee1d6e285fb621f388b7bf4b5a7019c00b2a9dee2bf772618ba6d6574e3ca8d7dc2aa2e229feefa7461d4d58472a5bf5c508c43bdf6c6e1f1adc8adee9c6ecc7eb828a248f8e0be19fd15426d051bd4932543bb670cede1b427b02d024100c4eff94fbfd3286a1d08b960a4123097b2372637336cbdfd49de9b4bf443036b6f56ff78575f5fe7fa6abdf666a93bcc15f19f60a8746f6bea1754902efd3553024100dabe06f60b24acf58a06b604a0d6f2b6bd530d7c25936ff7257a9e8c0abe0912d11b866eb9bfd93685e33696f48f9d5cafd41b77e59f0209bec225e23f65be6b0240636ab174ece56ff5818ab1ea73692b56a904e629dfaff989300d4c605f82a4eb4b5da3c1e079a934b659c463eb176bb46f2f76c198c88ea6ef99af7ac9fdd139024100c13658afbbe8095e592cd45a0237daebcf0f2d3a1b76bfcf6e2b811ff1dd29e6950ddb10b2c1e2fb6607ec902a3530aa4e24ec9e5b14b89823071aaf5d90614102405b8c484da8ba15c3b1bfde7d9576f70901b9c2481a86b671fa9ce6f255c99e63b17035e12b77cd22b50352b0e7bd7def624481414e138a8749917ed9aee0e450"
const PUBLIC_KEY = "PUBLIC_KEY 30819f300d06092a864886f70d010101050003818d0030818902818100a84689c3d98e26c73f250da9ae9459572629274518caa981a0a743e74022b40d4e228e899569ec3c1e2003ce6d491867e04c2a61e8641ce92d4a5275ea02b6309221c7cf84a08d307a0a8df32e62d4ba7b6613bc470231e70e6e46b079d41b17d383776843cfe20c8793f19ca563ef739868784f765f5051181a476f0827e3b10203010001"
const OTHER_PUBLIC_KEY = "OTHER_PUBLIC_KEY 30819f300d06092a864886f70d010101050003818d0030818902818100c3cf2ede84caee30a42d86402e584dcc3ef236d03eec19de84b9be86384842551a5371c4c4241b33cdd670b2a36f504162eb7e5f2940909c6576b069f5a38e0bdd5e6b4efb71eda95065bbd3908a574172d7f45c34a618d1886894fa028f9898cb5dcd3a52219aad1174cd9f8f2671d59a044d74f31c48ddde94475c8f6288890203010001"
const DEFAULT_NODE = "http://localhost:3001"
const NODE_1 = "http://localhost:3002"
const NODE_2 = "http://localhost:3003"
const DEFAULT_TIMESTAMP_BLOCK = "2022-03-27"
const DEFAULT_BLOCKCHAIN_ID = "48eca640-ccb5-4e7b-bdae-54e1942372be"

jest.mock('../services/backend', () => ({
    create_key: jest.fn(() => Promise.resolve({
        private: PRIVATE_KEY,
        public: PUBLIC_KEY
    })),
    init: jest.fn(() => Promise.resolve(true)),
    add_transaction: jest.fn(() => Promise.resolve()),
    add_credit_card_transaction: jest.fn(() => Promise.resolve()),
    get_wallets: jest.fn(() => Promise.resolve([PUBLIC_KEY, OTHER_PUBLIC_KEY])),
    getCurrentBackendUrl: jest.fn(() => DEFAULT_NODE),
    getAllBackendUrls: jest.fn(() => [DEFAULT_NODE, NODE_1, NODE_2]),
    setCurrentBackendUrl: jest.fn(),
    get_balance_for_wallet: jest.fn(() => Promise.resolve(100)),
    configureNetwork: jest.fn(() =>
        Promise.resolve([
            {
                url: DEFAULT_NODE,
                other_nodes: [NODE_1, NODE_2]
            }
        ])
    ),
    describe_blockchain: jest.fn(() => Promise.resolve({
        transactions: [{
            "blockNumber": 0,
            "blockNonce": 1,
            "blockTimestamp": DEFAULT_TIMESTAMP_BLOCK,
            "transactionAmount": 12,
            "transactionFrom": PUBLIC_KEY,
            "transactionTo": OTHER_PUBLIC_KEY
        }],
        source_blockchain_id: DEFAULT_BLOCKCHAIN_ID,
        urlSource: DEFAULT_NODE
    })),
    register: jest.fn(() => Promise.resolve({
        keys: {
            private: "3082025d02010002818100cd9f2011044af0d485e4e8b97d1e614d47e45ef03188071581907ef9abc3f96219555c35915d59cf0cafe6bea774aeb95c25296c4f8e6368e7aa39cd6b68756f7317d229060047643cf3e67743468eefdeca3b5152fcc992d19a655463f5b0bc30d061d14496f67592c6eb362d14f3a066ff60c55270b63adbf861478c5c5019020301000102818021d2bb61f1347e99b18e03a0d76da83b1fc8a21147f9d9e8760feb186e0d10e2f675d872d0a996bca7429c108a827811f23aaeae015c290ab83e2e69eaf170e23615bf0319241fb5d8d7615374dc664c212d0591712d359869d98f8eb1235d589e5132e7967508566aca2cbe33badc914f715f771ffd7873cde3c78ac367fefd024100ce18b01e5a1fda034de75e8ccd81d7795116f6fe5a5013c4cf54739f544ebd7b66e2acc470cf954d8b1e952f2215c93931403b9ae67b493dc0305f60ee8015ab024100ff6900a2284e2e67060de9850a5120eb2be412ac8f107e0a3e8b28272c25ab12182dd7ab994270e9e59f3e804ca9d7fd4035f40d991258d027c47d93f05ce54b024100c3b80440bebbb2d122814f740d9179ac170ae5028587b84e55ca5087058c453b54687d438c12462a3eac8b66184b722da30ce9cddf8542f7a675098ec6cfd2430241009afcc3e6a2e0b665cc15bb24015bb3c7218e380ac091f87a0cf3f2bcba9c6d1000de28a6b7cccaaa14ae2a863e7f3e532e98ceed457b0dabdac5f0924a6484bb02401a5b675cc01551484e520d23fcfeb63d38c8bfb6984e09e406e98c3f3e1972457ad91d6f32c69ce3185994c7036a275602c31c2143f80611f96378f96643079c",
            public: "30819f300d06092a864886f70d010101050003818d0030818902818100cd9f2011044af0d485e4e8b97d1e614d47e45ef03188071581907ef9abc3f96219555c35915d59cf0cafe6bea774aeb95c25296c4f8e6368e7aa39cd6b68756f7317d229060047643cf3e67743468eefdeca3b5152fcc992d19a655463f5b0bc30d061d14496f67592c6eb362d14f3a066ff60c55270b63adbf861478c5c50190203010001"
        },
        transaction: {
                transaction_id: "78363683-519d-4ee3-b871-d9a65ed2a606",
                amount: 200
        }
    })),
}))


let app;

describe('Server Entry Points Tests', () => {
    beforeAll(async () => {
        await User.registerUser("a@gmail.com", "pwd", PUBLIC_KEY);
        app = Server.createServer();
    });

    it('Should display the home page by default', async () => {
        const response = await request(app)
            .get("/")
            .expect(200)
        expect(response.text).toContain("What is Pycotr");
    });

    it('Should display the home page', async () => {
        const response = await request(app)
            .get("/home")
            .expect(200)
        expect(response.text).toContain("What is Pycotr");
    });

    it('Should login', async () => {
        const response = await request(app)
            .get("/login")
            .expect(200)
        expect(response.text).toContain("Sign in");
    });

    it('should be logged', function (done) {
        const agent = request(app);
        const response = agent
            .get('/login')
            .end(function () {
                agent
                    .post('/login')
                    .send({loginemail: 'a', loginpwd: 'pwd'})
                    .expect(302)
                    .expect('Location', '/home')
                    .end((err, res) => {
                        expect(res.headers['set-cookie']).toBeDefined()
                        if (err) return done(err);
                        return done();
                    });
            });
    });

    it('should login then logout and redirect to home page', (done) => {
        const agent = request.agent(app);
        agent
            .post('/login')
            .send({loginemail: 'a', loginpwd: 'pwd'})
            .end(function (err, res) {
                agent
                    .get("/logout")
                    .end(function (err, res) {
                        expect(res.text).toContain("Found. Redirecting to /home")
                        expect(res.headers['set-cookie']).toBeUndefined()
                        done();
                    });
            });
    });


    it('should NOT be logged', function (done) {
        function onResponse(err, res) {
            if (err) return done(err);
            return done();
        }

        const agent = request(app);
        agent
            .post('/login')
            .send({loginemail: 'a', loginpwd: 'wrongpassword'})
            .expect(302)
            .expect('Location', '/login')
            .end(onResponse);
    });

    it('should move to register page', function (done) {
        const agent = request(app);
        agent
            .get("/register")
            .end(function (err, res) {
                expect(res.text.includes("Register"))
                done();
            });
    });

    it('should be registered', async function () {
        const LOGIN_EMAIL = 'b@gmail.com'
        const LOGIN_PWD = 'b'
        const LOGIN_VERIF = LOGIN_PWD
        const FORM_AMOUNT_ON_CARD = 100
        const FORM_NAME_ON_CARD = 'b'
        const FORM_CARD_NUMBER = '"4387729175443174'
        const FORM_EXPIRATION = '2027-08-31'
        const FORM_CVV = '320'
        const agent = request(app);
        const res = await agent
            .post("/register")
            .send({
                loginemail: LOGIN_EMAIL,
                loginpwd: LOGIN_PWD,
                loginpwdverif: LOGIN_VERIF,
                formAmountOnCard: FORM_AMOUNT_ON_CARD,
                formNameOnCard: FORM_NAME_ON_CARD,
                formCardNumber: FORM_CARD_NUMBER,
                formExpiration: FORM_EXPIRATION,
                formCVV: FORM_CVV
            })

        expect(Backend.register.mock.calls[0][0]).toEqual(LOGIN_EMAIL)
        expect(Backend.register.mock.calls[0][1]).toEqual(LOGIN_PWD)
        expect(Backend.register.mock.calls[0][2]).toEqual(FORM_AMOUNT_ON_CARD)
        expect(Backend.register.mock.calls[0][3]).toEqual(FORM_NAME_ON_CARD)
        expect(Backend.register.mock.calls[0][4]).toEqual(FORM_CARD_NUMBER)
        expect(Backend.register.mock.calls[0][5]).toEqual(FORM_EXPIRATION)
        expect(Backend.register.mock.calls[0][6]).toEqual(FORM_CVV)
        expect(res.text).toContain('Sign in');
    });

    it('should land to a exchange page', function (done) {
        const agent = request.agent(app);
        agent
            .post('/login')
            .send({loginemail: 'a', loginpwd: 'pwd'})
            .end(function (err, res) {
                agent
                    .get("/exchange")
                    .end(function (err, res) {
                        expect(res.text).toContain("Proceed")
                        done();
                    });
            });
    });

    it('should send a transaction', function (done) {
        User.registerUser("b@gmail.com", "pwd", OTHER_PUBLIC_KEY);
        const agent = request.agent(app);
        agent
            .post('/login')
            .send({loginemail: 'a', loginpwd: 'pwd'})
            .end(function (err, res) {
                agent
                    .post("/exchange")
                    .send({
                        amounttotransfer: 100,
                        targetwallet: "b@gmail.com",
                        privatekey: PRIVATE_KEY,
                        targetnode: DEFAULT_NODE
                    })
                    .end(function (err, res) {
                        expect(Backend.add_transaction.mock.calls[0][0]).toEqual(PUBLIC_KEY)
                        expect(Backend.add_transaction.mock.calls[0][1]).toEqual(OTHER_PUBLIC_KEY)
                        expect(Backend.add_transaction.mock.calls[0][2]).toEqual(PRIVATE_KEY)
                        expect(Backend.add_transaction.mock.calls[0][3]).toEqual(100)
                        expect(res.text).toContain("Transaction sent to the blockchain")
                        done();
                    });
            });
    });

    it('should get balance', function (done) {
        const agent = request.agent(app);
        agent
            .post('/login')
            .send({loginemail: 'a', loginpwd: 'pwd'})
            .end(function (err, res) {
                agent
                    .post("/get_balance")
                    .set('Content-Type', 'application/json')
                    .send({})
                    .end(function (err, res) {
                        expect(res.body.value).toEqual(100)
                        done();
                    });
            });
    });

    it('should describe blockchain', function (done) {
        const agent = request.agent(app);
        agent
            .post('/login')
            .send({loginemail: 'a', loginpwd: 'pwd'})
            .end(function (err, res) {
                agent
                    .get("/describeBlockchain")
                    .query({targetBackend: DEFAULT_NODE, wallet: 'Choose...'})
                    .set('Content-Type', 'application/json')
                    .send({})
                    .end(function (err, res) {
                        expect(res.body.desc).toEqual({
                            "transactions": [
                                {
                                    "blockNumber": 0,
                                    "blockNonce": 1,
                                    "blockTimestamp": DEFAULT_TIMESTAMP_BLOCK,
                                    "transactionAmount": 12,
                                    "transactionFrom": PUBLIC_KEY,
                                    "transactionTo": OTHER_PUBLIC_KEY
                                }
                            ],
                            "source_blockchain_id": DEFAULT_BLOCKCHAIN_ID,
                            "urlSource": DEFAULT_NODE
                        })
                        done();
                    });
            });
    });

    it('should the display network page', function (done) {
        const agent = request.agent(app);
        agent
            .post('/login')
            .send({loginemail: 'a', loginpwd: 'pwd'})
            .end(function (err, res) {
                agent
                    .get("/displaynetwork")
                    .end(function (err, res) {
                        expect(res.text).toContain("Configure")
                        done();
                    });
            });
    });

    it('should display the network page', function (done) {
        const agent = request.agent(app);
        agent
            .post('/login')
            .send({loginemail: 'a', loginpwd: 'pwd'})
            .end(function (err, res) {
                agent
                    .post("/configure")
                    .end(function (err, res) {
                        expect(res.body).toEqual({
                            desc: [
                                {
                                    "node": DEFAULT_NODE,
                                    "contact": NODE_1
                                },
                                {
                                    "node": DEFAULT_NODE,
                                    "contact": NODE_2
                                }
                            ]
                        })
                        done();
                    });
            });
    });

    it('should display the explorer page', function (done) {
        const agent = request.agent(app);
        agent
            .post('/login')
            .send({loginemail: 'a', loginpwd: 'pwd'})
            .end(function (err, res) {
                agent
                    .get("/explorer")
                    .end(function (err, res) {
                        expect(res.text).toContain("Wallet's owner")
                        done();
                    });
            });
    });

});
