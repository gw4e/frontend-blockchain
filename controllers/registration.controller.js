const User = require("../model/User");
const BackEnd = require("../services/backend");

exports.registration = async (req, res) => {
    try {
        const result = await BackEnd.register(req.body.loginemail, req.body.loginpwd,
            req.body.formAmountOnCard, req.body.formNameOnCard,
            req.body.formCardNumber, req.body.formExpiration, req.body.formCVV)
        res.render('pages/register', {
            current : "register",
            private_key: result['keys']['private'],
            public_key: result['keys']['public'],
            user: null,
            error: null
        });
    } catch (e) {
        User.unRegisterUser(req.body.loginemail);
        res.render('pages/register', {
            current : "register",
            private_key: null,
            public_key: null,
            user: req.session.user,
            error: "Failed to register"
        });
    }
};

exports.register = async (req, res) => {
    res.render('pages/register', {
        current : "register",
        private_key:null,
        public_key:null,
        user: null,
        error: null
    });
};


