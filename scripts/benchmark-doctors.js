// scripts/benchmark-doctors.js
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function benchmark() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // 1. Haversine distance search from Gomti Nagar (26.85, 80.99) within 15 km
  console.time('Haversine 15km query');
  const lat = 26.85;
  const lng = 80.99;
  const radius = 15;
  const [nearby] = await conn.execute(
    `SELECT d.id, u.name, d.specialization, d.rating, d.clinic_address,
      (6371 * acos(cos(radians(?)) * cos(radians(d.latitude)) * cos(radians(d.longitude) - radians(?)) + sin(radians(?)) * sin(radians(d.latitude)))) AS distance
     FROM doctors d
     JOIN users u ON d.user_id = u.id
     HAVING distance <= ?
     ORDER BY distance ASC
     LIMIT 20;`,
    [lat, lng, lat, radius]
  );
  console.timeEnd('Haversine 15km query');
  console.log(`Found ${nearby.length} nearby doctors. Closest:`, nearby[0]?.name, `(${Number(nearby[0]?.distance).toFixed(2)} km)`);

  // 2. Specialty + keyword filter
  console.time('Specialty filter (Dermatologist)');
  const [dermats] = await conn.execute(
    `SELECT d.id, u.name, d.specialization, d.rating, d.clinic_address
     FROM doctors d
     JOIN users u ON d.user_id = u.id
     WHERE d.specialization = 'Dermatologist' AND d.rating >= 4.5
     ORDER BY d.rating DESC
     LIMIT 10;`
  );
  console.timeEnd('Specialty filter (Dermatologist)');
  console.log(`Found ${dermats.length} top dermatologists. Top:`, dermats[0]?.name, `(Rating: ${dermats[0]?.rating})`);

  await conn.end();
}

benchmark().catch(console.error);
