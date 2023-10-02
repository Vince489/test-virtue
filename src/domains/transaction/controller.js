// Function to retrieve a private key for a given publicKey from the database
async function getSenderPrivateKey(senderPublicKey) {
  try {
    // Find the account based on the publicKey
    const account = await Account.findOne({ publicKey: senderPublicKey });

    if (!account) {
      return null; // Account not found
    }

    return account.privateKey;
  } catch (error) {
    console.error('Error while retrieving private key:', error);
    return null; // Handle the error appropriately
  }
}

module.exports = { getSenderPrivateKey };
