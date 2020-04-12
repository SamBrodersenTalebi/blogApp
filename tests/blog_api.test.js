const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');
const supertest = require('supertest');
const app = require('../app');
const helper = require('../utils/tests_helper');
const api = supertest(app);

describe('When there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.deleteMany({});

    //create blog object for each blog in array of initialBlogs
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog);
      await blogObject.save();
    }

    await User.remove({});
    //create user object for each user in array of initialusers
    for (let user of initialUsers) {
      let userObject = new User(user);
      await userObject.save();
    }
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('id property of the blog exists', async () => {
    const response = await api.get('/api/blogs');
    response.body.map((blog) => {
      expect(blog.id).toBeDefined();
    });
  });

  describe('Adding new blog', async () => {
    test('valid blog can be added', async () => {
      const newBlog = {
        title: 'How are you',
        author: 'Kia',
        url: 'www.kia.dk',
        likes: 5,
      };
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: 123 })
        .end((err, res) => {
          const blog = res.body;
          expect(res.status).to.be.equal(200);
          expect(blog).to.be.equal(newBlog);
          done();
        });

      const blogs = await helper.blogsInDb();
      expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
      //array with all blog titles
      const blogContents = blogs.map((blog) => blog.title);
      expect(blogContents).toContain('How are you');
    });

    test('id property default to 0', async () => {
      const newBlog = {
        title: 'NO LIKE!',
        author: 'LikeMe',
        url: 'www.noLike.dk',
      };
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogs = await helper.blogsInDb();
      const blogLikes = blogs.map((blog) => blog.likes);
      //get last element in array with [blogLikes.length-1]
      expect(blogLikes[blogLikes.length - 1]).toBe(0);
    });

    test('if title and url is missing then respond with 400', async () => {
      const newBlog = {
        author: 'Kia',
        likes: 5,
      };
      await api.post('/api/blogs').send(newBlog).expect(400);
    });

    test('delete blog given id', async () => {
      const blogs = await helper.blogsInDb();
      const ids = blogs.map((blog) => blog.id);
      await api.delete(`/api/blogs/${ids[0]}`).expect(204);
    });
  });
});

//implement auth https://github.com/visionmedia/supertest/issues/398
//after all tests are done close connection to DB
afterAll(() => {
  mongoose.connection.close();
});
