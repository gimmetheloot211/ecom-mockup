import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  _id: string;
  admin: boolean;
}

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: "Request is not authorized" });
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id, admin } = jwt.verify(token, process.env.SECRET!) as JwtPayload;
    req.headers["x-user-id"] = _id;
    req.headers["x-user-admin"] = admin.toString();

    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

export default requireAuth;
