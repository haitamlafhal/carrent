const { Pool } = require('pg');
require('dotenv').config();
const { types } = require('pg');

// Force numeric/decimal columns (OID 1700) to be returned as floats, not strings
types.setTypeParser(1700, (val) => parseFloat(val));

// ⚠️ REPLACE WITH YOUR ACTUAL POSTGRES CREDENTIALS
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'car_rental',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
