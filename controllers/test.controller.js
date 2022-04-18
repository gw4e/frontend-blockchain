const BackEnd = require("../services/backend");
const User = require("../model/User");

async function create (email) {
    try {
        const keys = await BackEnd.create_key()
        const pwd = email.split('@')[0]
        await User.registerUser(email, pwd, keys['public']);
        await BackEnd.add_credit_card_transaction(
            keys['public'],
            keys['public'],
            keys['private'],
            100 ,
            "John doe",
            "4387729175443174",
            "2027-08-31",
            302)
        console.log(`User ${email} registered ${keys['private']}`);
    } catch (e) {
        console.log(e)
        User.unRegisterUser(email);
    }
}

exports.registerUsers = async (usernames) => {
    for (let index = 0; index < usernames.length; index++) {
        await create(usernames[index])
    }
}

exports.createuser = async (req, res) => {
    const usernames = req.body.usersemail.split(',')
    await registerUsers(usernames);
    res.render('pages/home', {
        current : "home",
        private_key: null,
        user: req.session.user,
        error: null
    });
};

exports.test = async (req, res) => {
    res.render('pages/test', {
        current : "test",
        private_key:null,
        user: req.session.user,
        error: null
    });
};
