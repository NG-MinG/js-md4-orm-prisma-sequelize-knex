const express = require('express');
const routes = require('./routes');
const { notFound, handler } = require('./middlewares/error-handler');
const { success } = require('./views/base.view');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => success(res, { status: 'ok' }));
app.use('/api/v1', routes);

app.use(notFound);
app.use(handler);

module.exports = app;
