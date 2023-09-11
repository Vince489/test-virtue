const Gamer = require("./model");
const { hashData } = require("./../../utils/hashData");

const createNewGamer = async (data) => {
  try {
    const { gamerTag, email, password } = data;

    // Checking if gamer already exists
    const existingGamer = await Gamer.findOne({ email });

    if (existingGamer) {
      throw Error("Gamer with the provided email already exists");
    }

    // hash password
    const hashedPassword = await hashData(password);
    const newGamer = new Gamer({
      gamerTag,
      email,
      password: hashedPassword,
    });
    // save gamer
    const createdGamer = await newGamer.save();
    return createdGamer;
  } catch (error) {
    throw error;
  }
};

module.exports = { createNewGamer };
