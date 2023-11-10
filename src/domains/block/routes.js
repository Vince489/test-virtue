const express = require("express");
const router = express.Router();
const Block = require("./model");
const Blockchain = require('../blockchain/model');
const Transaction = require('../transaction/model');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const MAX_TRANSACTIONS_PER_BLOCK = 4

// get all blocks
router.get("/", async (req, res, next) => {
  try {
    const blocks = await Block.find();
    res.json(blocks);
  } catch (error) {
    next(error);
  }
});

// Create a new block
function createBlock(transactions, previousHash, blockHeight, validator, validatorSignature) {
  // Create the block
  const newBlock = new Block({
    timeStamp: new Date(),
    blockHeight: blockHeight,
    previousHash: previousHash,
    transactions: transactions,
    validator: validator,
    validatorSignature: validatorSignature
  });

  return newBlock;
}

// Define a route for adding a new block
// router.post('/addBlock', async (req, res) => {
//   try {
//     // Get the data for the new block from the request body
//     const { validator, validatorSignature } = req.body;

//     // Find the latest block in the blockchain to get its height and hash
//     const latestBlock = await Block.findOne().sort({ blockHeight: -1 });

//     // Calculate the new block's properties
//     const newBlock = new Block({
//       timeStamp: new Date(),
//       blockHeight: latestBlock ? latestBlock.blockHeight + 1 : 1,
//       previousHash: latestBlock ? latestBlock.hash : 'GENESIS',
//       transactions, // This can be the data associated with the new block
//       validator, // The node/validator responsible for creating the block
//       validatorSignature, // Signature of the validator
//     });

//     // Save the new block to the database
//     await newBlock.save();

//     // Update the blockchain to include the new block
//     const blockchain = await Blockchain.findOne(); // Assuming you have a single blockchain instance
//     blockchain.blocks.push(newBlock._id);
//     await blockchain.save();

//     res.status(200).json({ message: 'New block added to the blockchain', block: newBlock });
//   } catch (error) {
//     console.error('Error adding a new block:', error);
//     res.status(500).json({ message: 'Error adding a new block to the blockchain' });
//   }
// });

// create genesis block
router.post("/genesis", async (req, res, next) => {
  try {
    const genesisBlock = new Block({
      blockHeight: 0,
      hash: "genesis",
      previousHash: "genesis",
      transactions: [],
      signature: "genesis",
      validator: "genesis",
      validatorSignature: "genesis"
    });

    await genesisBlock.save();

    res.status(201).json(genesisBlock);
  } catch (error) {
    next(error);
  }
});



async function initializeBlockchain() {
  try {
    // Create the genesis block
    const genesisBlock = new Block({
      index: 0,
      previousHash: '0', // Genesis block has no previous hash
      timestamp: new Date().toISOString(),
      data: 'Genesis Block Data', // You can add any initial data here
      nonce: 0, // You may set the nonce as needed
    });

    // Save the genesis block to the database
    await genesisBlock.save();

    // Define the initial consensus rules
    const initialConsensusRules = {
      consensusAlgorithm: 'Proof of Stake',
      maxValidators: 20,
      proposalThreshold: 75,
      upgradeProtocol: 'BFT',
    };

    // Create the blockchain and set its properties
    const blockchain = new Blockchain({
      name: 'YourBlockchainName',
      blocks: [genesisBlock._id], // Store the ID of the genesis block
      consensusRules: initialConsensusRules,
    });

    // Save the blockchain to the database
    await blockchain.save();

    console.log('Blockchain initialized with the genesis block.');
  } catch (error) {
    console.error('Blockchain initialization failed:', error);
  }
}

// Call the initialization function to set up your blockchain
// initializeBlockchain();


// Create a new block
router.post("/", async (req, res, next) => {
  try {
    // Find the maximum blockHeight in the existing blocks
    const maxBlock = await Block.findOne().sort({ blockHeight: -1 });

    let newBlockHeight = 0;

    if (maxBlock) {
      // If there are existing blocks, increment the blockHeight
      newBlockHeight = maxBlock.blockHeight + 1;
    }
    

    const newBlock = new Block({
      // Other fields...
      blockHeight: newBlockHeight // Set the blockHeight for the new block
    });

    await newBlock.save();

    res.status(201).json(newBlock);
  } catch (error) {
    next(error);
  }
});

// Assuming you have defined the Blockchain model and imported it

// Add a new transaction to the pending transactions of a specific blockchain
router.post("/:blockchainId/addTransaction", async (req, res, next) => {
  try {
    const blockchainId = req.params.blockchainId;
    const { senderPublicKey, recipientPublicKey, amount } = req.body;

    // Find the blockchain by ID
    const blockchain = await Blockchain.findById(blockchainId);

    if (!blockchain) {
      return res.status(404).json({ message: "Blockchain not found" });
    }

    // Create a new transaction (assuming you have a Transaction model)
    const newTransaction = new Transaction({
      sender: {
        publicKey: senderPublicKey,
        // Other sender information...
      },
      recipient: {
        publicKey: recipientPublicKey,
        // Other recipient information...
      },
      amount: amount,
    });

    // Add the new transaction to the pending transactions array of the blockchain
    blockchain.pendingTransactions.push(newTransaction);

    // Save the updated blockchain document
    await blockchain.save();

    res.status(201).json({ message: "Transaction added to pending transactions" });
  } catch (error) {
    next(error);
  }
});



module.exports = router;
