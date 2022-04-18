const BaseComponent = require ("./baseComponent");
const HomePage = require ("./HomePage");
const SignInPage = require ("./SignInPage");
const TransactionPage = require("./TransactionPage");
const ConfigurePage = require("./ConfigurePage");
const ExplorerPage = require("./ExplorerPage");


class NavMenu extends BaseComponent {
  constructor(page) {
    super(page);
  }

  async openHomePage() {
    await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle2' }), await this.page.goto(`http://localhost:8080`)]);
    return new HomePage(this.page);
  }

  async openSignInPage() {
    await this.openHomePage()
    await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle2' }), await this.page.click("#navbar-signin")]);
    return new SignInPage(this.page);
  }

  async openTransactionPage() {
    await this.openHomePage()
    await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle2' }), await this.page.click("#navbar-transaction")]);
    return new TransactionPage(this.page);
  }

  async openConfigurePage() {
    await this.openHomePage()
    await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle2' }), await this.page.click("#navbar-configure")]);
    return new ConfigurePage(this.page);
  }

  async openExplorerPage() {
    await this.openHomePage()
    await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle2' }), await this.page.click("#navbar-explorer")]);
    return new ExplorerPage(this.page);
  }

  async getSignedUser () {
    const user = await this.getText('#navbar-email')
    return user
  }
}

module.exports = NavMenu;
