import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: "Request is not authorized" });
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id, admin } = jwt.verify(token, process.env.SECRET!) as { _id: string; admin:string };
    req.headers["x-user-id"] = _id;
    req.headers["x-user-admin"] = admin.toString();

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

export default requireAuth;
