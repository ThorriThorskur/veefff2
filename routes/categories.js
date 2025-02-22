import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { rows: categories } = await pool.query('SELECT * FROM categories');
        res.render('index', { categories });
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).send('Error fetching categories');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows: categoryRows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
        if (categoryRows.length === 0) {
            return res.status(404).render('404', { message: 'Category Not Found' });
        }

        const { rows: questionRows } = await pool.query('SELECT * FROM questions WHERE category_id = $1', [id]);
        const questions = await Promise.all(questionRows.map(async (question) => {
            const { rows: answerRows } = await pool.query('SELECT * FROM answers WHERE question_id = $1', [question.id]);
            return { ...question, answers: answerRows };
        }));

        res.render('category', { category: categoryRows[0], questions });
    } catch (error) {
        console.error('Error fetching category:', error.message);
        res.status(500).send('Error fetching category');
    }
});

export default router;