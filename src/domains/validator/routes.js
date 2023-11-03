const Validator = require('./models/Validator'); // Import the Validator model

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
