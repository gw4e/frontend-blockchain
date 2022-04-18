const BaseComponent = require ("./BaseComponent");

class RegistrationStep2Page extends BaseComponent {
    constructor(page) {
        super(page);
    }

    async getPrivateKey () {
        const value = await this.getValue("#userkey")
        return value;
    }

    async getPublicKey () {
        const value = await this.getValue("#userpublickey")
        return value;
    }


    async gotoSignIn () {
        // avoid circular dependencies - require here the class
        const SignInPage = require ("./SignInPage");
        await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle2' }), await this.page.click("#signin")]);
        return new SignInPage(this.page);
    }
}


module.exports = RegistrationStep2Page;
