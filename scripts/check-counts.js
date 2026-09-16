// scripts/check-counts.js
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function check() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const tables = [
    'doctors',
    'hospitals',
    'hospital_beds',
    'laboratories',
    'lab_tests',
    'pharmacies',
    'medicines',
    'pharmacy_stock',
    'blood_banks',
    'blood_inventory',
    'ambulances'
  ];
  for (const t of tables) {
    const [res] = await conn.execute(`SELECT count(*) as count FROM ${t};`);
    console.log(`${t}: ${res[0].count}`);
  }
  await conn.end();
}

check().catch(console.error);
