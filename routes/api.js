import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

const endpoint = process.env.ENDPOINT;
const apiKey = process.env.KEY;
const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'text/plain',
};


router.post('/poetry', async(req, res) => {

    const { type, theme } = req.body;

    try {
        const response = await fetch(`${endpoint}/poetry?type=${type}&theme=${theme}`, {
            headers,
        });
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error);
        return error;
    }
});

router.post('/keywords', async (req, res) => {

    const { paragraph } = req.body;

    try {
        const response = await fetch(`${endpoint}/keywords`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                data: {
                    paragraph
                }
            }),

        });

        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error);
        return error;
    }
});

router.post('/rewrite', async(req, res) => {

    const { oldWord, newWord } = req.body;

    try {
        const response = await fetch(`${endpoint}/rewrite?old=${oldWord}&new=${newWord}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                data: {
                    paragraph
                }
            }),

        });

        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error);
        return error;
    }
});

export default router;