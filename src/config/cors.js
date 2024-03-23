const cors = require('cors')

const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus:  204,
  };

module.exports = corsOptions;