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
