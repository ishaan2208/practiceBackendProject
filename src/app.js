import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(urlencoded({ extended: true }));

app.use(express.static("public"));


//import routes
import userRoutes from "./routes/user.routes.js";

//routes declaration

app.use("/api/v1/users", userRoutes);

export default app;
