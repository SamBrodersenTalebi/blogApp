const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/User');

userRouter.post('/', async (req, res, next) => {
  const body = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.json(savedUser);
});
