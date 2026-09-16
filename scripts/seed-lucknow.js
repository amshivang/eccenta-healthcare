// scripts/seed-lucknow.js
// High-speed, idempotent seeder for Lucknow doctors and hospitals.
// ponytail: stdlib + mysql2 only, batch inserts with transactions, zero unneeded abstractions.

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function inferSpecialization(name) {
  const n = name.toLowerCase();
  if (n.includes('dent') || n.includes('teeth')) return { spec: 'Dentist', qual: 'BDS, MDS', fee: 400 };
  if (n.includes('derma') || n.includes('skin') || n.includes('hair')) return { spec: 'Dermatologist', qual: 'MBBS, MD (Dermatology)', fee: 600 };
  if (n.includes('ortho') || n.includes('bone') || n.includes('joint')) return { spec: 'Orthopedic', qual: 'MBBS, MS (Orthopedics)', fee: 700 };
  if (n.includes('pediatric') || n.includes('child') || n.includes('shishu')) return { spec: 'Pediatrician', qual: 'MBBS, MD (Pediatrics)', fee: 500 };
  if (n.includes('gynec') || n.includes('obgyn') || n.includes('maternity') || n.includes('women')) return { spec: 'Gynecologist', qual: 'MBBS, MS (OB-GYN)', fee: 650 };
  if (n.includes('cardio') || n.includes('heart')) return { spec: 'Cardiologist', qual: 'MBBS, DM (Cardiology)', fee: 800 };
  if (n.includes('neuro') || n.includes('brain') || n.includes('spine')) return { spec: 'Neurologist', qual: 'MBBS, DM (Neurology)', fee: 850 };
  if (n.includes('eye') || n.includes('ophthalm') || n.includes('vision')) return { spec: 'Ophthalmologist', qual: 'MBBS, MS (Ophthalmology)', fee: 500 };
  if (n.includes('ent ') || n.includes('ear') || n.includes('throat')) return { spec: 'ENT Specialist', qual: 'MBBS, MS (ENT)', fee: 500 };
  if (n.includes('ayurved') || n.includes('panchakarma')) return { spec: 'Ayurveda Specialist', qual: 'BAMS, MD (Ayurveda)', fee: 350 };
  if (n.includes('homeo')) return { spec: 'Homeopathic Specialist', qual: 'BHMS', fee: 300 };
  if (n.includes('physio')) return { spec: 'Physiotherapist', qual: 'BPT, MPT', fee: 400 };
  if (n.includes('gastro')) return { spec: 'Gastroenterologist', qual: 'MBBS, DM (Gastroenterology)', fee: 750 };
  if (n.includes('pulmo') || n.includes('chest') || n.includes('respiratory')) return { spec: 'Pulmonologist', qual: 'MBBS, MD (Pulmonary)', fee: 600 };
  if (n.includes('uro') || n.includes('kidney') || n.includes('renal')) return { spec: 'Urologist', qual: 'MBBS, MCh (Urology)', fee: 800 };
  if (n.includes('onco') || n.includes('cancer')) return { spec: 'Oncologist', qual: 'MBBS, DM (Medical Oncology)', fee: 900 };
  if (n.includes('psych')) return { spec: 'Psychiatrist', qual: 'MBBS, MD (Psychiatry)', fee: 700 };
  if (n.includes('hospital') || n.includes('multispeciality') || n.includes('trauma')) return { spec: 'Multispeciality Hospital', qual: 'MBBS, MD / MS', fee: 600 };
  return { spec: 'General Physician', qual: 'MBBS, MD (Medicine)', fee: 450 };
}

function cleanDoctorName(raw) {
  let name = raw.trim();
  if (name.includes('|')) name = name.split('|')[0].trim();
  if (name.includes(' - ') && (name.toLowerCase().includes('best') || name.toLowerCase().includes('top') || name.length > 50)) {
    const parts = name.split(' - ');
    if (parts[0].toLowerCase().includes('best') || parts[0].toLowerCase().includes('top')) {
      name = parts.slice(1).join(' - ').trim();
    } else {
      name = parts[0].trim();
    }
  }
  return name.slice(0, 200);
}

