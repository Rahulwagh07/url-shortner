const mysql = require('mysql');
require('dotenv').config();

exports.connect = () => {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  connection.connect((err) => {
    if (err) {
      console.error('MYSQL DB connection failed');
      console.error(err);
      process.exit(1);
    }
    console.log('MYSQL DB Connection Successful');
  });
  connection.on('error', (err) => {
    console.error('MySQL error occurred:');
    console.error(err);
    process.exit(1);
  });
};
