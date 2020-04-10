const Blog = require('../models/Blog');

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

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
