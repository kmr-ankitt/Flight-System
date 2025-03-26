import express from "express";
import cors from "cors";

const PORT = 4000;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});