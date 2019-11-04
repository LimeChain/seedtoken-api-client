const { utils } = require('ethers');

class BlockchainUtils {

  static getSignerOfMessage(message, signature) {
    return utils.verifyMessage(message, signature);
  }

  static getAddressFromJSON(json) {
    const address = utils.getJsonWalletAddress(json);
    return BlockchainUtils.safeAdd0x(address);
  }

  static safeAdd0x(address) {
    return address.startsWith('0x') ? address : `0x${address}`;
  }

  static safeAreAddressesEqual(addressOne, addressTwo) {
    addressOne = BlockchainUtils.safeAdd0x(addressOne);
    addressTwo = BlockchainUtils.safeAdd0x(addressTwo);
    return addressOne.toLowerCase() === addressTwo.toLowerCase();
  }

  static isWalletInputValid(encryptedWallet, signature) {
    const targetAddress = BlockchainUtils.getAddressFromJSON(encryptedWallet);
    const signerOfMessage = BlockchainUtils.getSignerOfMessage(process.env.VUE_APP_SIGN_MESSAGE, signature);
    return BlockchainUtils.safeAreAddressesEqual(targetAddress, signerOfMessage);
  }

  static isWalletUpdateInputValid(oldEncryptedWallet, newEncryptedWallet, oldSignature, newSignature) {
    if (oldSignature !== newSignature) {
      return false;
    }

    if(!BlockchainUtils.isWalletInputValid(newEncryptedWallet, newSignature))  {
      return false;
    }

    return BlockchainUtils.areAddressesEqual(oldEncryptedWallet, newEncryptedWallet);
  }

  static areAddressesEqual(oldEncryptedWallet, newEncryptedWallet) {
    const oldAddress = BlockchainUtils.getAddressFromJSON(oldEncryptedWallet);
    const newAddress = BlockchainUtils.getAddressFromJSON(newEncryptedWallet);

    return BlockchainUtils.safeAreAddressesEqual(oldAddress, newAddress);
  }

  static checkAddress(address) {
    return utils.getAddress(address);
  }
}

module.exports = BlockchainUtils;