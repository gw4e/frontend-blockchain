
const express = require('express');
const session = require('express-session');
const authController = require("./controllers/auth.controller");
const homeController = require("./controllers/home.controller");
const registrationController = require("./controllers/registration.controller");
const exchangeController = require("./controllers/transactions.controller");
const serviceController = require("./controllers/service.controller");
const explorerController = require("./controllers/explorer.controller");
const configureController = require("./controllers/configure.controller");
const testController = require("./controllers/test.controller");
const {checkPasswordMatch, checkDuplicateEmail} = require("./middleware/verifyRegistration");;
const bodyParser = require("express");
const {checkLogin} = require("./middleware/verifyLogin");
const {checkBackend} = require("./middleware/checkBackend");
const Backend = require("./services/backend");


class Server {
    server=null;
    static start () {
        if (Server.server)
            return;
        const app = Server.createServer();
        Server.server = app.listen(8080 , async () => {
            const ping = await Backend.init();
            if (ping) {
                await testController.registerUsers(["a@gmail.com","b@gmail.com","c@gmail.com","d@gmail.com"])
            } else {
                console.log('No target backends !');
            }
        });
        process.on('SIGTERM', Server.stop);
        process.on('SIGINT', Server.stop);
        console.log('Server started');
    }

    static stop() {
        Server.server ? Server.server.close(() => {
        }) : "";
    }

    static createServer ()  {
        const app = express();
        app.set('view engine', 'ejs');
        app.use(express.static('public'));
        app.use(express.urlencoded({ extended: false }))
        app.use(session({
            resave: false,
            saveUninitialized: false,
            secret: 'very secret',
            cookie: {
                secure: false
            },
        }));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(function(req, res, next){
            var err = req.session.error;
            delete req.session.error;
            res.locals.message = '';
            res.locals.error = false;
            if (err) {
                res.locals.error = true;
                res.locals.message = '<p class="msg error">' + err + '</p>';
            }
            next();
        });

        app.get('/', homeController.home);
        app.get('/home', homeController.home );
        app.get('/exchange',[checkBackend,checkLogin], exchangeController.exchange );
        app.post('/exchange',[checkBackend,checkLogin], exchangeController.proceedExchange );
        app.get('/explorer',[checkBackend,checkLogin], explorerController.explore);
        app.get('/register', [checkBackend],registrationController.register);
        app.post('/register',[checkBackend, checkDuplicateEmail, checkPasswordMatch], registrationController.registration);
        app.get('/logout', [checkBackend,checkLogin], authController.signout);
        app.post('/login',[checkBackend], authController.signin);
        app.get('/login', [checkBackend],authController.login);
        app.post('/get_balance',[checkBackend,checkLogin], [checkLogin], serviceController.getBalanceForWallet);
        app.get('/describeBlockchain',[checkBackend,checkLogin], serviceController.describeBlockchain);
        app.get('/displaynetwork',[checkBackend,checkLogin], configureController.displayNetwork);
        app.get('/configurepause',[checkBackend,checkLogin], configureController.displayConfigurationPause);
        app.post('/configurepause',[checkBackend,checkLogin], configureController.configurePause);
        app.post('/configure', [checkBackend], serviceController.configureNetwork);
        app.get('/test', [checkBackend],testController.test);
        app.post('/test',[checkBackend], testController.createuser);
        return app;
    }
}

module.exports = { Server };

