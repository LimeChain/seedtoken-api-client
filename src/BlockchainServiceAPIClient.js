const axios = require('axios');
const schedule = require('node-schedule');

const blockchainApiURL = process.env.BLOCKCHAIN_SERVICE_URL;
const authorizationToken = Buffer.from(`${process.env.BLOCKCHAIN_SERVICE_AUTHORIZATION_USERNAME}:${process.env.BLOCKCHAIN_SERVICE_AUTHORIZATION_PASSWORD}`).toString('base64');

const EVERY_SECOND = "*/1 * * * * *";

// Set up default axios configuration
const defaultOptions = {
  baseURL: blockchainApiURL,
  headers: {
    'Authorization': `Basic ${authorizationToken}`,
    'Content-Type': 'application/json'
  }
};

// Create axios instance
const instance = axios.create(defaultOptions);

class BlockchainServiceAPIClient {

  static async authorize(userAddress) {
    const result = await instance.put(`/users/${userAddress}/authorise`);
    
    return result.data;
  }

  static async revoke(userAddress) {
    const result = await instance.put(`/users/${userAddress}/revoke`);

    return result.data;
  }

  // POST /users
  static async createUserIdentity(ownerAddress) {
    const result = await instance.post('/users', { ownerAddress });

    return result.data;
  }

  // GET /users/{userAddress}/identity
  static async getUserIdentityAddress(ownerAddress) {
    const result = await instance.get(`/users/${ownerAddress}/identity`);

    return result.data;
  }

  static async checkCuiUsage(cuiAddress, userIdentityAddress) {
    const result = await instance.get(`/cuis/${cuiAddress}/checkUsage`, { userIdentityAddress });

    return result.data;
  }

  static async recordUsage(cuiAddress, userIdentityAddress) {
    const result = await instance.post(`/cuis/${cuiAddress}/recordUsage`, { userIdentityAddress });

    return result.data;
  }

  // GET /cuis/{transactionHash}
  static async getCUIAddressByTransactionHash(transactionHash) {
    const result = await instance.get(`/cuis/${transactionHash}`);

    return result.data;
  }

  // GET /transactions/{transactionHash}
  static async getTransactionResult(transactionHash) {
    const result = await instance.get(`/transactions/${transactionHash}`);

    return result.data;
  }

  static waitForTransaction(hash) {
    return new Promise((resolve, reject) => {
      const scheduledJob = schedule.scheduleJob(hash, EVERY_SECOND, async () => {
        const data = await SeedTokenAPIService.getTransactionResult(hash);
        
        if (data.processed) {
          if (data.failed) {
            reject();
            scheduledJob.cancel();
          }
          else {
            resolve();
            scheduledJob.cancel();
          }
        }
      });
    });
  }
}

module.exports = BlockchainServiceAPIClient;