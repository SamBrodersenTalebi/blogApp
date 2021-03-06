const Blog = require('../models/Blog');
const User = require('../models/User');

const initialBlogs = [
  {
    title: 'Very nice',
    author: 'Sam',
    url: 'www.sam.dk',
    likes: 5,
  },
  {
    title: 'Kians blog',
    author: 'Kian',
    url: 'www.kian.dk',
    likes: 7,
  },
];

const initialUsers = [
  {
    username: 'Sam',
    password: 'dido',
    name: 'Muggi',
  },
  {
    username: 'Kian',
    password: '1234',
    name: 'Kida',
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
