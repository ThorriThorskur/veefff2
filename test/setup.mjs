import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db/pool.js';
import categoryRoutes from '../routes/categories.js';
import questionRoutes from '../routes/questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.NODE_ENV = 'test';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/categories', categoryRoutes);
app.use('/questions', questionRoutes);

export { app, pool };