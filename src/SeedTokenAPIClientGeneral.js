const axios = require('axios');
const { Contract, utils, Wallet } = require('ethers');
const SeedTokenAPIProviderAbstract = require('./SeedTokenAPIClientAbstract');
const tokenAbi = require('./abis/token');
const componentRepositoryAbi = require('./abis/componentRepository');
const userRepositoryAbi = require('./abis/userRepository');

const blockchainExplorerApiUrl = process.env.BLOCKCHAIN_EXPLORER_URL;
const defaultOptions = {
  baseURL: blockchainExplorerApiUrl,
};

/**
 * @summary Handles all general blockchain calls
 */
class SeedTokenAPIClientGeneral extends SeedTokenAPIProviderAbstract {
  
  /**
   * @summary Creates all contract & axios instances
   */
  constructor() {
    super();

    this.tokenContractInstance = new Contract(process.env.TOKEN_CONTRACT_ADDRESS, tokenAbi, this.blockchainProvider);
    this.componentRepositoryContractInstance = new Contract(process.env.COMPONENT_REPOSITORY_CONTRACT_ADDRESS, componentRepositoryAbi, this.blockchainProvider);
    this.userRepositoryContractInstance = new Contract(process.env.USER_REPOSITORY_CONTRACT_ADDRESS, userRepositoryAbi, this.blockchainProvider);

    this.axiosInstance = axios.create(defaultOptions);
  }

  /**
   * @name getTokenBalance
   * @param {string} address
   * @returns {Promise} - when resolved returns {number} - balance
   * @summary Gets the Token Amount of a given address
   */
  async getTokenBalance(address) {
    // Returned type is in hex format
    const hexBalance = await this.tokenContractInstance.balanceOf(address);

    return Number(hexBalance);
  }

  /**
   * @name getComponentsAddresses
   * @returns {Promise} - when resolved returns {Array<string>} - array of string addresses
   * @summary Gets an array of all the addresses of the components
   */
  async getComponentsAddresses() {
    return this.componentRepositoryContractInstance.getComponents();
  }

  /**
   * @name getComponentsCount
   * @returns {Promise} - when resolved returns {number} - total count of components
   * @summary Gets the count of components in the smart contract
   */
  async getComponentsCount() {
    // Returned type is in hex format
    const hexCount = await this.componentRepositoryContractInstance.getComponentsLength();

    return Number(hexCount);
  }

  /**
   * @name getComponentOwner
   * @param {string} componentAddress - address of component
   * @returns {Promise} - when resolved returns {string|null} - owner address or null
   * @summary Gets owner of the Component based on component existance in repository contract
   */
  async getComponentOwner(componentAddress) {
    const result = await this.componentRepositoryContractInstance.componentsData(componentAddress);

    return result.exists ? result.owner : null;
  }

  /**
   * @name transferTokens
   * @param {string} privateKey - private key signer
   * @param {string} toAddress - recipient address
   * @param {number} amount - amount to send the receiver
   * @returns {Promise} - when resolved returns {string} - transaction hash
   * @summary Sends an amount of tokens to a receiver address by private key
   */
  async transferTokens(privateKey, toAddress, amount) {
    const wallet = new Wallet(privateKey, this.blockchainProvider);

    const connectedTokenContractInstance = this.tokenContractInstance.connect(wallet);

    const transaction = await connectedTokenContractInstance.transfer(toAddress, amount);

    return transaction.hash;
  }

  /**
   * @name send
   * @param {string} privateKey 
   * @param {string} toAddress 
   * @param {string} amount - native string amount
   * @returns {Promise} - when resolved returns {string} - transaction hash
   * @summary Sends an amount of native currency to given address
   */
  async send(privateKey, toAddress, amount) {
    const wallet = new Wallet(privateKey, this.blockchainProvider);

    // Parses string representation of native currency into a BigNumber instance of the amount
    const amountBn = utils.parseEther(amount);
    const tx = {
      to: toAddress,
      value: amountBn
    };

    const transaction = await wallet.sendTransaction(tx);
    return transaction.hash;
  }

  /**
   * @name getLatestNTransactions
   * @param {string} address
   * @param {number} nTransactionsCount - how many maximum transactions to be returned
   * @returns {Promise} - when resolved returns {Array<Object>|null} where Object is the representation of the Transaction
   * @summary Gets Latest N Transactions of given address
   */
  async getLatestNTransactions(address, nTransactionsCount) {
    const result = await this.axiosInstance.get(`/api?module=account&action=txlist&address=${address}&sort=desc&page=1&offset=${nTransactionsCount}`);

    return result.data.result; 
  }

  /**
   * @name getLatestNTokenTransactions
   * @param {string} address
   * @param {number} nTransactionsCount - how many maximum transactions to be returned
   * @returns {Promise} - when resolved returns {Array<Object>|null} where Object is the representation of the Transaction
   * @summary Gets Latest N Token Transactions of given address
   */
  async getLatestNTokenTransactions(address, nTransactionsCount) {
    const result = await this.axiosInstance.get(`api?module=account&action=tokentx&address=${address}&sort=desc&page=1&offset=${nTransactionsCount}`);

    return result.data.result;
  }
}

module.exports = new SeedTokenAPIClientGeneral();