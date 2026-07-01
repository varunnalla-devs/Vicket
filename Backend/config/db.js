const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "varunsql26",
  database: "vicket",
});

connection.connect((err) => {
  if (err) {
    console.log("❌ Database Connection Failed");
    console.log(err);
  } else {
    console.log("✅ Connected to Vicket Database");
  }
});

module.exports = connection;