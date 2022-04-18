const BaseComponent = require ("./BaseComponent");
const {sleep, waitFor} = require("../../utils");


class ExplorerPage extends BaseComponent {
    constructor(page) {
        super(page);
    }

    async getRowData () {
        const data = await this.getData();
        const ret = []
        let index = 0
        while (index < data.length) {
            const blockid = data [index];
            const timestamp = data [index+1];
            const nonce = data [index+2];
            const amount = data [index+3];
            const from = data [index+4];
            const to = data [index+5];
            ret.push({
                blockid,timestamp,nonce,amount,from,to
            })
            index=index+6;
        }
        return ret;
    }

    async getData() {
        const data = await this.page.$$eval('table tr td', tds => tds.map((td) => {
            return td.innerText;
        }));
        return data;
    }

    async waitForData(timeout= 3000) {
        const func = async (context) => {
            await sleep(1000);
            const data = await this.getData();
            if (data[0] != "No matching records found") {
                return true;
            }
            throw Error('table not loaded...');
        }
        const onFail = async () => {
            await Promise.resolve();
        }
        await waitFor(func, {}, onFail, timeout)
    }

    async exploreNode(node) {
        await this.page.select('#targetnode', node);
        await this.waitForData(30000);
     }

    async exploreWallet(wallet) {;
        await this.page.select('#targetwallet', wallet);
        const data = await this.getRowData();
        return data;
    }

    async waitForTransactionInNodeWithAmount(node,email, amount, timeout) {
        await this.exploreNode(node);
        const waitForData = async (timeout) => {
            const func = async (context) => {
                await sleep(1000);
                const rowData = await this.exploreWallet(email);
                const t = rowData.filter((row) => {
                    return row.amount == amount
                });
                if (t.length > 0) {
                    return true;
                }
                throw Error('amount not found...');
            }
            const onFail = async () => {
                await Promise.resolve();
            }
            await waitFor(func, {}, onFail, timeout)
        }
        await waitForData(timeout);
    }

}

module.exports = ExplorerPage;
