const hash = require('pbkdf2-password')()


const User = require('../model/User')

exports.signin = async (req, res) => {
    try {
        function authenticate(name, pass, fn) {
            const user = User.users[name];
            if (!user) return fn(null, null)
            hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
                if (err) return fn(err);
                if (hash === user.hash)
                    return fn(null, user)
                fn(null, null)
            });
        }
        // const user = await User.exists(req.body.loginemail)
        authenticate(req.body.loginemail, req.body.loginpwd, function(err, user){
            if (err) return next(err)
            if (user) {
                req.session.regenerate(function(){
                    req.session.user = user;
                    res.redirect('/home');
                });
            } else {
                req.session.error = 'Authentication failed';
                res.redirect('/login');
            }
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.signout = async (req, res) => {
    try {
        req.session.user = null
        res.redirect('/home');
    } catch (err) {
       console.log(err)
    }
};


exports.login = async (req, res) => {
    res.render('pages/login', {
        current : "login",
        user: null,
        error: res.locals.error
    });
};
