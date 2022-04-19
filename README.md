
A Decentralized Application is a piece of software that has its backend code running on a decentralized peer to peer network. This project holds the frontend part that connects with the backend to provide its features. If you did not yet read the backend [documentation](https://github.com/gw4e/backend-blockchain/blob/main/README.md), please do so !

## Features
With the front -, you will be able to :

- Create an account and register to become a Pyciotr trader :-)
- Sign-In the Pycotr web site
- Configure the network nodes
- Submit transactions
- Explore the content of the blockchain for each of the nodes


## Tech

Pycotr FrontEnd uses a number of techno. to work properly:

- [Javascript/JQuery/Bootstrap/EJS] - To write this frontend
- [Express] - As web server
- [Jest] - For Unit and Integration tests
- [Pupetteer] - For e2e tests

## Install & Run

PyCotr FrontEnd requires [npm](https://www.npmjs.com/)

Install the dependencies and start the server.

- Install [npm](https://www.npmjs.com/)
- Checkout the project
- Run **npm i**
- Run **start.sh**

## Testing
Execute unit tests and integration tests by running **npm run test**
Execute e2e tests by running **npm run test:e2e**

## Debugging
Start in debug mode the **main.js** file.

## Usage:
#### To launch the web server
- Run **start.sh**

#### To register
<p align="left" width="100%">
    <img width="33%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/register.png?raw=true">
</p>

- In a browser, enter http://localhost:8080
- Click Sign-In link
- At the bottom of the page, click the Register link
- Feed the form (keep the provided fake values)
- Click Register

<p align="left" width="100%">
    <img width="33%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/regsitration_details.png?raw=true">
</p>

- Copy the private key
- Click Sign-In

#### To Sign-In
<p align="left" width="100%">
    <img width="33%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/sign-in.png?raw=true">
</p>

- Feed the form with the **email prefix** (for example 'test'  if you've registered with test@gg.com)
- Click Sign-In

#### To Configure the network (mandatory steps)
<p align="left" width="100%">
    <img width="33%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/configure_step_1.png?raw=true">
</p>

- Click Configure in the navigation bar
- Click the configure button

<p align="left" width="100%">
    <img width="33%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/configure_step_2.png?raw=true">
</p>

- The network configuration is displayed

#### To Submit a transaction 


## Disclaimer:
This project is only for educational or learning purpose. Use at your own risk.

## License
MIT


