const BackEnd = require("../services/backend");
const User = require("../model/User");


exports.proceedExchange = async (req, res) => {
    const sourcePublicKey = User.findPublicKeysFromWalletsName(req.session.user.name)
    const keys = await BackEnd.get_wallets()
    try {
        const walletsName = User.findWalletsNameFromPublicKeys(keys)
        const amounttotransfer = req.body.amounttotransfer
        let targetwallet = req.body.targetwallet
        if (targetwallet && targetwallet.startsWith("Choose")) {
            throw new Error ("Invalid target wallet")
        }
        const sourcePrivatekey = req.body.privatekey
        const targetPublicKey = User.findPublicKeysFromWalletsName(targetwallet)
        BackEnd.setCurrentBackendUrl(req.body.targetnode)
        await BackEnd.add_transaction(sourcePublicKey, targetPublicKey, sourcePrivatekey, amounttotransfer)
        res.render('pages/transactions', {
            current : "transactions",
            user: req.session.user,
            error: null,
            transactionProcessingMessage: "Transaction sent to the blockchain",
            walletsName : walletsName,
            accountBalance: '',
            currentBackendUrl:BackEnd.getCurrentBackendUrl(),
            backendUrls: BackEnd.getAllBackendUrls(),
            sourcePublicKey:sourcePublicKey
        });
    } catch (e) {
        res.render('pages/transactions', {
            current: "transactions",
            user: req.session.user,
            error: e,
            transactionProcessingMessage: "Transaction not sent to the blockchain",
            walletsName: User.findWalletsNameFromPublicKeys(keys),
            accountBalance: '',
            currentBackendUrl:BackEnd.getCurrentBackendUrl(),
            backendUrls: BackEnd.getAllBackendUrls(),
            sourcePublicKey:sourcePublicKey
        })
    }
};
exports.exchange = async (req, res) => {

    try {
        const sourcePublicKey = User.findPublicKeysFromWalletsName(req.session.user.name)
        const keys = await BackEnd.get_wallets()
        const walletsName = User.findWalletsNameFromPublicKeys(keys)
        const balance = await BackEnd.get_balance_for_wallet(sourcePublicKey)
        res.render('pages/transactions', {
            current : "transactions",
            user: req.session.user,
            error: null,
            transactionProcessingMessage:null,
            walletsName : walletsName,
            accountBalance: balance,
            currentBackendUrl:BackEnd.getCurrentBackendUrl(),
            backendUrls: BackEnd.getAllBackendUrls(),
            sourcePublicKey:sourcePublicKey
        });
    } catch (e) {
        res.render('pages/transactions', {
            current: "transactions",
            user: req.session.user,
            error: e,
            transactionProcessingMessage:null,
            walletsName: null,
            accountBalance: '',
            currentBackendUrl:BackEnd.getCurrentBackendUrl(),
            backendUrls: BackEnd.getAllBackendUrls(),
            sourcePublicKey:''
        })
    }
};
