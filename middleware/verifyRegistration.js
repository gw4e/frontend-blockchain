const User = require('../model/User')

exports.checkDuplicateEmail = async (req, res, next) => {
    try {
        const user = await User.exists(req.body.loginemail)
        if (user) {
            res.render('pages/register', {
                current : "register",
                user: null,
                private_key:null,
                error: 'Email already used.'
            });
        } else {
            next ()
        }
    } catch (error) {
        return res.status(500).send({
            message: "Unable to checkDuplicateEmail"
        });
    }
};

exports.checkPasswordMatch = async (req, res, next) => {
    try {
        if (req.body.loginpwd != req.body["loginpwdverif"]) {
            res.render('pages/register', {
                current : "register",
                user: null,
                private_key:null,
                error: 'Passwords mismatch.'
            });
        } else {
            next ()
        }
    } catch (error) {
        return res.status(500).send({
            message: "Unable to checkDuplicateEmail"
        });
    }
};
