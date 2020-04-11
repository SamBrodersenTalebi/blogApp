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
    //When a password has been “hashed” it means it has been turned into a scrambled representation of itself
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

//Get all users in db
userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  });
  response.json(users.map((u) => u.toJSON()));
});

module.exports = userRouter;
