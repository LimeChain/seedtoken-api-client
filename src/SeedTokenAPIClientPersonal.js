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
  getInstance(userIdentityAddress) {
    if (!SeedTokenAPIServicePersonal.instance) {
      SeedTokenAPIServicePersonal.instance = {};
    }

    if (SeedTokenAPIServicePersonal.instance[userIdentityAddress]) {
      return SeedTokenAPIServicePersonal.instance[userIdentityAddress];
    }
    SeedTokenAPIServicePersonal.instance[userIdentityAddress] = new SeedTokenAPIClientPersonal(userIdentityAddress, true);
    return SeedTokenAPIServicePersonal.instance[userIdentityAddress];
  }

  /**
   * @name getUserCuisAddresses()
   * @returns {Promise} - when resolved returns {Array<string>} - addresses of cuis
   * @summary Returns an array of the CUI addresses this User owns
   */
  async getUserCuisAddresses() {
    return this.userContractInstance.getComponentsArray();
  }
  
  /**
   * @name getUserCuisCount
   * @returns {Promise} - when resolved returns {number} - total count of user's cuis
   * @summary Gets the count of the User's cuis
   */
  async getUserCuisCount() {
    // Returned type is in hex format
    const hexCount = await this.userContractInstance.getComponentsLength();

    return Number(hexCount);
  }

  /**
   * @name getUserSubscriptions
   * @returns {Promise} - when resolved returns {Array<string>}
   * @summary Returns the addresses of the CUIs the User has subscriptions to
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