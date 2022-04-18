const BackEnd = require("../services/backend");
const User = require("../model/User");

exports.explore = async (req, res) => {
    const keys = await BackEnd.get_wallets()
    const walletsName = User.findWalletsNameFromPublicKeys(keys)
    try {
        res.render('pages/explorer', {
            current : "explorer",
            user: req.session.user,
            error: null,
            currentBackendUrl:BackEnd.getCurrentBackendUrl(),
            backendUrls: BackEnd.getAllBackendUrls(),
            walletsName:walletsName,
        });
    } catch (e) {
        res.render('pages/explorer', {
            current: "explorer",
            user: req.session.user,
            error: e,
            currentBackendUrl:BackEnd.getCurrentBackendUrl(),
            backendUrls: BackEnd.getAllBackendUrls(),
            walletsName:walletsName,
            source_blockchain_id: ""
        })
    }
};

