var axios = require('axios');
const User = require("../model/User");
require('dotenv').config();

class BackEnd {
    static CURRENT_BACKEND_URL = null;

    static async init () {
        let exists = false
        const urls = BackEnd.getAllBackendUrls();
        for (const url of urls) {
            if (exists) continue;
            const config = {
                method: 'get',
                url: url + '/status',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            try {
                const response = await axios(config)
                if (response.data ["status"] != "success") {
                    throw ("Failed to describe network")
                }
                BackEnd.setCurrentBackendUrl(url)
                exists =  true;
            } catch (e) {
                if (e["code"] != "ECONNREFUSED") {
                    console.log(e)
                    throw ("Failed to describe network")
                }
            }
        }
        return exists;
    }

    static getAllBackendUrls() {
        return Object.keys(BackEnd.getAllBackendTopologyUrls());
    }

    static getAllBackendTopologyUrls() {
        const nodes = process.env.BACKEND_URLS.split(';')
        const config = {}
        nodes.forEach((node) => {
            const peers = node.match(/\[(.+?)\]/g);
            node = node.replace(peers, '')
            config[node] = peers[0].slice(1, -1).split(',')
        })
        return config
    }

    static getCurrentBackendUrl() {
        if (!BackEnd.CURRENT_BACKEND_URL) {
            const config = BackEnd.getAllBackendTopologyUrls()
            const key = Object.keys(BackEnd.getAllBackendTopologyUrls()) [0]
            BackEnd.CURRENT_BACKEND_URL = key
        }
        return BackEnd.CURRENT_BACKEND_URL;
    }

    static setCurrentBackendUrl(url) {
        BackEnd.CURRENT_BACKEND_URL = url
    }

    static sanitizeParameters(param) {
        if (param && param.startsWith("Choose")) return null;
        return param;
    }

    static async describeNetwork() {
        const urls = BackEnd.getAllBackendUrls();
        const ret = []
        for (const url of urls) {
            const config = {
                method: 'get',
                url: url + '/describe_network',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            try {
                const response = await axios(config)
                if (response.data ["status"] != "success") {
                    throw ("Failed to describe network")
                }
                ret.push (response.data ["result"] )
            } catch (e) {
                if (e["code"] != "ECONNREFUSED") {
                    console.log(e)
                    throw ("Failed to describe network")
                }
            }
        }
        return ret;
    }

    static  async get_blockchain_id(url) {
        const config = {
            method: 'get',
            url: url + '/blockchain_id',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await axios(config)
        return response.data ["result"]
    }

    static async describe_blockchain(url = null, wallet = null) {
        const data = JSON.stringify({});
        const backendUrl = (BackEnd.sanitizeParameters(url) ? url : `${BackEnd.getCurrentBackendUrl()}`)
        const config = {
            method: 'get',
            url: backendUrl  + "/describe_blockchain" ,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        const response = await axios(config)
        const result = response.data ["result"]
        const ret = []
        const walletFilter = BackEnd.sanitizeParameters(wallet)
        const publicKey = User.findPublicKeysFromWalletsName(walletFilter)
        const source_blockchain_id = result ["source_blockchain_id"]
        result["chain"].forEach((chain, index) => {
            chain.transactions.forEach((transaction) => {
                if (!walletFilter || (walletFilter && (publicKey == transaction['from_address'] || publicKey == transaction['to_address']))) {
                    ret.push({
                        "blockNumber": index,
                        "blockNonce": chain['nonce'],
                        "blockTimestamp": chain['timestamp'],
                        "transactionAmount": transaction['amount'],
                        "transactionFrom": transaction['from_address'].slice(0, 3) + '...' + transaction['from_address'].slice(-15),
                        "transactionTo": transaction['to_address'].slice(0, 3) + '...' + transaction['to_address'].slice(-15),
                    })
                }
            })
        })
        const nodesUrl = BackEnd.getAllBackendUrls()
        let urlSource=""
        for (const url of nodesUrl) {
            try {
                const id = await BackEnd.get_blockchain_id(url)
                if (id == source_blockchain_id) {
                    urlSource = url
                }
            } catch (e) {
                if (e.code!="ECONNREFUSED") {
                    throw (e)
                }
            }

        }
        return {
            transactions: ret,
            source_blockchain_id: source_blockchain_id,
            urlSource : urlSource
        }
    }

    static async create_key() {
        const data = JSON.stringify({});
        const config = {
            method: 'get',
            url: `${BackEnd.getCurrentBackendUrl()}/create_key`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        const response = await axios(config)
        const ret = response.data ["result"]
        return ret;
    }

    static async get_wallets() {
        const data = JSON.stringify({});
        const config = {
            method: 'get',
            url: `${BackEnd.getCurrentBackendUrl()}/get_wallets`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        const response = await axios(config)
        const ret = response.data ["result"]
        return ret;
    }

    static async add_credit_card_transaction(fromAddress, toAddress, fromPrivateKey, amount, creditCardName,
                                             creditCardNumber, creditCardDate, creditCardPict) {
        const data = JSON.stringify({
            "from_address": fromAddress,
            "to_address": toAddress,
            "from_private_key": fromPrivateKey,
            "amount": amount,
            "credit_card_cc_number": creditCardNumber,
            "credit_card_cc_date": creditCardDate,
            "credit_card_cc_pict": creditCardPict,
            "credit_card_cc_name": creditCardName,
            "is_credit_card": true
        });
        const config = {
            method: 'post',
            url: `${BackEnd.getCurrentBackendUrl()}/add_to_pending_transactions`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        try {
            const response = await axios(config)
            if (response.data ["status"] != "success") {
                throw ("Credit Card Transaction failed")
            }
            return response['data']['result']
            return response["data"]["result"]
        } catch (e) {
            throw ("Credit Card Transaction failed")
        }
    }


    static async add_transaction(fromAddress, toAddress, fromPrivateKey, amount) {
        const data = JSON.stringify({
            "from_address": fromAddress,
            "to_address": toAddress,
            "from_private_key": fromPrivateKey,
            "amount": amount,
            "is_credit_card": false
        });
        const config = {
            method: 'post',
            url: `${BackEnd.getCurrentBackendUrl()}/add_to_pending_transactions`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        try {
            const response = await axios(config)
            if (response.data ["status"] != "success") {
                throw ("Transaction failed")
            }
            return response['data']['result']
        } catch (e) {
            throw ("Transaction failed")
        }
    }

    static async register(loginemail, loginpwd, formAmountOnCard, formNameOnCard, formCardNumber, formExpiration, formCVV) {
        const keys = await BackEnd.create_key()
        await User.registerUser(loginemail, loginpwd, keys['public']);
        const result = await BackEnd.add_credit_card_transaction(
            keys['public'],
            keys['public'],
            keys['private'],
            formAmountOnCard ,
            formNameOnCard,
            formCardNumber,
            formExpiration,
            formCVV)
        return {keys, transaction: result}
    }

    static async get_balance_for_wallet(wallet, url = null) {
        const data = JSON.stringify({
            "wallet": wallet
        });
        const backendUrl = (url ? url : `${BackEnd.getCurrentBackendUrl()}`) + "/balance_for"
        const config = {
            method: 'get',
            url: backendUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data,
            beforeSend: function (request) {
                request.setRequestHeader("Authority", authorizationToken);
            },
        };
        try {
            const response = await axios(config)
            if (response.data ["status"] != "success") {
                throw ("Failed to get balance")
            }
            return response.data ["result"]
        } catch (e) {
            throw ("Failed to get balance")
        }
    }

    static async configureNetwork() {
        const config = BackEnd.getAllBackendTopologyUrls();
        const urls = BackEnd.getAllBackendUrls()
        for (const url of urls) {
            const otherUrls = config[url]
            for (const otherurl of otherUrls) {
                if (otherurl != url) {
                    const data = JSON.stringify({
                        "nodeUrl": otherurl
                    });
                    const config = {
                        method: 'post',
                        url: url + '/register-and-broadcast-nodes',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: data
                    };
                    try {
                        const response = await axios(config)
                        if (response.data ["status"] != "success") {
                            throw ("Failed to configure network")
                        }
                    } catch (e) {
                        if (e["code"] != "ECONNREFUSED") {
                            console.log(e)
                            throw ("Failed to configure network")
                        }
                    }
                }
            }
        }
        return await BackEnd.describeNetwork();
    }
}

module.exports = BackEnd
