import express, { Application, Request, Response } from "express";
import router from "./Routes/routes";
import globalErrorHandler from "./Middleware/globalErrorHandler";
import notFound from "./Middleware/notFound";
import cookieParser from "cookie-parser";
import { cors } from "./Lib/cors";

const app: Application = express();

// Apply custom CORS middleware globally
app.use(cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Server Running",
  });
});

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
