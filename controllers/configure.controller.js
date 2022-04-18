const BackEnd = require("../services/backend");
const User = require("../model/User");
const {configureNetwork} = require("./service.controller");

exports.displayNetwork = async (req, res) => {
    try {
        res.render('pages/configure', {
            current : "configure",
            user: req.session.user,
            error: null,
        });
    } catch (e) {
        res.render('pages/configure', {
            current: "configure",
            user: req.session.user,
            error: e,
        })
    }
};

