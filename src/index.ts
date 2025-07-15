import express, { Application, Express } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import connectDB from "./config/db";
import userRouter from "./routes/user-router";
import appLoger from "./middlewares/appLogger";
import { setupSwagger } from "./config/swagger";
import employeeRouter from "./routes/employee-router";
import leaveRouter from "./routes/leave-router";
import attendanceRouter from "./routes/attendance-router";

// Connect to MongoDB
connectDB();

// Load environment variables from.env file
dotenv.config();

// Express app initialization
const app: Application = express();
setupSwagger(app as Express);

// App Configuration
const hostName: string = String(process.env.HOSTNAME);
const port: number = Number(process.env.PORT) || 5000;

// Middleware to parse JSON request bodies
app.use(cors()); // it is used for enabling CORS (Cross-Origin Resource Sharing) for cross-origin requests
app.use(express.json()); // it is used for parsing JSON request bodies from express
app.use(express.urlencoded({ extended: true })); // it is used for parsing JSON request bodies from express
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(appLoger); // it is used for logging, its a custom logger middleware
app.use(morgan("dev")); // it is used for logging, its a third party library middleware

// Routes Adding below
app.use("/auth/api", userRouter);
app.use("/api", employeeRouter);
app.use("/api", leaveRouter);
app.use("/api", attendanceRouter);

app.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}`);
});
