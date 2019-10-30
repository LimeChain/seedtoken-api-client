const { providers } = require('ethers');

/**
 * @summary Provides a connection to the blockchain network
 */
class SeedTokenAPIProviderAbstract {
  
  /**
   * @summary Instantiates blockchain network provider
   */
  constructor() {
    const mainProvider = new providers.JsonRpcProvider(process.env.NODE_0_URL);
    const fallbackProvider = new providers.JsonRpcProvider(process.env.NODE_1_URL);

    this.blockchainProvider = new providers.FallbackProvider([mainProvider, fallbackProvider]);
  }
}

module.exports = SeedTokenAPIProviderAbstract;