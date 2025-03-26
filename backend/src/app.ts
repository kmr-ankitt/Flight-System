import express from "express";
import cors from "cors";
import "./config/dotenv";
import airportRoutes from "./routes/airportRoutes";
import flightRoutes from "./routes/flighRoutes";
import bookingRoutes from "./routes/bookingRoutes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/airports", airportRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;