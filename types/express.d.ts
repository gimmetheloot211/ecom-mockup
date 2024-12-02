declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string; // The user's ObjectID in the database
        admin: boolean;
      };
    }
  }
}

export {};