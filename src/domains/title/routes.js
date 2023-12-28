const express = require("express");
const router = express.Router();
const Title = require("./model");
const Fighter = require("../fighter/model");


// create a new title
router.post("/create-title", async (req, res) => {
  try {
    const { name, image, weightClass } = req.body;

    const newTitle = new Title({ name, image, weightClass });

    const savedTitle = await newTitle.save();

    res.json(savedTitle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create a new title.' });
  }
});

// Get all titles
router.get('/', async (req, res) => {
  try {
    const titles = await Title.find();
    res.json(titles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve titles.' });
  }
});

// Associate a title with a fighter
router.post('/associate-title', async (req, res) => {
  try {
    const { titleId, fighterId } = req.body;

    // Validate that both titleId and fighterId are provided
    if (!titleId || !fighterId) {
      return res.status(400).json({ error: 'Both titleId and fighterId are required.' });
    }

    // Assuming you have a Fighter model with a 'titles' array
    const fighter = await Fighter.findById(fighterId);

    if (!fighter) {
      return res.status(404).json({ error: 'Fighter not found.' });
    }

    // Assuming 'titles' is an array of Title IDs in the Fighter model
    fighter.titles.push(titleId);

    await fighter.save();

    res.json({ message: 'Title associated with fighter successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to associate title with fighter.' });
  }
});

// Define the endpoint to fetch title information by ID
router.get('/:id', async (req, res) => {
  try {
    const title = await Title.findById(req.params.id);
    res.json(title);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve title.' });
  }
});


















module.exports = router;
