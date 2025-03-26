import { Router } from "express";
import { getFlights } from "../controller/flightController";

const router = Router();
router.get("/", getFlights);

export default router;
