import { test } from 'node:test';
import assert from 'assert';
import request from 'supertest';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import categoryRoutes from '../routes/categories.js';
import pool from '../db/pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use('/categories', categoryRoutes);

test('GET /categories should return a list of categories', async () => {
  const response = await request(app).get('/categories');
  assert.strictEqual(response.status, 200);
  assert(response.text.includes('<h1>Categories</h1>'));
});

test('GET /categories/:id should return a category with questions', async () => {
  const response = await request(app).get('/categories/1');
  assert.strictEqual(response.status, 200);
  assert(response.text.includes('<h1>'));
  assert(response.text.includes('<ul class="questions">'));
});

test('GET /categories/:id should return 404 for non-existent category', async () => {
  const response = await request(app).get('/categories/9999');
  assert.strictEqual(response.status, 404);
});

test.after(() => {
  pool.end();
});