const express = require("express");
const router = express.Router();
const Block = require("./model");
const Blockchain = require('../blockchain/model');
const Transaction = require('../transaction/model');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const MAX_TRANSACTIONS_PER_BLOCK = 4

// Initialize a new blockchain
router.post("/create", async (req, res, next) => {
    try {
      const { name, slot, epoch, consensusRules } = req.body;
  
      // Create a new blockchain document
      const newBlockchain = new Blockchain({
        name: name || 'YourBlockchainName',
        slot: slot || 0,
        epoch: epoch || 0,
        consensusRules: consensusRules || {
          consensusAlgorithm: 'Proof of Stake',
          maxValidators: 20,
          proposalThreshold: 75,
          upgradeProtocol: 'BFT',
        },
      });
  
      // Save the new blockchain document to the database
      await newBlockchain.save();
  
      res.status(201).json(newBlockchain);
    } catch (error) {
      next(error);
    }
  });


  module.exports = router;











