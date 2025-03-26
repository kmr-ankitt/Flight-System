import { Request, Response } from "express";
import pool from "../config/db";

export const getAirports = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM airports");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching airports:", error);
    res.status(500).send("Error fetching airports");
  }
};
