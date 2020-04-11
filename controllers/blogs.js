const blogRouter = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const middleware = require('../utils/middleware');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post(
  '/',
  middleware.tokenExtractor,
  async (request, response, next) => {
    const { title, url, author, likes } = request.body;
    if (!title & !url) {
      return response.status(400).json({ msg: 'missing parameters' });
    }

    try {
      //decoded object contains id and username specified in login router
      const user = await User.findById(request.user.id);
      console.log(request.user.id);

      const blog = new Blog({
        title: title,
        url: url,
        author: author,
        likes: likes === undefined ? 0 : likes,
        //get id of user from user variable
        user: user._id,
      });

      const savedBlog = await blog.save();

      //concat the blog id to user object
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();

      response.json(savedBlog.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

blogRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

blogRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body;
  const blog = {
    title: title,
    author: author,
    url: url,
    likes: likes,
  };
  await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
});
module.exports = blogRouter;
