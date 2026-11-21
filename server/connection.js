var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'portfolio_db'
});

pool.getConnection(function (err, connection) {
  if (err) {
    return console.log(err);
  }
  console.log('Database connected successfully');
  connection.release();
});

module.exports = pool;
