const BaseComponent = require ("./BaseComponent");
const {sleep, waitFor} = require("../../utils");


class TransactionPage extends BaseComponent {
    constructor(page) {
        super(page);
    }



    async waitForBalance(node, timeout=3000) {
        const func = async (context) => {
            await this.page.select('#targetnode', context.node);
            await sleep(1000);
            const value = await this.getValue("#accountbalance")
            if (parseInt(value) > 0) {
                return true;
            }
            throw Error('balance not ready...');
        }
        const onFail = async () => {
            await this.page.reload({ waitUntil: ['load', 'networkidle2'] });
        }
        await waitFor(func, {node : node}, onFail, timeout)
    }

    async waitForTransactionMessage(msg, timeout= 3000) {
        const func = async (context) => {
            const value = await this.getValue("#transactionmessage")
            if (value == context.msg) {
                return true;
            }
            throw Error('Transaction message not ready...');
        }
        const onFail = async () => {
            await Promise.resolve();
        }
        await waitFor(func, {context: msg}, onFail, timeout)
    }

    async submitTransaction(node, wallet, amount, key) {
        await this.waitForBalance(node, 1000 * 30);
        await this.page.select('#targetnode', node)
        await this.setValue('#amounttotransfer', amount)
        await this.page.select('#targetwallet', wallet)
        await this.setValue('#privatekey', key)
        await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle2' }), await this.page.click("#proceed")]);
    }
}

module.exports = TransactionPage;
