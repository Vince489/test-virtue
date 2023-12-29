const express = require('express');
const router = express.Router();
const WaitingList = require('./model');

router.get('/', (req, res) => {
    res.send('Waiting List');
});

// Add gamer to waiting list
router.post('/add', (req, res) => {
  const { gamerTag } = req.body;
  const newGamer = new WaitingList({
    gamerTag
  });
  newGamer.save()
    .then(gamer => res.json(gamer))
    .catch(err => console.log(err));
});

// Get all gamers on waiting list
router.get('/all', (req, res) => {
  WaitingList.find()
    .then(gamers => res.json(gamers))
    .catch(err => console.log(err));
});




module.exports = router;