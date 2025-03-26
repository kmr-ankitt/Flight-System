import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

const PORT = 4000;
const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection setup
dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

// Test the database connection
pool.connect((err) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
  } else {
    console.log("Connected to PostgreSQL");
  }
});

app.get("/api/airports", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM airports");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).send("Error fetching tables");
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings");
    res.json(result.rows);
  }
  catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).send("Error fetching tables");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});