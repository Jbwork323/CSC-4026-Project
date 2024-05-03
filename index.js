/*
Index.js contains all server side code
Postgre database is not working because deployment database has no tables, 
replit creates new database on deployment figure out how to create tables on deployment or 
consider creating own neon database
*/

import express from "express";
import pkg from "pg";
import bodyParser from "body-parser";
import https from "https";
import fs from "fs";
import session from "express-session";
import sanitizeHtml from "sanitize-html";
import http from "http";
import path from "path";

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

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// configure session middleware
app.use(
  session({
    secret: "YourSessionSecret", // Use a secure, unique, and long key here
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
      // Because of the way replit is configured this has to be set to false for sessions to work
      secure: false,
      httpOnly: true, // prevents client side JS from reading the cookie
      maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    },
  }),
);

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (req.session) {
    req.session.email = req.email; // Ensuring the session contains the user's email after sign up
  }
  const sanitizedEmail = sanitizeHtml(email);
  const sanitizedPassword = sanitizeHtml(password);
  try {
    const query =
      "SELECT * FROM users WHERE email = $1 AND password = crypt($2, password)";
    const { rows } = await pool.query(query, [
      sanitizedEmail,
      sanitizedPassword,
    ]);
    if (rows.length > 0) {
      // Store user's email in session
      req.session.email = rows[0].email;
      res.status(200).json({ message: "Login successful", user: rows[0] });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});
//create users table if it doesn't exist
async function initializeDatabase() {
  const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password TEXT NOT NULL
  );`;
  try {
    await pool.query(createUsersTableQuery);
    console.log("Users table is ready.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

//encryption algo from from https://x-team.com/blog/storing-secure-passwords-with-postgresql/
async function sendToServer(data) {
  const sanitizedEmail = sanitizeHtml(data.email);
  const sanitizedPassword = sanitizeHtml(data.password);

  try {
    const result = await pool.query(
      "INSERT INTO users(email, password) VALUES($1, crypt($2,gen_salt('bf'))) RETURNING *",
      [sanitizedEmail, sanitizedPassword],
    );
    return result.rows[0];
  } catch (err) {
    console.error(err.message);
    throw err; // Rethrow to handle it in the calling function
  }
}

app.get("/getEmail", (req, res) => {
  if (req.session && req.session.email) {
    //send back email from session storage
    res.status(200).json({ email: req.session.email });
  } else {
    res.status(401).send("Unauthorized: No session available");
  }
});

//not functional
app.post("/saveSurvey", async (req, res) => {
  try {
    const result = await sendSurveyData(req.body, req.session.email);
    res.status(200).json({ message: "User added successfully", user: result });
  } catch (error) {
    res.status(500);
    res.json({ message: "Error saving survey", error: error.message });
  }
});
//not functional
async function sendSurveyData(data, email) {
  try {
    var userId = await pool.query("select id from users where email = ($1)", [
      email,
    ]);
    userId = Number(userId.rows[0].id);
    await pool.query(
      "insert into surveys(surveyName, creator) values ($1, $2) returning *",
      [data.name, userId],
    );
  } catch (err) {
    console.error(err.message);
    throw err; // Rethrow to handle it in the calling function
  }
}
// SSL certificate configuration
const privateKey = process.env["SERVER_KEY"];
const certificate = process.env["SERVER_CERT"];

// Creating an HTTPS service like this:
const credentials = { key: privateKey, cert: certificate };
var httpsServer = https.createServer(credentials, app);
var httpServer = http.createServer(app);
initializeDatabase().then(() => {
  app.listen(3000);
  //httpsServer.listen(443);
});
