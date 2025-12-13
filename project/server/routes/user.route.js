const express = require('express');
const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const userRouter = express.Router();
const JWT=require('jsonwebtoken') 

// Register Route
userRouter.post('/register', async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: 'User already exists with this email',
      });}

    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPwd;

    const newUser = new User(req.body);
    await newUser.save();

    res.send({
      success: true,
      message: 'User registered successfully!',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login Route
userRouter.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: 'User not registered, please register',
      });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.send({
        success: false,
        message: 'Incorrect password',
      });
    }
   const token=JWT.sign({userId:user._id},process.env.JWT_SECRET)
    res.send({
      success: true,
      message: "You've logged in successfully!",
      user,
      token:token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error in logging in' });
  }
});

module.exports = userRouter;
