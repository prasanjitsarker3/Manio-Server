import { NextFunction, Request, Response } from "express";

export const cors = async (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = ["https://maniobd.com", "https://control.maniobd.com"];
  const origin = req.headers.origin as string;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
};
