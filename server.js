const express = require('express');
require('dotenv').config();

const ImageRouter = require('./components/images/image-router.js');
const PantheonRouter = require('./components/pantheons/pantheon-router.js');
const KindRouter = require('./components/kinds/kind-router.js');
const CategoryRouter = require('./components/categories/category-router.js');
const SymbolRouter = require('./components/symbols/symbol-router.js');
const UserRouter = require('./components/users/user-router.js');

const server = express();
const cors = require('cors')
server.use(cors());


server.use('/uploads', express.static('uploads'))
server.use(express.json());
server.use('/api/images', ImageRouter);
server.use('/api/pantheons', PantheonRouter);
server.use('/api/kinds', KindRouter);
server.use('/api/categories', CategoryRouter);
server.use('/api/symbols', SymbolRouter);
server.use('/api/users', UserRouter);

server.get('/', (req, res) => {
  res.send("GrimWire API Connected");
});

module.exports = server;
