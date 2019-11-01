const { Contract } = require('ethers');
const SeedTokenAPIProviderAbstract = require('./SeedTokenAPIClientAbstract');
const cuiAbi = require('./abis/cui');

/**
 * @summary Handles all blockchain read operations regarding specific CUI address
 */
class SeedTokenAPIClientCui extends SeedTokenAPIProviderAbstract {
  
  constructor(cuiAddress, forceSingleton) {
    super();

    if (!forceSingleton) {
      throw new Error('You must get instance with SeedTokenAPIClientCui.getInstance(userIdentityAddress)');
    }

    // Instantiate user Contract Instance
    this.cuiContractInstance = new Contract(cuiAddress, cuiAbi, this.blockchainProvider);
  }

  /**
   * @param {string} cuiAddress 
   * @summary Provides a singleton based on input parameter
   */
  static getInstance(cuiAddress) {
    if (!SeedTokenAPIClientCui.instance) {
      SeedTokenAPIClientCui.instance = {};
    }

    if (SeedTokenAPIClientCui.instance[cuiAddress]) {
      return SeedTokenAPIClientCui.instance[cuiAddress];
    }
    SeedTokenAPIClientCui.instance[cuiAddress] = new SeedTokenAPIClientCui(cuiAddress, true);
    return SeedTokenAPIClientCui.instance[cuiAddress];
  }

  /**
   * @name getCuiData
   * @returns {Promise} - when resolved returns {string, number, number, boolean, number} - owner address, license fee, latest license change, is the cui is revoked, count of cui subscriber
   * @summary Gets information about CUI
   */
  async getCuiData() {
    return {
      owner: await this.cuiContractInstance.owner(),
      licenseFee: Number(await this.cuiContractInstance.licenseFee()),
      latestLicenseChange: Number(await this.cuiContractInstance.latestLicenseChange()),
      isRevoked: await this.cuiContractInstance.isRevoked(),
      subscribersCount: Number(await this.cuiContractInstance.getSubscribersArrayLength())
    };
  }

  /**
   * @name getCuiSubscribersAddresses
   * @returns {Promise} - when resolved returns {Array<string>} - array of string addresses
   * @summary Gets an array of addresses of the cui's subscribers
   */
  async getCuiSubscribersAddresses() {
    return this.cuiContractInstance.getSubscribersArray();
  }

  /**
   * @name getCuiSubscriberData
   * @param {string} subscriberAddress - address of subscriber
   * @returns {Promise} - when resolved returns {boolean, number} - if active subscriber, last subscription id
   * @summary Gets Subscription Information about a user
   */
  async getCuiSubscriberData(subscriberAddress) {
    const subscriberData = await this.cuiContractInstance.subscribers(subscriberAddress);

    return {
      isActive: subscriberData.isActive,
      lastSubscriptionId: subscriberData.lastSubscriptionId
    };
  }

  /**
   * @name getCuiSubscriberLatestSubscription
   * @param {string} subscriberAddress - address of subscriber
   * @returns {Promise} - when resolved returns {Object} - start, end, usage, totalCharged, fee
   * @summary Gets Latest Subscription Information about cui subscriber
   */
  async getCuiSubscriberLatestSubscription(subscriberAddress) {
    const subscriptionData = await this.cuiContractInstance.getLatestSubscriptionForUser(subscriberAddress);

    return {
      start: Number(subscriptionData.start),
      end: Number(subscriptionData.end),
      usage: Number(subscriptionData.usage),
      totalCharged: Number(subscriptionData.totalCharged),
      fee: Number(subscriptionData.fee)
    };
  }

  /**
   * @name getCuiSubscriberSubscriptionByIndex
   * @param {string} subscriberAddress - address of subscriber
   * @param {number} index
   * @returns {Promise} - when resolved returns {Object} - start, end, usage, totalCharged, fee
   * @summary Gets Subscription Information by Index about cui subscriber
   */
  async getCuiSubscriberSubscriptionByIndex(subscriberAddress, index) {
    const subscriptionData = await this.cuiContractInstance.getSubscriptionForUserByIndex(subscriberAddress, index);

    return {
      start: Number(subscriptionData.start),
      end: Number(subscriptionData.end),
      usage: Number(subscriptionData.usage),
      totalCharged: Number(subscriptionData.totalCharged),
      fee: Number(subscriptionData.fee)
    };
  }
}

module.exports = SeedTokenAPIClientCui;