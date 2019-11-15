const { Contract } = require('ethers');
const SeedTokenAPIProviderAbstract = require('./SeedTokenAPIClientAbstract');
const componentAbi = require('./abis/component');

/**
 * @summary Handles all blockchain read operations regarding specific Component address
 */
class SeedTokenAPIClientComponent extends SeedTokenAPIProviderAbstract {
  
  constructor(componentAddress, forceSingleton) {
    super();

    if (!forceSingleton) {
      throw new Error('You must get instance with SeedTokenAPIClientComponent.getInstance(componentAddress)');
    }

    // Instantiate component Contract Instance
    this.componentContractInstance = new Contract(componentAddress, componentAbi, this.blockchainProvider);
  }

  /**
   * @param {string} componentAddress 
   * @summary Provides a singleton based on input parameter
   */
  static getInstance(componentAddress) {
    if (!SeedTokenAPIClientComponent.instance) {
      SeedTokenAPIClientComponent.instance = {};
    }

    if (SeedTokenAPIClientComponent.instance[componentAddress]) {
      return SeedTokenAPIClientComponent.instance[componentAddress];
    }
    SeedTokenAPIClientComponent.instance[componentAddress] = new SeedTokenAPIClientComponent(componentAddress, true);
    return SeedTokenAPIClientComponent.instance[componentAddress];
  }

  /**
   * @name getComponentData
   * @returns {Promise} - when resolved returns {string, boolean, boolean, number, bool, number, number, number} - 
   * owner address, 
   * if component is active, 
   * if usage payment is active, 
   * usage payment fee, 
   * if monthly payment is active, 
   * monthly payment fee, 
   * count of component subscribers, count of component subscriptions
   * @summary Gets information about Component
   */
  async getComponentData() {
    const componentData = await this.componentContractInstance.getData();
    return {
      owner: componentData[0],
      isActive: !componentData[1],
      paymentUsageIsActive: componentData[2],
      paymentUsageFee: Number(componentData[3]),
      paymentMonthlyIsActive: componentData[4],
      paymentMonthlyFee: Number(componentData[5]),
      subscribersCount: Number(componentData[6]),
      subscriptionsCount: Number(componentData[7])
    };
  }

  /**
   * @name isFree
   * @returns {Promise} - when resolved returns {boolean} - if the component is payment type is free
   */
  async isFree() {
    return this.componentContractInstance.isFree();
  }

  /**
   * @name getComponentSubscribersAddresses
   * @returns {Promise} - when resolved returns {Array<string>} - array of string addresses
   * @summary Gets an array of addresses of the components's subscribers
   */
  async getComponentSubscribersAddresses() {
    return this.componentContractInstance.getSubscribersArray();
  }

  /**
   * @name getComponentSubscriberData
   * @param {string} subscriberAddress - address of subscriber
   * @returns {Promise} - when resolved returns {boolean, number} - if active subscriber, last subscription id
   * @summary Gets Subscription Information about a user
   */
  async getComponentSubscriberData(subscriberAddress) {
    const subscriberData = await this.componentContractInstance.subscribers(subscriberAddress);

    return {
      isActive: subscriberData.isActive,
      lastSubscriptionId: subscriberData.lastSubscriptionId
    };
  }

  /**
   * @name getComponentSubscriptionsAddresses
   * @returns {Promise} - when resolved returns {Array<string>} - array of string addresses
   * @summary Gets an array of addresses of the component's subscriptions
   */
  async getComponentSubscriptionsAddresses() {
    return this.componentContractInstance.getSubscriptionsArray();
  }

  /**
   * @name getComponentSubscriberLatestSubscription
   * @param {string} subscriberAddress - address of subscriber
   * @returns {Promise} - when resolved returns {Object} - start, end, usage, totalCharged, fee
   * @summary Gets Latest Subscription Information about component subscriber
   */
  async getComponentSubscriberLatestSubscription(subscriberAddress) {
    const subscriptionData = await this.componentContractInstance.getLatestSubscriptionForUser(subscriberAddress);

    return {
      start: Number(subscriptionData.start),
      end: Number(subscriptionData.end),
      usage: Number(subscriptionData.usage),
      totalCharged: Number(subscriptionData.totalCharged),
      fee: Number(subscriptionData.fee)
    };
  }

  /**
   * @name getComponentSubscriberSubscriptionByIndex
   * @param {string} subscriberAddress - address of subscriber
   * @param {number} index
   * @returns {Promise} - when resolved returns {Object} - start, end, usage, totalCharged, fee
   * @summary Gets Subscription Information by Index about component subscriber
   */
  async getComponentSubscriberSubscriptionByIndex(subscriberAddress, index) {
    const subscriptionData = await this.componentContractInstance.getSubscriptionForUserByIndex(subscriberAddress, index);

    return {
      start: Number(subscriptionData.start),
      end: Number(subscriptionData.end),
      usage: Number(subscriptionData.usage),
      totalCharged: Number(subscriptionData.totalCharged),
      fee: Number(subscriptionData.fee)
    };
  }
}

module.exports = SeedTokenAPIClientComponent;