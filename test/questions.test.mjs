import { test, before, after } from 'node:test';
import assert from 'assert';
import request from 'supertest';
import sinon from 'sinon';
import { app } from './setup.mjs';
import pool from '../db/pool.js';

let queryStub;

before(() => {
  // Mock the database queries
  queryStub = sinon.stub(pool, 'query');
});

after(() => {
  // Restore the original database queries
  queryStub.restore();
});

test('GET /questions/new should return a form for adding a new question', async () => {
  // Mock the database response
  queryStub.withArgs('SELECT * FROM categories').resolves({ rows: [{ id: 1, name: 'Category 1' }] });

  const response = await request(app).get('/questions/new');
  assert.strictEqual(response.status, 200);
  assert(response.text.includes('Add a new question'));
});