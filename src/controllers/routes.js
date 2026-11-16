import { homePage } from './home/home.js';
import { Router } from 'express';

const router = Router();

router.get('/', homePage);

export default router;