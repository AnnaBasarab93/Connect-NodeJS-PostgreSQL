import express from 'express';
const ordersRouter = express.Router();

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool();










export default ordersRouter;