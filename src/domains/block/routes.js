const express = require("express");
const router = express.Router();
const Block = require("./model");
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




module.exports = router;
