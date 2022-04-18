class BaseComponent {
  page;
  constructor(p) {
    this.page = p;
  }

  async setValue(id, value) {
    const element = await this.page.$(id);
    await element.focus();
    await element.type(value);
  }

  async getValue (id) {
    const handle = await this.page.$(id);
    const value = await this.page.evaluate(x => x.value, handle);
    return value;
  }

  async getText (id) {
    const handle = await this.page.$(id);
    const value = await this.page.evaluate(x => x.text, handle);
    return value;
  }
}

module.exports = BaseComponent;
