const mysql = require('mysql2');
require('dotenv').config();

// Creating the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Testing connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL successfully!');
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = pool.promise();
