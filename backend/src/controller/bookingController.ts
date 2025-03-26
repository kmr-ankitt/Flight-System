import { Request, Response } from "express";
import pool from "../config/db";

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const { flight_id, passenger_name, passenger_email, passenger_phone } = req.body;

  if (!flight_id || !passenger_name || !passenger_email) {
    res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const queryText = `
      INSERT INTO Bookings (flight_id, passenger_name, passenger_email, passenger_phone)
      VALUES ($1, $2, $3, $4)
      RETURNING booking_id, booking_date;
    `;
    const values = [flight_id, passenger_name, passenger_email, passenger_phone || null];

    const result = await pool.query(queryText, values);

    res.status(201).json({
      message: 'Booking created successfully',
      booking: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    if ((error as any).code === '23503') {
      res.status(400).json({ error: 'Invalid flight_id: Flight does not exist' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM bookings");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send("Error fetching bookings");
  }
};
