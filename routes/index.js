import { Router } from 'express';
const router = Router();

import api from './api.js';

// Rate limit
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1000,
})

router.get('/', (req, res) => {

    const page = {
        title: "Home"
    };

    res.status(200).render('home', {
        page,
    });
});

router.use('/api', limiter, api);


export default router;