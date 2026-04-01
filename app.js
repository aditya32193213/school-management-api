import express from "express";
import cors from "cors";
import apiroutes from "./routes/school.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import morgan from "morgan";
import helmet from "helmet";


const app=express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api",apiroutes);

app.use(errorHandler);

export default app;