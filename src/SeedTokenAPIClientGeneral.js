const axios = require('axios');
const { Contract, Wallet } = require('ethers');
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
   * @name getBalance
   * @param {string} address
   * @returns {Promise} - when resolved returns {number} - balance
   * @summary Gets the Token Amount of a given address
   */
  async getBalance(address) {
    // Returned type is in hex format
    const hexBalance = await this.tokenContractInstance.balanceOf(address);

    return Number(hexBalance);
  }

  /**
   * @name getCuisAddresses
   * @returns {Promise} - when resolved returns {Array<string>} - array of string addresses
   * @summary Gets an array of all the addresses of the components
   */
  async getCuisAddresses() {
    return this.componentRepositoryContractInstance.getComponents();
  }

  /**
   * @name getCuisCount
   * @returns {Promise} - when resolved returns {number} - total count of cuis
   * @summary Gets the count of cuis in the smart contract
   */
  async getCuisCount() {
    // Returned type is in hex format
    const hexCount = await this.componentRepositoryContractInstance.getComponentsLength();

    return Number(hexCount);
  }

  /**
   * @name getCuiOwner
   * @param {string} cuiAddress - address of cui
   * @returns {Promise} - when resolved returns {string|null} - owner address or null
   * @summary Gets owner of the CUI based on cui existance in repository contract
   */
  async getCuiOwner(cuiAddress) {
    const result = await this.componentRepositoryContractInstance.componentsData(cuiAddress);

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