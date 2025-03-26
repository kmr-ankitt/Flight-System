import { Router } from "express";
import { getAirports } from "../controller/airportController";

const router = Router();
router.get("/", getAirports);

export default router;
