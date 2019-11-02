const knex = require('knex');

const env = process.env.DB_ENV || process.env.NODE_ENV || 'development';

const configOptions = require('../knexfile')[env];

module.exports = knex(configOptions);
