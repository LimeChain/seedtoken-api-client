# seedtoken-api-client

### Usage
In order to use the `seedtoken-api-client` you need to import it into the backend as a separate `js` file. 

### The env variables required by the Backend interface are the following:

- `BLOCKCHAIN_SERVICE_URL` - the URL of the `blockchain-service`. HTTP calls are made towards the blockchain service.
- `BLOCKCHAIN_SERVICE_AUTHORIZATION_USERNAME` - the user name that will be used for basic authentication. Should be the same as  the `AUTHORIZATION_USERNAME` in the Blockchain-Service.
- `BLOCKCHAIN_SERVICE_AUTHORIZATION_PASSWORD` - the password that will be used for basic authentication. Should be the same as  the `AUTHORIZATION_PASSWORD` in the Blockchain-Service.
- `NODE_0_URL` - https://bct1.seedtoken.io:8545
- `NODE_1_URL` - https://bct2.seedtoken.io:8545
- `BLOCKCHAIN_EXPLORER_URL` - the URL of the blockchain explorer. Currently it is hosted at: [`http://169.62.9.135/`](http://169.62.9.135/)
- `TOKEN_CONTRACT_ADDRESS` - the address of the SEED token that will be used.
- `COMPONENT_REPOSITORY_CONTRACT_ADDRESS` - the address of the component repository.
- `USER_REPOSITORY_CONTRACT_ADDRESS` - the address of the user repository contract.

### Interface

When it comes to Getting data, using the `BlockchainServiceAPIClient` you would be able to:

- Get the User's Identity Address by providing his Wallet address (`getUserIdentityAddress`)
- Get the Component's address by providing the transaction hash (`getComponentAddressByTransactionHash`)
- Check whether the Record usage transaction for a Component Address and User that subscribed to the Component will go through if you broadcast it (`checkComponentUsage`).
- Get Information whether a transaction is mined and whether it reverted (`getTransactionResult`)

Using the `SeedTokenAPIClientComponent` you would be able to:

- Get the data of a Component (owner, license fee, latest license change, is it revoked, count of subscribers, count of subscriptions) using the `getComponentData`
- Get the Addresses that are subscribed to Component by performing `getComponentSubscribersAddresses`
- Get data regarding a particular subscriber (is he active and whats his latest subscription Id) by performing `getComponentSubscriberData`
- Get the Addresses that the Component has subscribed to by performing `getComponentSubscriptionsAddresses`
- Get Subscription data regarding a particular subscriber (start & end time of the subscription, how much times a usage occurred, the total amount charged, the fee on which the user subscribed to) by performing `getComponentSubscriberLatestSubscription(subscriberAddress)`
- Get previous subscription data (if the user was a subscriber at some point, then he decided to unsubscribe and later he subscribed again to the Component) by performing `getComponentSubscriberSubscriptionByIndex(subscriberAddress, index)` where `index` is the index of the subscription. When you perform `getComponentSubscriberData` the latest `index` is returned. If the latest `index` is 3, this means that you could perform `getComponentSubscriberSubscriptionByIndex(subscriberAddress, 1)` for example and get data from previous subscriptions.

Using the `SeedTokenAPIClientGeneral` you would be able to:

- Get the TOKEN balance of an address (`getTokenBalance(address)`)
- Get the addresses of all created Components (`getComponentsAddresses()`)
- Get the count of all created Components (`getComponentsCount()`)
- Get the owner of Component (`getComponentOwner(componentAddress)` )
- Get the latest N transaction for an address (`getLatestNTransactions(address, transactionCount)`). This will retrieve all types of transactions for that address not only token transfers.
- Get the latest N number of Token transfer transactions (`getLatestNTokenTransactions(address, transactionCount)`) . You can check [`http://169.62.9.135/api_docs`](http://169.62.9.135/api_docs) for additional information.

The `SeedTokenAPIClientGeneral` allows you to do administrative transactions if you want to. For example, you can transfer tokens to an address by performing the following:
`SeedTokenAPIClientGeneral.transferTokens(privateKey, toAddress, amount)` .
The `privateKey` argument is the pk from which the tokens will be transferred, `toAddress` is the recipient of the tokens and `amount` is the amount of tokens that will be send.
Once the promise is resolved, transaction hash will be returned and you can use the `waitForTransaction` to be certain that it did not failed.

You can even send native currency in a similar fashion by performing:

`SeedTokenAPIClientGeneral.send(privateKey, toAddress, amount)` 
The `privateKey` argument is the pk from which the currency will be transferred, `toAddress` is the recipient of the currency and `amount` is the amount of currency that will be send.
Once the promise is resolved, transaction hash will be returned and you can use the `waitForTransaction` to be certain that it did not failed.

Using the `SeedTokenAPIClientPersonal` you would be able to:

- Get the Components addresses that the current User owns (`getUserComponentsAddresses()`)
- Get the Component count that the user owns (`getUserComponentsCount()`)
- Get the addresses of Components that this user is subscribed to (`getUserSubscriptions()`)
- Get the count of Components that his user is subscribed to (`getUserSubscriptionsCount()`)
