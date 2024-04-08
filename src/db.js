const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('db/database.sqlite', (err) => {
    if (err) {
        throw err.message
    }
    console.log('Connected to the database.')
})

module.exports = { db }