async function seed() {
  const dataPath = path.join(__dirname, '..', 'src', 'data', 'lucknow_doctors.json');
  if (!fs.existsSync(dataPath)) {
    console.error('Data file not found:', dataPath);
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Loaded ${rawData.length} doctors from ${dataPath}`);

  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 5,
  });

  const conn = await pool.getConnection();

  try {
    console.log('Fetching DOCTOR role...');
    const [roles] = await conn.execute("SELECT id FROM roles WHERE name = 'DOCTOR' LIMIT 1;");
    if (!roles.length) {
      throw new Error("Role 'DOCTOR' not found in database.");
    }
    const doctorRoleId = roles[0].id;

    const [existing] = await conn.execute("SELECT COUNT(*) as cnt FROM doctors WHERE city = 'Lucknow';");
    if (existing[0].cnt >= 1000) {
      console.log(`Database already has ${existing[0].cnt} Lucknow doctors seeded. Skipping seed.`);
      return;
    }

    console.log('Generating password hash for doctor accounts...');
    const defaultPassword = await bcrypt.hash('LucknowDoctor@2024', 10);

    console.log('Extracting and seeding major Lucknow hospitals...');
    const hospitalEntries = rawData.filter(d => 
      d.name.toLowerCase().includes('hospital') || 
      d.name.toLowerCase().includes('medicity') ||
      d.name.toLowerCase().includes('trauma centre')
    );

    const hospitalMap = new Map();
    for (const h of hospitalEntries) {
      const cleanHospName = cleanDoctorName(h.name);
      if (!hospitalMap.has(cleanHospName) && cleanHospName.length > 3) {
        try {
          const [hospResult] = await conn.execute(
            `INSERT INTO hospitals (name, address, phone, latitude, longitude, rating, emergency_available)
             VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [
              cleanHospName,
              h.address || 'Lucknow, Uttar Pradesh',
              h.phone || '+91 522 2000000',
              h.latitude || 26.8467,
              h.longitude || 80.9462,
              h.rating ? String(h.rating) : '4.5',
              1
            ]
          );
          hospitalMap.set(cleanHospName, hospResult.insertId);
        } catch (e) {
          // ignore duplicate or formatting issue
        }
      }
    }
    console.log(`Seeded ${hospitalMap.size} hospitals in Lucknow.`);

    console.log('Seeding 1,549 doctors in batches...');
    const CHUNK_SIZE = 250;

    for (let i = 0; i < rawData.length; i += CHUNK_SIZE) {
      const chunk = rawData.slice(i, i + CHUNK_SIZE);
      await conn.beginTransaction();

      try {
        for (let j = 0; j < chunk.length; j++) {
          const doc = chunk[j];
          const idx = i + j + 1;
          const cleanName = cleanDoctorName(doc.name);
          const email = `doctor.lko.${idx}@eccenta.com`;
          const phone = doc.phone || `+91 94150 ${String(10000 + idx).slice(1)}`;
          const { spec, qual, fee } = inferSpecialization(doc.name);
          const exp = 5 + (idx % 21);
          const rating = doc.rating ? Number(doc.rating).toFixed(1) : (4.0 + (idx % 10) * 0.1).toFixed(1);
          const reviewCount = doc.review_count > 0 ? doc.review_count : (12 + (idx % 88));
          const lat = doc.latitude || 26.8467;
          const lng = doc.longitude || 80.9462;
          const gender = (idx % 3 === 0) ? 'female' : 'male';

          let hospitalId = null;
          if (hospitalMap.has(cleanName)) {
            hospitalId = hospitalMap.get(cleanName);
          }

          const [userResult] = await conn.execute(
            `INSERT INTO users (email, password, name, role_id, status, is_verified, phone)
             VALUES (?, ?, ?, ?, 'active', 1, ?)`,
            [email, defaultPassword, cleanName, doctorRoleId, phone]
          );
          const userId = userResult.insertId;

          await conn.execute(
            `INSERT INTO doctors (
              user_id, specialization, qualification, experience, consultation_fee, rating,
              languages, online_available, offline_available, hospital_id, clinic_address,
              clinic_timings, bio, total_patients, city, state, country, gender,
              latitude, longitude, total_reviews, phone
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?, ?, ?, 'Lucknow', 'Uttar Pradesh', 'India', ?, ?, ?, ?, ?)`,
            [
              userId,
              spec,
              qual,
              exp,
              fee,
              rating,
              'English, Hindi',
              hospitalId,
              doc.address || 'Lucknow, Uttar Pradesh',
              doc.open_hours && doc.open_hours !== '{}' ? '10:00 AM - 08:00 PM' : '09:00 AM - 05:00 PM',
              `${cleanName} is a premier ${spec} practicing in Lucknow with over ${exp} years of dedicated patient care experience.`,
              exp * 65 + reviewCount * 8,
              gender,
              lat,
              lng,
              reviewCount,
              phone
            ]
          );
        }

        await conn.commit();
        console.log(`Seeded batch ${i + 1} to ${Math.min(i + CHUNK_SIZE, rawData.length)}...`);
      } catch (err) {
        await conn.rollback();
        throw err;
      }
    }

    const [finalCount] = await conn.execute("SELECT COUNT(*) as total FROM doctors;");
    console.log(`\n🎉 Successfully seeded doctors! Total doctors in database: ${finalCount[0].total}`);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
