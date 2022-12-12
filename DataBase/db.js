const db = require('sync-sql');

module.exports = {
    db,
    config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database : process.env.DB_NAME
      }
}