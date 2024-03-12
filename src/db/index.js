const { config } = require("dotenv");
config();

const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
});

// const pool = new Pool({
//   user: "postgres",
//   password: "Vasudev@12345",
//   host: "62.72.31.25",
//   port: 5432,
//   database: "postgres",
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };

// const { Pool } = require("pg");
// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// });

pool.connect((err) => {
  if (err) throw err;
  console.log("Connect to PostgreSQL successfully!");
});
module.exports = {
  query: (text, params) => pool.query(text, params),
};
