import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import categoryRoutes from './routes/categories.js';
import questionRoutes from './routes/questions.js';
import pool from './db/pool.js';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/categories', categoryRoutes);
app.use('/questions', questionRoutes);

app.get('/', async (req, res) => {
    try {
        const { rows: categories } = await pool.query('SELECT * FROM categories');
        res.render('index', { categories });
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).send('Error fetching categories');
    }
});

// 404 Error Handling
app.use((req, res) => {
    res.status(404).render('404', { message: 'Page Not Found' });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
