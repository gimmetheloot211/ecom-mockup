import express from 'express'
import userControllers from "../controllers/userControllers";

const router = express.Router();

router.post('/login', userControllers.userLogin);
router.post('/signup', userControllers.userSignup);


router.get('/user', userControllers.userGetDetails);
router.patch('/user', userControllers.userUpdateDetails);

router.get('/user/:id', userControllers.userGetDetailsAdmin);

export default router;