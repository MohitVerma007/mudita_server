const { config } = require("dotenv");
config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
});

<<<<<<< HEAD
=======
// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// });

>>>>>>> f20a50877f938687103e08cd9f18728d810b5f74
pool.connect((err) => {
  if (err) throw err;
  console.log("Connect to PostgreSQL successfully!");
});
module.exports = {
  query: (text, params) => pool.query(text, params),
};
