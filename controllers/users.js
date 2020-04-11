const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/User');

userRouter.post('/', async (req, res, next) => {
  const { password, name, username } = req.body;

  if (!password || !username) {
    return res.status(400).send('Password or username is missing');
  }
  if (password.length < 4 || username.length < 4) {
    return res
      .status(400)
      .send('Password/username must be at least 3 characters long');
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username: username,
    name: name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.json(savedUser);
});
