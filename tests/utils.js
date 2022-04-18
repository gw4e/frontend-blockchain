const { spawn } = require('child_process');
const waitOn = require('wait-on');

const {Server} = require("../server");

require('dotenv').config();

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFor(func, context, onfail, timeout) {
    let exc = null;
    const timeoutStart = new Date().getTime()
    while (new Date().getTime() < timeoutStart + timeout) {
        try {
            const result = await func(context);
            if (result)
                return;
        } catch (e) {
            exc = e;
            await sleep(3000);
            await onfail();
        }
    }
    throw exc;
}

async function startBackends() {
    await spawn(
        `start_nodes.sh`,
        [],
        {
            shell: true,
            cwd: `${process.env.BACKEND_EXECUTABLE}`
        },
    );
    const opts = {
        resources: [
            'http://localhost:3001/status',
            'http://localhost:3002/status',
            'http://localhost:3003/status',
        ],
        delay: 1000,
        interval: 100,
        simultaneous: 1,
        timeout: 30000,
        tcpTimeout: 1000,
        window: 1000,
        validateStatus: function (status) {
            return status >= 200 && status < 300;
        }
    };
    await waitOn(opts, undefined);

};

async function stopBackends() {
    await spawn(
        `stop_nodes.sh`,
        [],
        {
            shell: true,
            cwd: `${process.env.BACKEND_EXECUTABLE}`
        },
    );
    const opts = {
        resources: [
            'http://localhost:3001/status',
            'http://localhost:3002/status',
            'http://localhost:3003/status',
        ],
        reverse: true,
        delay: 1000,
        interval: 100,
        simultaneous: 1,
        timeout: 15000,
        tcpTimeout: 1000,
        window: 1000,
        validateStatus: function (status) {
            return status >= 200 && status < 300;
        }
    };
    await waitOn(opts, undefined);

};

async function startFrontEnd() {
    Server.start();
    const opts = {
        resources: [
            'http://localhost:8080',
        ],
        delay: 1000,
        interval: 100,
        simultaneous: 1,
        timeout: 30000,
        tcpTimeout: 1000,
        window: 1000,
        validateStatus: function (status) {
            return status >= 200 && status < 300;
        }
    };
    await waitOn(opts, undefined);
};

async function stopFrontEnd() {
    Server.stop();
    const opts = {
        resources: [
            'http://localhost:8080'
        ],
        reverse: true,
        delay: 1000,
        interval: 100,
        simultaneous: 1,
        timeout: 30000,
        tcpTimeout: 1000,
        window: 1000,
        validateStatus: function (status) {
            return status >= 200 && status < 300;
        }
    };
    await waitOn(opts, undefined);
};
module.exports = { startBackends, stopBackends, startFrontEnd, stopFrontEnd, sleep , waitFor};
