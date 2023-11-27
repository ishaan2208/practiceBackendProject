import app from "./app.js";
import connectDB  from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({path:"./.env"})

connectDB()
.then(() => app.listen(process.env.PORT || 8000,console.log(`Server is running on port http://localhost:${process.env.PORT}`)))
.catch((error) => console.log("Mongo DB connection failed",error.message));

  