const knex = require('knex');

const env = process.env.NODE_ENV || 'development'; //process.env.DB_ENV ||

const configOptions = require('./knexfile')[env];

module.exports = knex(configOptions);
