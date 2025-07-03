import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
