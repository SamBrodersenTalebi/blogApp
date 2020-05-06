const logger = require('./logger');
const jwt = require('jsonwebtoken');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).send({ error: 'invalid token' });
  } else if (error.name === 'CastError') {
    return response.status(404).json({ error: 'Blog not found' });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  //get token from header skip Bearer part with substring
  const token = req.get('authorization').substring(7);
  console.log(token);

  const decodedToken = jwt.verify(token, process.env.SECRET);

  //Check to see if token exists
  if (!token || !decodedToken) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  //The object decoded from the token contains the username and id fields
  req.user = decodedToken;
  console.log(decodedToken);

  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
