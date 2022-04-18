
const jestPuppeteerConf = {
  exitOnPageError: false,
  launch: {
    timeout: 30000,
    dumpio: true,
    headless: false,
    args: ['--window-size=1920,1080'],
    defaultViewport: null,
  },
};


module.exports = jestPuppeteerConf;
