import { Request, Response } from "express";
import pool from "../config/db";

export const getFlights = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM flights");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).send("Error fetching flights");
  }
};
