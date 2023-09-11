const bip39 = require('bip39');


class Mnemonic {
  constructor() {
    try {
      const mnemonic = bip39.generateMnemonic();
      if (!mnemonic) {
        throw new Error('Could not generate mnemonic');
      }
      this.seedPhrase = mnemonic;
    } catch (error) {
      throw new Error(`Could not generate mnemonic: ${error.message}`);
    }
  }

  static generate() {
    try {
      return new Mnemonic();
    } catch (error) {
      throw new Error('Failed to generate mnemonic: ' + error.message);
    }
  }
}

module.exports = Mnemonic;