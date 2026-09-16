// scripts/verify-doctors.js
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function verify() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  const [dentists] = await conn.execute(
    "SELECT d.id, u.name, d.specialization, d.rating, d.city, d.consultation_fee FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.specialization = 'Dentist' LIMIT 3;"
  );
  console.log('Sample Dentists in Lucknow:', dentists);

  const [hospDocs] = await conn.execute(
    "SELECT d.id, u.name, h.name as hospitalName, d.city FROM doctors d JOIN users u ON d.user_id = u.id JOIN hospitals h ON d.hospital_id = h.id LIMIT 3;"
  );
  console.log('Sample Doctors affiliated with Hospitals:', hospDocs);

  const [topSpecialties] = await conn.execute(
    "SELECT specialization, COUNT(*) as count FROM doctors WHERE city = 'Lucknow' GROUP BY specialization ORDER BY count DESC LIMIT 5;"
  );
  console.log('Top Specialties in Lucknow:', topSpecialties);

  await conn.end();
}

verify().catch(console.error);
