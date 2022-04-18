const Backend = require("../services/backend");


exports.checkBackend = async (req, res, next) => {
    const exists = await Backend.init()
    if (!exists) {
        console.log('Backend not started')
        res.render('pages/home', {
            current : "home",
            user: null,
            private_key:null,
            error: ""
        });
    } else {
        next ()
    }
};
