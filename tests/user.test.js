const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const User = require('../models/User');

describe('when there is initially one user at db', () => {
  //runs before each test block
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({ username: 'root', password: 'sekret' });
    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    //get user in db which is root user
    const usersAtStart = await helper.usersInDb();
    console.log(usersAtStart);

    const newUser = {
      name: 'Jeff',
      username: 'Jeff',
      password: '1234',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    //after creating one user there should be two
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    //should contain new user
    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
});
