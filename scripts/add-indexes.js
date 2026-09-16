// scripts/add-indexes.js
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function applyIndexes() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('Connected to DB. Applying performance indexes...');
  const indexes = [
    { table: 'doctors', name: 'idx_doctors_specialization', cols: '(specialization)' },
    { table: 'doctors', name: 'idx_doctors_city', cols: '(city)' },
    { table: 'doctors', name: 'idx_doctors_hospital_id', cols: '(hospital_id)' },
    { table: 'doctors', name: 'idx_doctors_coords', cols: '(latitude, longitude)' },
    { table: 'hospital_beds', name: 'idx_hospital_beds_hosp_type', cols: '(hospital_id, bed_type)' },
    { table: 'pharmacy_stock', name: 'idx_pharmacy_stock_pharm_med', cols: '(pharmacy_id, medicine_id)' },
    { table: 'blood_inventory', name: 'idx_blood_inventory_bank', cols: '(blood_bank_id)' },
    { table: 'lab_tests', name: 'idx_lab_tests_lab_id', cols: '(lab_id)' },
    { table: 'ambulances', name: 'idx_ambulances_status', cols: '(status)' },
  ];

  for (const idx of indexes) {
    try {
      await conn.query(`CREATE INDEX ${idx.name} ON ${idx.table} ${idx.cols};`);
      console.log(`+ Created index ${idx.name} on ${idx.table}`);
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log(`= Index ${idx.name} already exists on ${idx.table}`);
      } else {
        console.warn(`! Failed to create index ${idx.name}:`, err.message);
      }
    }
  }

  await conn.end();
  console.log('Indexes check complete.');
}

applyIndexes().catch(console.error);
