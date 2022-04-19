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

exports.displayConfigurationPause = async (req, res) => {
    try {
        res.render('pages/pause', {
            current : "configure",
            user: req.session.user,
            url: req.query.url,
            error: null,
        });
    } catch (e) {
        res.render('pages/pause', {
            current: "configure",
            user: req.session.user,
            url: req.query.url,
            error: e,
        })
    }
};

exports.configurePause = async (req, res) => {
    const keys = await BackEnd.updateMinerPause(req.body.targetUrl, req.body.pause)
    try {
        res.render('pages/configure', {
            current : "configure",
            user: req.session.user,
            error: null,
        });
    } catch (e) {
        res.render('pages/pause', {
            current: "configure",
            user: req.session.user,
            error: e,
        })
    }
};


