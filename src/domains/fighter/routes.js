const express = require("express");
const router = express.Router();
const Fighter = require("./model");


// Create an endpoint to update a fighter's stats
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { wins, losses, draws } = req.body;

    // Find the fighter to update
    const fighter = await Fighter.findById(id);

    if (!fighter) {
      return res.status(404).json({ message: "Fighter not found" });
    }

    // Update the fighter's stats
    fighter.wins = wins;
    fighter.losses = losses;
    fighter.draws = draws;

    // Save the updated fighter to the database
    await fighter.save();

    // Respond with the updated fighter
    res.json(fighter);
  } catch (error) {
    next(error);
  }
});

// get all fighters
router.get("/", async (req, res, next) => {
  try {
    const fighters = await Fighter.find();
    res.json(fighters);
  } catch (error) {
    next(error);
  }
});

// Add a new fighter
router.post('/', async (req, res) => {
  const fighter = new Fighter({
    gamerTag: req.body.gamerTag,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nickname: req.body.nickname,
    image: req.body.image,
    heightFt: req.body.heightFt,
    heightIn: req.body.heightIn,
    reach: req.body.reach,
    stance: req.body.stance,
    weightClass: req.body.weightClass,
    ovr: req.body.ovr,
    residence: req.body.residence,
    fights: req.body.fights,
    nationality: req.body.nationality,
    manager: req.body.manager,
    trainer: req.body.trainer,
    gym: req.body.gym,
    promoter: req.body.promoter,
  });
  try {
    const newFighter = await fighter.save();
    res.status(201).json(newFighter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
