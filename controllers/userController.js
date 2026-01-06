const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;
const signup = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "user_already_exist" });
    }
    //10 = saltRound
    const hashedPassword = await bcrypt.hash(password, 10); 
    const result = await userModel.create({
      userName: userName,
      email: email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        email: result.email,
        userName: result.userName,
        _id: result._id,
      },
      SECRET_KEY
    );
    res.status(201).json({ user: result, token: token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credencials" });
    }
    const token = jwt.sign(
      {
        email: existingUser.email,
        _id: existingUser._id,
        userName: existingUser.userName,
      },
      SECRET_KEY
    );
    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { signup, signin };
