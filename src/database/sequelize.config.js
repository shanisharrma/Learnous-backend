require('ts-node/register');
const { ServerConfig } = require('../config');

module.exports = {
    development: {
        username: ServerConfig.DB_USER,
        password: ServerConfig.DB_PASS,
        database: ServerConfig.DB_NAME,
        host: ServerConfig.DB_HOST,
        port: ServerConfig.DB_PORT,
        dialect: 'postgres',
    },
    test: {
        username: 'root',
        password: null,
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'postgres',
    },
    production: {
        username: ServerConfig.DB_USER,
        password: ServerConfig.DB_PASS,
        database: ServerConfig.DB_NAME,
        host: ServerConfig.DB_HOST,
        port: ServerConfig.DB_PORT,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
};
