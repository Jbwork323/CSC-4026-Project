/*
Index.js contains all server side code
*/

import express from "express";
import pkg from "pg";
import bodyParser from "body-parser";
import https from "https";
import fs from "fs";

const { Pool } = pkg;
const pool = new Pool({
  //these are all replit secrets
  user: process.env["PGUSER"],
  host: process.env["PGHOST"],
  database: process.env["PGDATABASE"],
  password: process.env["PGPASSWORD"],
  port: process.env["PGPORT"],
  ssl: {
    sslmode: "require", // ensuring secure connection
  },
});
const app = express();

// SSL certificate configuration
const privateKey = fs.readFileSync("server.key", "utf8");
const certificate = fs.readFileSync("server.cert", "utf8");

// Creating an HTTPS service like this:
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  //display index.html file in the views folder
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", async (req, res) => {
  try {
    const result = await sendToServer(req.body);
    res.status(200).json({ message: "User added successfully", user: result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding user", error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Express server initialized");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const query =
      "SELECT * FROM users WHERE email = $1 AND password = crypt($2, password)";
    const { rows } = await pool.query(query, [email, password]);
    if (rows.length > 0) {
      // If user is found
      res.status(200).json({ message: "Login successful", user: rows[0] });
    } else {
      // If user is not found
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//encryption algo from from https://x-team.com/blog/storing-secure-passwords-with-postgresql/
async function sendToServer(data) {
  try {
    const result = await pool.query(
      "INSERT INTO users(email, password) VALUES($1, crypt($2,gen_salt('bf'))) RETURNING *",
      [data.email, data.password],
    );
    return result.rows[0];
  } catch (err) {
    console.error(err.message);
    throw err; // Rethrow to handle it in the calling function
  }
}
