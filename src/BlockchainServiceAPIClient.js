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
const axiosInstance = axios.create(defaultOptions);

/**
 * @summary Handles all blockchain service related functionality
 * @see API Docs for further information
 */
class BlockchainServiceAPIClient {

  /**
   * @param {string} userAddress - wallet address
   * @summary Authorizes user's wallet address to make calls 
   */
  static async authorize(userAddress) {
    const result = await axiosInstance.put(`/users/${userAddress}/authorise`);
    
    return result.data;
  }

  /**
   * @param {string} userAddress - wallet address
   * @summary Revokes user's wallet address to make calls
   */
  static async revoke(userAddress) {
    const result = await axiosInstance.put(`/users/${userAddress}/revoke`);

    return result.data;
  }

  // POST /users
  /**
   * @param {string} ownerAddress
   * @summary Creates User Identity Contract based on wallet address
   */
  static async createUserIdentity(ownerAddress) {
    const result = await axiosInstance.post('/users', { ownerAddress });

    return result.data;
  }

  // GET /users/{userAddress}/identity
  /**
   * @param {string} ownerAddress
   * @summary Gets the corresponding user identity address to wallet address
   */
  static async getUserIdentityAddress(ownerAddress) {
    const result = await axiosInstance.get(`/users/${ownerAddress}/identity`);

    return result.data;
  }

  /**
   * @param {string} cuiAddress
   * @param {string} userIdentityAddress
   * @summary Checks the usage of a user for given cui
   */
  static async checkCuiUsage(cuiAddress, userIdentityAddress) {
    const result = await axiosInstance.get(`/cuis/${cuiAddress}/checkUsage`, { userIdentityAddress });

    return result.data;
  }

  /**
   * 
   * @param {string} cuiAddress
   * @param {string} userIdentityAddress
   * @summary Records usage of a user for given cui
   */
  static async recordUsage(cuiAddress, userIdentityAddress) {
    const result = await axiosInstance.post(`/cuis/${cuiAddress}/recordUsage`, { userIdentityAddress });

    return result.data;
  }

  // GET /cuis/{transactionHash}
  /**
   * @param {string} transactionHash
   * @summary Gets the CUI Address from its transaction creation hash
   */
  static async getCUIAddressByTransactionHash(transactionHash) {
    const result = await axiosInstance.get(`/cuis/${transactionHash}`);

    return result.data;
  }

  // GET /transactions/{transactionHash}
  /**
   * @param {string} transactionHash
   * @summary Gets transaction result by its hash
   */
  static async getTransactionResult(transactionHash) {
    const result = await axiosInstance.get(`/transactions/${transactionHash}`);

    return result.data;
  }

  /**
   * @param {string} transactionHash
   * @summary Waits for transaction to be mined using scheduled job
   */
  static waitForTransaction(transactionHash) {
    return new Promise((resolve, reject) => {
      const scheduledJob = schedule.scheduleJob(transactionHash, EVERY_SECOND, async () => {
        const data = await BlockchainServiceAPIClient.getTransactionResult(transactionHash);
        
        if (data.processed) {
          if (data.failed) {
            reject();
            scheduledJob.cancel();
          } else {
            resolve();
            scheduledJob.cancel();
          }
        }
      });
    });
  }
}

module.exports = BlockchainServiceAPIClient;