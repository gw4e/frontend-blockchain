const BaseComponent = require ("./BaseComponent");

class ConfigurePage extends BaseComponent {
    constructor(page) {
        super(page);
    }

    async configure() {
        await this.page.click("#configure");
    }

}

module.exports = ConfigurePage;
