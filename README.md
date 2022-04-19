## Pycotr FrontEnd
### _A blockchain front end for a naive cryptocurrency_

### Pycotr <img src="http://github.com/gw4e/frontend-blockchain/blob/main/public/images/brand-white.png?raw=true" data-canonical-src="http://github.com/gw4e/frontend-blockchain/blob/main/public/images/brand-white.png" width="30" height="30" /> FrontEnd

<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/home.png?raw=true">
</p>

A Decentralized Application is a piece of software that has its backend code running on a decentralized peer to peer network. 
This project holds the frontend part that connects with the backend to provide its features. If you did not yet read the backend [documentation](https://github.com/gw4e/backend-blockchain/blob/main/README.md), please do so !

## Features
With the front, you will be able to :

- Create an account and register to become a Pycotr trader :-)
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
Execute unit tests and integration tests by running **npm run test**<br>
Execute e2e tests by running **npm run test:e2e**

## Debugging
Start in debug mode the **main.js** file.

## Usage:
#### To launch the web server
- Run **start.sh**

#### To register
<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/register.png?raw=true">
</p>

- In a browser, enter http://localhost:8080
- Click Sign-In link
- At the bottom of the page, click the Register link
- Feed the form (keep the provided fake values)
- Click Register

<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/regsitration_details.png?raw=true">
</p>

- Copy the private key
- Click Sign-In

#### To Sign-In
<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/sign-in.png?raw=true">
</p>

- Feed the form with the **email prefix** (for example 'test'  if you've registered with test@gg.com)
- Click Sign-In

#### To Configure the network (mandatory steps)
<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/configure_step_1.png?raw=true">
</p>

- Click Configure in the navigation bar
- Click the configure button

<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/configure_step_2.png?raw=true">
</p>

- The network configuration is displayed

#### To Submit a transaction 

Submitting a transaction means that you will send a certain amount of Pycotr currency from a wallet to another wallet.
Whenever a user registers, a public and private key are generated. Do you remember, you copied the private key when you've registred earlier.
As a wallet is represented by a public key, before being able to submit a transaction we need a second user.

- Click the email in the upper right corner of the web page, this will signout you 
- Proceed as you did in step **To register** in order to create this second user.
- Now we have 2 users registered, sign-in with the first user

<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/transaction_step_1.png?raw=true">
</p>

- Click **Transaction** menu item in the navigation bar

<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/transaction_step_2.png?raw=true">
</p>

- Select the node "http://localhost:3003" as **Target Blockchain Network Node**
- Enter an amount **Transaction Amount**
- Select the email of the second user as **Target Wallet**
- Enter the private key of the first registered user
- Click **Proceed**

<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/transaction_step_3.png?raw=true">
</p>

- The transaction has been submitted on node "http://localhost:3003"
- The transaction will be broadcast to other nodes

Each node for tutorial purpose , mine the transactions at a different rate.

- Node 1 : "http://localhost:3001" --> 5sec
- Node 2 : "http://localhost:3002" --> 10sec
- Node 3 : "http://localhost:3003" --> 15sec

This leads the Node 1 to win the consensus whenever one of the other nodes send their blockcahin to challenge it since it will always have the longest one.<br>
See [Consensus or The Longest Chain rule](https://github.com/gw4e/backend-blockchain/blob/main/README.md) in the backend doc for more information on consensus.


#### To Explorer the transactions
<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/explore_step_1.png?raw=true">
</p>

- Click Explore in the navigation bar
- Select the node "http://localhost:3001"
- Select the email of the user 1
- You can see all transactions belonging to this user

<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/explore_step_2.png?raw=true">
</p>

Remember that each node has its own blockchain, and even you've submitted the transaction to node "http://localhost:3003", 
and because all transactions are broadcast, node "http://localhost:3001" has mined it before all other nodes see it and won the consensus.

To see that other nodes have agreed on blockchain maintained by the node "http://localhost:3001" , 
- Click Explore in the navigation bar
- Select the node "http://localhost:3002"
- Move your cursor to the information at the end of the node select box
- A tooltip appears and display from which node the current blockchain of the selected node comes from

<p align="left" width="100%">
    <img width="50%" src="https://github.com/gw4e/frontend-blockchain/blob/main/doc/explore_step_3.png?raw=true">
</p>

## Disclaimer:
This project is only for educational or learning purpose. Use at your own risk.

## License
MIT


