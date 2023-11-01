router.post("/transfer4", async (req, res, next) => {
  try {
    const { senderPublicKey, recipientPublicKey, amount } = req.body;

    // Find the sender's account using their publicKey
    const senderAccount = await Account.findOne({ publicKey: senderPublicKey });

    if (!senderAccount) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Find the recipient's account using their publicKey
    const recipientAccount = await Account.findOne({ publicKey: recipientPublicKey });

    if (!recipientAccount) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Create a new transaction with a "pending" status
    const newTransaction = new Transaction({
      sender: {
        id: senderAccount._id,
        publicKey: senderPublicKey,
      },
      recipient: {
        id: recipientAccount._id,
        publicKey: recipientPublicKey,
      },
      amount: amount,
      balance: senderAccount.vrtBalance, // Set the balance field in the transaction
      status: "pending", // Set the status field as "pending"
    });

    // Sign the transaction with the sender's private key
    const privateKey = bs58.decode(senderAccount.privateKey);
    const transactionData = new TextEncoder().encode(newTransaction);

    const signature = nacl.sign.detached(transactionData, privateKey);

    // Store the signature in the transaction
    newTransaction.signature = bs58.encode(signature);

    // Save the transaction to the database
    await newTransaction.save();

    // Find the previous block to get its block height
    const previousBlock = await Block.findOne().sort({ blockHeight: -1 });

    // Calculate the new block height
    const newBlockHeight = previousBlock ? previousBlock.blockHeight + 1 : 0;

    // Create a new block for each transaction with the incremented block height
    const newBlock = new Block({
      transactions: [newTransaction._id],
      blockHeight: newBlockHeight,
      previousHash: previousBlock ? previousBlock.hash : "GENESIS", // Set previousHash
    });

    // Calculate the hash for the new block
    const blockData = JSON.stringify(newBlock); // Convert block data to a string
    const blockHash = crypto.createHash('sha256').update(blockData).digest('hex');
    newBlock.hash = blockHash; // Set the hash

    // Save the block to the database
    await newBlock.save();

    // Push the transaction ID to the sender's and recipient's transaction arrays
    senderAccount.transactions.push(newTransaction._id);
    recipientAccount.transactions.push(newTransaction._id);

    // Save the sender and recipient accounts again to update their transaction arrays
    await senderAccount.save();
    await recipientAccount.save();

    // Respond with a success message and the updated VRT balance of the sender
    res.status(200).json({ message: "Transfer initiated", vrtBalance: senderAccount.vrtBalance });
  } catch (error) {
    next(error);
  }
});

router.post("/transfer5", async (req, res, next) => {
  try {
    // Initialize valid as true before the transaction validations
    let valid = true; // Step 1: Initialize as true

    const { senderPublicKey, recipientPublicKey, amount } = req.body;

    // Find the sender's account using their publicKey
    const senderAccount = await Account.findOne({ publicKey: senderPublicKey });

    if (!senderAccount) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Find the recipient's account using their publicKey
    const recipientAccount = await Account.findOne({ publicKey: recipientPublicKey });

    if (!recipientAccount) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Create a new transaction with a "pending" status
    const newTransaction = new Transaction({
      sender: {
        id: senderAccount._id,
        publicKey: senderPublicKey,
      },
      recipient: {
        id: recipientAccount._id,
        publicKey: recipientPublicKey,
      },
      amount: amount,
      balance: senderAccount.vrtBalance, // Set the balance field in the transaction
      status: "pending", // Set the status field as "pending"
    });

    // Sign the transaction with the sender's private key
    const privateKey = bs58.decode(senderAccount.privateKey);
    const transactionData = new TextEncoder().encode(newTransaction);

    const signature = nacl.sign.detached(transactionData, privateKey);

    // Store the signature in the transaction
    newTransaction.signature = bs58.encode(signature);

    // Save the transaction to the database
    await newTransaction.save();

    // Add the transaction to a pending transaction pool
    const pendingTransaction = new PendingTransaction({
      transactionIds: [newTransaction._id],
    });

// Validate each transaction in the pending transaction pool
for (const transaction of pendingTransactions) {
  // Verify the transaction signature
  const publicKey = bs58.decode(transaction.sender.publicKey);
  const signature = bs58.decode(transaction.signature);
  const transactionData = new TextEncoder().encode(transaction);

  const isSignatureValid = nacl.sign.detached.verify(transactionData, signature, publicKey);

  if (!isSignatureValid) {
    valid = false;
    break;
  }

  // Update the transaction status to "confirmed"
  transaction.status = "confirmed";
  await transaction.save();
}

if (!valid) {
  return res.status(400).json({ message: "Invalid signature" });
}


    // Proceed with creating the block and sending the response
    // (Step 6: Continue with creating the block and sending the response)
    
// Once the transaction is confirmed, you can proceed to create a new block
    // Find the previous block to get its block height
    const previousBlock = await Block.findOne().sort({ blockHeight: -1 });

    // Calculate the new block height
    const newBlockHeight = previousBlock ? previousBlock.blockHeight + 1 : 0;

    // Create a new block for each transaction with the incremented block height
    const newBlock = new Block({
      transactions: pendingTransactionIds,
      blockHeight: newBlockHeight,
      previousHash: previousBlock ? previousBlock.hash : "GENESIS", // Set previousHash
    });

    // Calculate the hash for the new block
    const blockData = JSON.stringify(newBlock); // Convert block data to a string
    const blockHash = crypto.createHash('sha256').update(blockData).digest('hex');
    newBlock.hash = blockHash; // Set the hash

    // Save the block to the database
    await newBlock.save();

    // Push the transaction ID to the sender's and recipient's transaction arrays
    senderAccount.transactions.push(newTransaction._id);
    recipientAccount.transactions.push(newTransaction._id);

    // Save the sender and recipient accounts again to update their transaction arrays
    await senderAccount.save();
    await recipientAccount.save();


    // Respond with a success message and the updated VRT balance of the sender
    res.status(200).json({ message: "Transfer initiated", vrtBalance: senderAccount.vrtBalance });
  } catch (error) {
    next(error);
  }
});