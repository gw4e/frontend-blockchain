const {startBackends, stopBackends, startFrontEnd, stopFrontEnd, sleep, waitFor} = require("../utils");
const NavMenu = require("./pages/NavMenu");

jest.setTimeout(1000 * 60 * 3)

describe('Pycotr E2E tests', () => {
    beforeAll(async () => {
        await startBackends();
        await startFrontEnd();
    });

    afterAll(async () => {
        await stopFrontEnd();
        await stopBackends()
    });

    async function registerUser(user, email, pwd, amount) {
        const menu = new NavMenu(page);
        let signInPage = await menu.openSignInPage();
        const registrationPage = await signInPage.gotoRegisterPage();
        const registrationPage2 = await registrationPage.register(email, pwd, pwd, "333");
        const privateKey = await registrationPage2.getPrivateKey();
        const publicKey = await registrationPage2.getPublicKey();
        expect(privateKey.length).toBeGreaterThan(0);
        expect(publicKey.length).toBeGreaterThan(0);
        signInPage = await registrationPage2.gotoSignIn();
        await signInPage.signin(user, pwd)
        const signedUser = await menu.getSignedUser();
        await signInPage.signOut()
        expect(signedUser).toEqual(email);
        return {
            user,
            pwd,
            email,
            privateKey,
            publicKey
        }
    }

    it('can register, signin, submit a transaction, view the transaction, signout', async () => {
        const menu = new NavMenu(page);
        // Register User 1
        const userName1 = "user1_" + new Date().getTime();
        const user1 = await registerUser (userName1, userName1 + "@gg.com", "pwd", 333);
        // Register User 2
        const userName2 = "user2_" + new Date().getTime();
        const user2 = await registerUser (userName2, userName2, "pwd", 111);
        // SignIn User 1
        const signInPage = await menu.openSignInPage();
        await signInPage.signin(user1.user, user1.pwd);
        // Configure the nodes so that they know each others
        const configPage = await menu.openConfigurePage();
        await configPage.configure();
        // User 1 send money to User 2
        // Notice that the transaction is sent to Node http://localhost:3003
        const transactionPage = await menu.openTransactionPage()
        await transactionPage.submitTransaction("http://localhost:3003",user2.email,"12", user1.privateKey)
        await transactionPage.waitForTransactionMessage("Transaction sent to the blockchain");
        // As we should find all transactions in all nodes, we will check on node "http://localhost:3001"
        const explorerPage = await menu.openExplorerPage();
        await explorerPage.waitForTransactionInNodeWithAmount("http://localhost:3001", user1.email, 12, 15000);
        //
    });
});
