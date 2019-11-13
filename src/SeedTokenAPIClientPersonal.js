const { Contract } = require('ethers');
const SeedTokenAPIProviderAbstract = require('./SeedTokenAPIClientAbstract');
const userAbi = require('./abis/user');

/**
 * @summary Handles all blockchain read operations regarding specific user identity address
 */
class SeedTokenAPIClientPersonal extends SeedTokenAPIProviderAbstract {
  
  constructor(userIdentityAddress, forceSingleton) {
    super();

    if (!forceSingleton) {
      throw new Error('You must get instance with SeedTokenAPIClientPersonal.getInstance(userIdentityAddress)');
    }

    // Instantiate user Contract Instance
    this.userContractInstance = new Contract(userIdentityAddress, userAbi, this.blockchainProvider);
  }

  /**
   * @param {string} userIdentityAddress 
   * @summary Provides a singleton based on input parameter
   */
  static getInstance(userIdentityAddress) {
    if (!SeedTokenAPIClientPersonal.instance) {
      SeedTokenAPIClientPersonal.instance = {};
    }

    if (SeedTokenAPIClientPersonal.instance[userIdentityAddress]) {
      return SeedTokenAPIClientPersonal.instance[userIdentityAddress];
    }
    SeedTokenAPIClientPersonal.instance[userIdentityAddress] = new SeedTokenAPIClientPersonal(userIdentityAddress, true);
    return SeedTokenAPIClientPersonal.instance[userIdentityAddress];
  }

  /**
   * @name getUserComponentsAddresses()
   * @returns {Promise} - when resolved returns {Array<string>} - addresses of components
   * @summary Returns an array of the Component addresses this User owns
   */
  async getUserComponentsAddresses() {
    return this.userContractInstance.getComponentsArray();
  }
  
  /**
   * @name getUserComponentsCount
   * @returns {Promise} - when resolved returns {number} - total count of user's components
   * @summary Gets the count of the User's components
   */
  async getUserComponentsCount() {
    // Returned type is in hex format
    const hexCount = await this.userContractInstance.getComponentsLength();

    return Number(hexCount);
  }

  /**
   * @name getUserSubscriptions
   * @returns {Promise} - when resolved returns {Array<string>}
   * @summary Returns the addresses of the Components the User has subscriptions to
   */
  async getUserSubscriptions() {
    return this.userContractInstance.getSubscriptionsArray();
  }

  /**
   * @name getUserSubscriptionsCount
   * @returns {Promise} - when resolved returns {number}
   * @summary Gets the count of subscriptions of a user contract
   */
  async getUserSubscriptionsCount() {
    // Returned type is in hex format
    const hexCount = await this.userContractInstance.getSubscriptionsLength();

    return Number(hexCount);
  }
}

module.exports = SeedTokenAPIClientPersonal;