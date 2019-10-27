import mysql from "mysql2";

// const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: 'sao14111',
})
export default pool.promise();