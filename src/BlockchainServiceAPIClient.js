const axios = require('axios');
const schedule = require('node-schedule');

const blockchainApiURL = process.env.BLOCKCHAIN_SERVICE_URL;
const authorizationHeader = Buffer.from(`${process.env.BLOCKCHAIN_SERVICE_AUTHORIZATION_USERNAME}:${process.env.BLOCKCHAIN_SERVICE_AUTHORIZATION_PASSWORD}`).toString('base64');

const EVERY_SECOND = "*/1 * * * * *";

// Set up default axios configuration
const defaultOptions = {
  baseURL: blockchainApiURL,
  headers: {
    'Authorization': `Basic ${authorizationHeader}`,
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
   * @returns {Promise} - when resolved returns {string, bool} - transactionHash (can be undefined if already authorised) and authorised (variable that states whether the provided user address is authorised)
   * @summary Authorizes user's wallet address to make blockchain transactions 
   */
  static async authorize(userAddress) {
    const result = await axiosInstance.put(`/users/${userAddress}/authorise`);
    
    return result.data;
  }

  /**
   * @param {string} userAddress - wallet address
   * @returns {Promise} - when resolved returns {string, bool} - transactionHash (can be undefined if already revoked) and authorised (variable that states whether the provided user address is authorised)
   * @summary Revokes user's wallet address. Once revoked, the user cannot broadcast blockchain transactions
   */
  static async revoke(userAddress) {
    const result = await axiosInstance.put(`/users/${userAddress}/revoke`);

    return result.data;
  }

  /**
   * @param {string} ownerAddress
   * @returns {Promise} - when resolved returns {string} - transactionHash
   * @summary Creates User Identity Contract based on wallet address
   */
  static async createUserIdentity(ownerAddress) {
    const result = await axiosInstance.post('/users', { ownerAddress });

    return result.data;
  }

  /**
   * @param {string} ownerAddress
   * @returns {Promise} - when resolved returns {string} - userIdentityAddress
   * @summary Gets the corresponding user identity address to wallet address
   */
  static async getUserIdentityAddress(ownerAddress) {
    const result = await axiosInstance.get(`/users/${ownerAddress}/identity`);

    return result.data;
  }

  /**
   * @param {string} cuiAddress
   * @param {string} userIdentityAddress
   * @returns {Promise} - when resolved returns {bool, string} - valid (indicates whether the CUI usage will go through if recordUsage is called) and errorMessage (error message, indicating the error for which the cui will not be able to record usage for the given userIdentityAddress)
   * @summary Performs a validation for recording usage of CUI whether the given userIdentityAddress would be able to successfully record a usage transaction for the supplied CUI address
   */
  static async checkCuiUsage(cuiAddress, userIdentityAddress) {
    const result = await axiosInstance.get(`/cuis/${cuiAddress}/checkUsage/${userIdentityAddress}`);

    return result.data;
  }

  /**
   * @param {string} cuiAddress
   * @param {string} userIdentityAddress
   * @returns {Promise} - when resolved returns {string} - transactionHash
   * @summary Records usage of a user for given cui
   */
  static async recordUsage(cuiAddress, userIdentityAddress) {
    const result = await axiosInstance.post(`/cuis/${cuiAddress}/recordUsage`, { userIdentityAddress });

    return result.data;
  }

  /**
   * @param {string} transactionHash
   * @returns {Promise} - when resolved returns {string} - cuiAddress
   * @summary Gets the CUI Address from its transaction creation hash
   */
  static async getCUIAddressByTransactionHash(transactionHash) {
    const result = await axiosInstance.get(`/cuis/${transactionHash}`);

    return result.data;
  }

  /**
   * @param {string} transactionHash
   * @returns {Promise} - when resolved returns {bool, bool} - processed (indicates whether the transaction was finalised on the blockchain. If yes, the transaction can be considered final), failed (indicates whether the transaction have failed)
   * @summary Gets transaction result by its hash
   */
  static async getTransactionResult(transactionHash) {
    const result = await axiosInstance.get(`/transactions/${transactionHash}`);

    return result.data;
  }

  /**
   * @param {string} transactionHash
   * @returns {Promise}
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