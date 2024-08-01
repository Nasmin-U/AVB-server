import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./src/db/db.connection.js";
import userRoutes from "./src/routes/user.route.js";
import wordRoutes from "./src/routes/word.route.js";
import cors from "cors";

dotenv.config();

const app = express();

connectDb();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/words", wordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
