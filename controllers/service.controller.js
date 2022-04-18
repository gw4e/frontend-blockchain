
const BackEnd = require("../services/backend");

exports.getBalanceForWallet = async (req, res) => {
    try {
        const balance = await BackEnd.get_balance_for_wallet(req.body.wallet, req.body.targetBackend)
        res.json({ value: balance })
        res.status(200);
    } catch (e) {
        res.status(500);
    }
    res.end()
};

exports.describeBlockchain = async (req, res) => {
    try {
        const desc = await BackEnd.describe_blockchain(req.query.targetBackend, req.query.wallet)
        res.json({ desc: desc })
        res.status(200);
    } catch (e) {
        res.status(500);
    }
    res.end()
};

exports.configureNetwork = async (req, res) => {
    try {
        ret = [];
        const nodes = await BackEnd.configureNetwork();
        nodes.forEach((node) => {
            node.other_nodes.forEach((other) => {
                ret.push({
                    node : node.url,
                    contact : other
                })
            })
        })
        res.json({ desc: ret })
        res.status(200);
    } catch (e) {
        res.status(500);
    }
    res.end()
};

