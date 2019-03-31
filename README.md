[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bearshares/bears-js/blob/master/LICENSE)

# Bears.js
Bears.js the JavaScript API for Bears blockchain

# Documentation

- [Install](https://github.com/bearshares/bears-js/tree/master/doc#install)
- [Browser](https://github.com/bearshares/bears-js/tree/master/doc#browser)
- [Config](https://github.com/bearshares/bears-js/tree/master/doc#config)
- [Database API](https://github.com/bearshares/bears-js/tree/master/doc#api)
    - [Subscriptions](https://github.com/bearshares/bears-js/tree/master/doc#subscriptions)
    - [Tags](https://github.com/bearshares/bears-js/tree/master/doc#tags)
    - [Blocks and transactions](https://github.com/bearshares/bears-js/tree/master/doc#blocks-and-transactions)
    - [Globals](https://github.com/bearshares/bears-js/tree/master/doc#globals)
    - [Keys](https://github.com/bearshares/bears-js/tree/master/doc#keys)
    - [Accounts](https://github.com/bearshares/bears-js/tree/master/doc#accounts)
    - [Market](https://github.com/bearshares/bears-js/tree/master/doc#market)
    - [Authority / validation](https://github.com/bearshares/bears-js/tree/master/doc#authority--validation)
    - [Votes](https://github.com/bearshares/bears-js/tree/master/doc#votes)
    - [Content](https://github.com/bearshares/bears-js/tree/master/doc#content)
    - [Witnesses](https://github.com/bearshares/bears-js/tree/master/doc#witnesses)
- [Login API](https://github.com/bearshares/bears-js/tree/master/doc#login)
- [Follow API](https://github.com/bearshares/bears-js/tree/master/doc#follow-api)
- [Broadcast API](https://github.com/bearshares/bears-js/tree/master/doc#broadcast-api)
- [Broadcast](https://github.com/bearshares/bears-js/tree/master/doc#broadcast)
- [Auth](https://github.com/bearshares/bears-js/tree/master/doc#auth)


Here is full documentation:
https://github.com/bearshares/bears-js/tree/master/doc

## Clone and compile to get bears.min.js
```
git clone https://github.com/bearshares/bears-js.git
cd bears-js
npm install
```

## Browser
```html
<script src="./bears.min.js"></script>
<script>
bears.api.getAccounts(['bilalhaider'], function(err, response){
    console.log(err, response);
});
</script>
```

## Webpack
[Please have a look at the webpack usage example.](https://github.com/bearshares/bears-js/blob/master/examples/webpack-example)

## Server
## Install
```
$ npm install @baaluo/bears-js --save
```

## RPC Servers
https://api.bearshares.com By Default<br/>

## Examples
### Broadcast Vote
```js
var bears = require('@baaluo/bears-js');

var wif = bears.auth.toWif(username, password, 'posting');
bears.broadcast.vote(wif, voter, author, permlink, weight, function(err, result) {
	console.log(err, result);
});
```

### Get Accounts
```js
bears.api.getAccounts(['bilalhaider'], function(err, result) {
	console.log(err, result);
});
```

### Get State
```js
bears.api.getState('/trends/funny', function(err, result) {
	console.log(err, result);
});
```

### Reputation Formatter
```js
var reputation = bears.formatter.reputation(user.reputation);
console.log(reputation);
```

## Contributions
Patches are welcome! Contributors are listed in the package.json file. Please run the tests before opening a pull request and make sure that you are passing all of them. If you would like to contribute, but don't know what to work on, check the issues list or on Bearshares Chat channel #bearsjs https://bearshares.chat/channel/bearsjs.

## Issues
When you find issues, please report them!

## License
MIT
