import express from "express";
import todoRoutes from "./routes/todoRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import { rateLimiter } from "./middleware/rateLimiter.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import morganMiddleware from "./middleware/morganMiddleware.js";



const app = express();

app.use(express.json());

app.use(morganMiddleware)

app.get("/api/v1/health", (req, res) => res.status(200).send("OK"));
app.use("/api/v1/todos", rateLimiter, todoRoutes);
app.use("/api/v1/auth", authRoutes)


app.use(globalErrorHandler);

export default app;