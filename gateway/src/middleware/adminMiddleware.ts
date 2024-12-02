import { Request, Response, NextFunction } from "express";

const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.admin) {
    res.status(403).json({ error: "Access denied" });
    return;
  }
  next();
};

export default requireAdmin;
