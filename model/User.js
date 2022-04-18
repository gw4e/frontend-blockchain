const hash = require('pbkdf2-password')()

class User {
    static users = {}
    static unRegisterUser(email) {
        try {
            const key = email.split('@')[0]
            delete User.users[key];
        } catch(e) {
            delete User.users[email];
        }

    }


    static findPublicKeysFromWalletsName(walletName) {
        if (!walletName) return null
        const asArray = Object.values(User.users);
        const user = asArray.filter(usr => {
            return usr.name == walletName
        })
        return user[0].public_key;
    }

    static findWalletsNameFromPublicKeys(public_keys) {
        const asArray = Object.values(User.users);
        const knownUsers = asArray.filter(user => {
            return public_keys.includes(user.public_key)
        })
        const ret = knownUsers.map(user => user.name)
        return ret;
    }

    static hashPassword(key, pwd) {
        return new Promise((resolve, reject) => {
            hash({ password: pwd }, function (err, pass, salt, hash) {
                if (err) throw reject(err);
                User.users[key].salt = salt;
                User.users[key].hash = hash;
                resolve()
            });
        });
    }

    static async registerUser(email, pwd, public_key) {
        const key = email.split('@')[0]
        User.users[key] = { name: email , public_key: public_key};
        await User.hashPassword(key, pwd)
    }

    static exists(email) {
        return User.users[email] != null
    }
}


module.exports = User
