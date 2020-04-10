const blogRouter = require('express').Router();
const Blog = require('../models/Blog');

blogRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouter.post('/', (request, response) => {
  const { title, url } = request.body;
  if (!title & !url) {
    return response.status(400).json({ msg: 'missing parameters' });
  }
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

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
