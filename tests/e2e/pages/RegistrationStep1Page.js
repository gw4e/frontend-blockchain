const BaseComponent = require ("./BaseComponent");
const RegistrationStep2Page = require ("./RegistrationStep2Page");

class RegistrationStep1Page extends BaseComponent {
    constructor(page) {
        super(page);
    }

    async register (loginemail,loginpwd,loginpwdverif,formAmountOnCard) {
        await this.setValue("#loginemail", loginemail);
        await this.setValue("#loginpwd", loginpwd);
        await this.setValue("#loginpwdverif", loginpwdverif);
        await this.setValue("#formAmountOnCard", formAmountOnCard);
        await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle2' }), await this.page.click("#register")]);
        return new RegistrationStep2Page(this.page);
    }
}


module.exports = RegistrationStep1Page;
