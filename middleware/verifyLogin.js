const User = require('../model/User')

exports.checkLogin = async (req, res, next) => {
    if (!req.session.user) {
        res.render('pages/login', {
            current : "login",
            user: null,
            private_key:null,
            error: ""
        });
    } else {
        next ()
    }
};

