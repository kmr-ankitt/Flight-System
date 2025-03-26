import { Router } from "express";
import { createBooking, getBookings } from "../controller/bookingController";

const router = Router();
router.post("/", createBooking);
router.get("/", getBookings);

export default router;
