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
   * @name authorize
   * @param {string} userAddress - wallet address
   * @returns {Promise} - when resolved returns {string, bool} - transactionHash (can be undefined if already authorised) and authorised (variable that states whether the provided user address is authorised)
   * @summary Authorizes user's wallet address to make blockchain transactions 
   */
  static async authorize(userAddress) {
    const result = await axiosInstance.put(`/users/${userAddress}/authorise`);
    
    return result.data;
  }

  /**
   * @name revoke
   * @param {string} userAddress - wallet address
   * @returns {Promise} - when resolved returns {string, bool} - transactionHash (can be undefined if already revoked) and authorised (variable that states whether the provided user address is authorised)
   * @summary Revokes user's wallet address. Once revoked, the user cannot broadcast blockchain transactions
   */
  static async revoke(userAddress) {
    const result = await axiosInstance.put(`/users/${userAddress}/revoke`);

    return result.data;
  }

  /**
   * @name createUserIdentity
   * @param {string} ownerAddress
   * @returns {Promise} - when resolved returns {string} - transactionHash
   * @summary Creates User Identity Contract based on wallet address
   */
  static async createUserIdentity(ownerAddress) {
    const result = await axiosInstance.post('/users', { ownerAddress });

    return result.data;
  }

  /**
   * @name getUserIdentityAddress
   * @param {string} ownerAddress
   * @returns {Promise} - when resolved returns {string} - userIdentityAddress
   * @summary Gets the corresponding user identity address to wallet address
   */
  static async getUserIdentityAddress(ownerAddress) {
    const result = await axiosInstance.get(`/users/${ownerAddress}/identity`);

    return result.data;
  }

  /**
   * @name checkComponentUsage
   * @param {string} componentAddress
   * @param {string} subscriberAddress
   * @returns {Promise} - when resolved returns {bool, string} - valid (indicates whether the Component usage will go through if recordUsage is called) and errorMessage (error message, indicating the error for which the component will not be able to record usage for the given subscriberAddress)
   * @summary Performs a validation for recording usage of Component whether the given subscriberAddress would be able to successfully record a usage transaction for the supplied Component address
   */
  static async checkComponentUsage(componentAddress, subscriberAddress) {
    const result = await axiosInstance.get(`/components/${componentAddress}/checkUsage/${subscriberAddress}`);

    return result.data;
  }

  /**
   * @param {string} componentAddress
   * @param {string} subscriberAddress
   * @returns {Promise} - when resolved returns {string} - transactionHash
   * @summary Records usage of a subscriber for given component
   */
  static async recordUsage(componentAddress, subscriberAddress) {
    const result = await axiosInstance.post(`/components/${componentAddress}/recordUsage`, { subscriberAddress });

    return result.data;
  }

  /**
   * @param {string} componentAddress
   * @param {string} subscriberAddress
   * @returns {Promise} - when resolved returns {string} - transactionHash
   * @summary Charges monthly subscription of a subscriber for given component
   */
  static async chargeMonthlySubscription(componentAddress, subscriberAddress) {
    const result = await axiosInstance.post(`/components/${componentAddress}/chargeMonthlySubscription`, { subscriberAddress });

    return result.data;
  }

  /**
   * @name getComponentAddressByTransactionHash
   * @param {string} transactionHash
   * @returns {Promise} - when resolved returns {string} - componentAddress
   * @summary Gets the Component Address from its transaction creation hash
   */
  static async getComponentAddressByTransactionHash(transactionHash) {
    const result = await axiosInstance.get(`/components/${transactionHash}`);

    return result.data;
  }

  /**
   * @name getTransactionResult
   * @param {string} transactionHash
   * @returns {Promise} - when resolved returns {bool, bool} - processed (indicates whether the transaction was finalised on the blockchain. If yes, the transaction can be considered final), failed (indicates whether the transaction have failed)
   * @summary Gets transaction result by its hash
   */
  static async getTransactionResult(transactionHash) {
    const result = await axiosInstance.get(`/transactions/${transactionHash}`);

    return result.data;
  }

  /**
   * @name waitForTransaction
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