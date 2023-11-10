const express = require('express');
const router = express.Router();
const Validator = require('../validator/model'); // Import the Validator model
const Transaction = require('../transaction/model'); // Import the Transaction model

// Create a new route for the validation process
router.post('/validate', async (req, res, next) => {
  try {
    const { transactionId, validatorAddress, validationData } = req.body;

    // Find the validator by address
    const validator = await Validator.findOne({ address: validatorAddress });

    if (!validator) {
      return res.status(404).json({ message: 'Validator not found' });
    }

    // Check if the validator is active or has enough stake, or any other validation checks.

    // Find the transaction by ID
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Store the validation data and validator's information in the transaction
    transaction.validationData = validationData;
    transaction.validatedBy = validator;
    transaction.validated = true; // Mark the transaction as validated

    // Save the updated transaction to the database
    await transaction.save();

    res.status(200).json({ message: 'Transaction validated successfully' });
  } catch (error) {
    next(error);
  }
});

// Create a new route for the validation process
router.post('/validate2', async (req, res, next) => {
  try {
    const { transactionId, validatorAddress, validationData } = req.body;

    // Find the validator by address
    const validator = await Validator.findOne({ address: validatorAddress });

    if (!validator) {
      return res.status(404).json({ message: 'Validator not found' });
    }

    if (!validator.active || validator.stake <= 0) {
      return res.status(400).json({ message: 'Validator is inactive or has insufficient stake' });
    }

    // Find the transaction by ID
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if the transaction is already complete
    if (transaction.confirmations >= 20) {
      return res.status(400).json({ message: 'Transaction is already complete' });
    }

    // Store the validation data and validator's information in the transaction
    transaction.validationData = validationData;
    transaction.validatedBy = validator;
    transaction.validated = true; // Mark the transaction as validated
    transaction.confirmations = (transaction.confirmations || 0) + 1; // Increment confirmation count

    // Save the updated transaction to the database
    await transaction.save();

    res.status(200).json({ message: 'Transaction validated successfully' });

    // Check if the transaction has received 20 confirmations and mark it as complete
    if (transaction.confirmations >= 20) {
      transaction.complete = true;
      await transaction.save();
      // You can perform additional actions when the transaction is complete.
    }
  } catch (error) {
    next(error);
  }
});

// Create a new Validator
router.post('/create', async (req, res, next) => {
  try {
    const { owner, address, stake } = req.body;

    // Create a new validator document
    const newValidator = new Validator({
      owner: owner || 'YourValidatorName',
      address: address || 'YourValidatorAddress',
      stake: stake || 0,
    });

    // Save the new validator document to the database
    await newValidator.save();

    res.status(201).json(newValidator);
  } catch (error) {
    next(error);
  }
});


// Round 1: Select 5 validators
router.get('/select-validators', async (req, res) => {
  try {
    // Fetch all validators from the database
    const allValidators = await Validator.find();
    
    // Shuffle the validators to ensure randomness
    const shuffledValidators = shuffleArray(allValidators);

    // Select the first 5 validators (you can adjust the number as needed)
    const selectedValidators = shuffledValidators.slice(0, 5);

    // Use the public keys of selectedValidators to verify the transaction signature the 5th validator will be the block creator and signer



    // Implement the block creation logic here

    res.json(selectedValidators);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Helper function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = router;
