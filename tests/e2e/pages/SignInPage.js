const BaseComponent = require ("./BaseComponent");
const RegistrationStep1Page = require("./RegistrationStep1Page");

class SignInPage extends BaseComponent {
    constructor(page) {
        super(page);
    }

    async signin(email,pwd) {
        await this.setValue("#loginemail", email);
        await this.setValue("#loginpwd", pwd);
        await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle2' }), await this.page.click("#login")]);
        await this.page.waitForSelector("#navbar-email");
    }

    async signOut() {
        await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle2' }), await this.page.click("#navbar-email")]);
        await this.page.waitForSelector("#navbar-signin");
    }

    async gotoRegisterPage() {
        await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle2' }), await this.page.click("#register")]);
        return new RegistrationStep1Page(this.page);
    }
}

module.exports = SignInPage;
