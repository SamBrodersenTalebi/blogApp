const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/User');

userRouter.post('/', async (req, res, next) => {
  const { password, name, username } = req.body;

  if (!password || !username) {
    return res.status(400).json({ error: 'Password or username is missing' });
  }
  if (password.length < 3 || username.length < 3) {
    return res
      .status(400)
      .json({ error: 'Password/username must be at least 3 characters long' });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username: username,
      name: name,
      passwordHash,
    });

    const savedUser = await user.save();

    res.status(200).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
