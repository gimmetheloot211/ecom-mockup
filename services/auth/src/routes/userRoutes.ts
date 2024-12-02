import express from 'express'
import userControllers from "../controllers/userControllers";

const router = express.Router();

// Unauthenticated routes
router.post('/login', userControllers.userLogin);
router.post('/signup', userControllers.userSignup);

// Authenticated routes
router.get('/user', userControllers.userGetDetails);
router.patch('/user', userControllers.userUpdateDetails);

// Admin routes
router.get('/user/:id', userControllers.userGetDetailsAdmin);

export default router;