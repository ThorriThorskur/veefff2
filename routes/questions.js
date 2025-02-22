import express from 'express';
import pool from '../db/pool.js';
import xss from 'xss';

const router = express.Router();

router.get('/new', async (req, res) => {
    try {
        const { rows: categories } = await pool.query('SELECT * FROM categories');
        res.render('newQuestion', { categories });
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).send('Error fetching categories');
    }
});

router.post('/', async (req, res) => {
    const question = xss(req.body.question);
    const category_id = xss(req.body.category_id);
    const answers = req.body.answers.map(answer => ({
        answer: xss(answer.answer),
        is_correct: answer.is_correct === 'on'
    }));

    // Validate inputs
    if (question.length < 10 || question.length > 255) {
        return res.status(400).send('Question must be between 10 and 255 characters.');
    }

    if (!category_id) {
        return res.status(400).send('Category is required.');
    }

    if (answers.length < 2 || answers.length > 10) {
        return res.status(400).send('There must be between 2 and 10 answers.');
    }

    const correctAnswers = answers.filter(answer => answer.is_correct);
    if (correctAnswers.length !== 1) {
        return res.status(400).send('There must be exactly one correct answer.');
    }

    try {
        const { rows } = await pool.query(
            'INSERT INTO questions (question, category_id) VALUES ($1, $2) RETURNING id',
            [question, category_id]
        );
        const question_id = rows[0].id;

        for (const answer of answers) {
            await pool.query(
                'INSERT INTO answers (answer, is_correct, question_id) VALUES ($1, $2, $3)',
                [answer.answer, answer.is_correct, question_id]
            );
        }

        res.redirect(`/categories/${category_id}`);
    } catch (error) {
        console.error('Error adding question:', error.message);
        res.status(500).send('Error adding question');
    }
});

export default router;