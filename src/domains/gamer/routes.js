const express = require("express");
const router = express.Router();
const { createNewGamer } = require("./controller");
const generateToken = require("../../utils/auth");

router.post("/signup", async (req, res) => {
  try {
    let { gamerTag, email, password } = req.body;
    gamerTag = gamerTag.trim();
    email = email.trim();
    password = password.trim();

    if (!gamerTag && !email && !password) {
      throw Error("GamerTag, email and password are required");
    } else if (!/^[a-zA-Z0-9 ]*$/.test(gamerTag)) {
      throw Error("Invalid gamerTag entered");
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw Error("Invalid email entered");
    } else if (password.length < 8) {
      throw Error("Password is too short!");
    } else {
      const newGamer = await createNewGamer({
        gamerTag,
        email,
        password,
      });

      const token = generateToken(newGamer._id);

// Set the cookie with SameSite=None and Secure attributes
      res.cookie("token", token, { httpOnly: true, sameSite: "None", secure: true, expires: new Date(Date.now() + 3600000) });
      res.status(201).json({ gamer: newGamer, token });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});


module.exports = router;
