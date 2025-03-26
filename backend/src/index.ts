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

app.get("/api/flights", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM flights");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).send("Error fetching tables");
  }
});

app.post('/api/bookings', async (req: any, res: any) => {
  const { flight_id, passenger_name, passenger_email, passenger_phone } = req.body;

  // Basic validation
  if (!flight_id || !passenger_name || !passenger_email) {
    return res.status(400).json({ error: 'Missing required fields: flight_id, passenger_name, and passenger_email are required' });
  }

  try {
    // SQL query to insert booking
    const queryText = `
          INSERT INTO Bookings (flight_id, passenger_name, passenger_email, passenger_phone)
          VALUES ($1, $2, $3, $4)
          RETURNING booking_id, booking_date;
      `;
    const values = [flight_id, passenger_name, passenger_email, passenger_phone || null];

    // Execute query
    const result = await pool.query(queryText, values);

    // Send success response with booking details
    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        booking_id: result.rows[0].booking_id,
        flight_id,
        passenger_name,
        passenger_email,
        passenger_phone: passenger_phone || null,
        booking_date: result.rows[0].booking_date
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    if ((error as any).code === '23503') {
      // Foreign key violation
      return res.status(400).json({ error: 'Invalid flight_id: Flight does not exist' });
    }
    res.status(500).json({ error: 'Internal server error' });
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