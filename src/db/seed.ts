import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";
import * as schema from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required to run seed script");
  }
  const pool = mysql.createPool({ uri: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("🌱 Seeding database...");

  // Clear existing data safely
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);
  await db.delete(schema.rolePermissions);
  await db.delete(schema.permissions);
  await db.delete(schema.roles);
  await db.delete(schema.favoriteDoctors);
  await db.delete(schema.doctorReviews);
  await db.delete(schema.emergencySos);
  await db.delete(schema.bloodInventory);
  await db.delete(schema.bloodBanks);
  await db.delete(schema.medicineReminders);
  await db.delete(schema.healthRecords);
  await db.delete(schema.labBookings);
  await db.delete(schema.labTests);
  await db.delete(schema.laboratories);
  await db.delete(schema.ambulanceRequests);
  await db.delete(schema.ambulances);
  await db.delete(schema.pharmacyStock);
  await db.delete(schema.medicines);
  await db.delete(schema.pharmacies);
  await db.delete(schema.appointments);
  await db.delete(schema.hospitalBeds);
  await db.delete(schema.doctors);
  await db.delete(schema.hospitals);
  await db.delete(schema.users);
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);

  const hashedPassword = await bcrypt.hash("password123", 12);

  // Helper to insert and get ID
  async function insertAndGetId(table: Parameters<typeof db.insert>[0], values: Record<string, unknown>) {
    const result = await db.insert(table).values(values as never);
    return (result as unknown as [{ insertId: number }])[0].insertId;
  }

  // Create Roles
  const rolesMap: Record<string, number> = {};
  const roleNames = [
    "SUPER_ADMIN", "ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "PATIENT",
    "LAB_STAFF", "PHARMACIST", "RECEPTIONIST", "AMBULANCE_DRIVER", "EMERGENCY_OPERATOR"
  ];
  for (const name of roleNames) {
    rolesMap[name] = await insertAndGetId(schema.roles, { name, description: `Role for ${name}` });
  }

  // Create Permissions
  const permMap: Record<string, number> = {};
  const permNames = [
    "VIEW_PATIENT", "EDIT_PATIENT", "DELETE_PATIENT", "CREATE_APPOINTMENT",
    "APPROVE_DOCTOR", "VIEW_REPORTS", "MANAGE_HOSPITAL", "VIEW_MEDICAL_RECORD",
    "CREATE_PRESCRIPTION", "UPLOAD_REPORT", "MANAGE_MEDICINE", "DISPATCH_AMBULANCE"
  ];
  for (const name of permNames) {
    permMap[name] = await insertAndGetId(schema.permissions, { name, description: `Permission to ${name}` });
  }

  // Map some basic permissions
  await db.insert(schema.rolePermissions).values([
    { roleId: rolesMap["PATIENT"], permissionId: permMap["VIEW_PATIENT"] },
    { roleId: rolesMap["PATIENT"], permissionId: permMap["CREATE_APPOINTMENT"] },
    { roleId: rolesMap["DOCTOR"], permissionId: permMap["VIEW_PATIENT"] },
    { roleId: rolesMap["DOCTOR"], permissionId: permMap["CREATE_PRESCRIPTION"] },
    { roleId: rolesMap["ADMIN"], permissionId: permMap["APPROVE_DOCTOR"] },
  ]);

  // Create users
  const userEmails = [
    { email: "patient@eccenta.com", name: "Arjun Sharma", roleId: rolesMap["PATIENT"], status: "active" as const, isVerified: true, phone: "+91 98765 43210", bloodGroup: "O+", dateOfBirth: new Date("1990-05-15"), address: "42 MG Road, Bangalore, Karnataka 560001", emergencyContact: "+91 98765 43211" },
    { email: "priya@eccenta.com", name: "Priya Patel", roleId: rolesMap["PATIENT"], status: "active" as const, isVerified: true, phone: "+91 87654 32109", bloodGroup: "A+", dateOfBirth: new Date("1985-11-22"), address: "15 Koramangala, Bangalore", emergencyContact: "+91 87654 32110" },
    { email: "dr.mehta@eccenta.com", name: "Dr. Rajesh Mehta", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 99887 76655" },
    { email: "dr.gupta@eccenta.com", name: "Dr. Sunita Gupta", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 99776 65544" },
    { email: "dr.khan@eccenta.com", name: "Dr. Faisal Khan", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 99665 54433" },
    { email: "dr.reddy@eccenta.com", name: "Dr. Lakshmi Reddy", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 99554 43322" },
    { email: "dr.nair@eccenta.com", name: "Dr. Anil Nair", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 99443 32211" },
    { email: "dr.joshi@eccenta.com", name: "Dr. Meera Joshi", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 99332 21100" },
    { email: "dr.sharma@eccenta.com", name: "Dr. Alok Sharma", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 99221 10099" },
    { email: "dr.verma@eccenta.com", name: "Dr. Ramesh Verma", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 99110 09988" },
    { email: "dr.iyer@eccenta.com", name: "Dr. V. Iyer", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 99009 98877" },
    { email: "dr.singh@eccenta.com", name: "Dr. Manjit Singh", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 98998 87766" },
    { email: "dr.das@eccenta.com", name: "Dr. Sujoy Das", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 98887 76655" },
    { email: "dr.rao@eccenta.com", name: "Dr. K. Rao", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 98776 65544" },
    { email: "dr.deshmukh@eccenta.com", name: "Dr. Anand Deshmukh", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 98665 54433" },
    { email: "dr.kapoor@eccenta.com", name: "Dr. Ritu Kapoor", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 98554 43322" },
    { email: "dr.bansal@eccenta.com", name: "Dr. Neha Bansal", roleId: rolesMap["DOCTOR"], status: "active" as const, isVerified: true, phone: "+91 98443 32211" },
    { email: "admin@eccenta.com", name: "Admin", roleId: rolesMap["ADMIN"], status: "active" as const, isVerified: true, phone: "+91 90000 00001" },
  ];

  const userIds: number[] = [];
  for (const u of userEmails) {
    const id = await insertAndGetId(schema.users, { ...u, password: hashedPassword });
    userIds.push(id);
  }
  const [patient1Id, patient2Id, doc1Id, doc2Id, doc3Id, doc4Id, doc5Id, doc6Id, doc7Id, doc8Id, doc9Id, doc10Id, doc11Id, doc12Id, doc13Id, doc14Id, doc15Id, adminId] = userIds;

  // Create hospitals
  const hospitalData = [
    { name: "Apollo Hospitals", address: "154/11, Bannerghatta Road, Bangalore 560076", phone: "+91 80 2630 4050", email: "info@apollobangalore.com", latitude: "12.8913", longitude: "77.5966", rating: "4.7", emergencyAvailable: true },
    { name: "Fortis Hospital", address: "14, Cunningham Road, Bangalore 560052", phone: "+91 80 6621 4444", email: "info@fortisbangalore.com", latitude: "12.9854", longitude: "77.5920", rating: "4.5", emergencyAvailable: true },
    { name: "Manipal Hospital", address: "98, HAL Airport Road, Bangalore 560017", phone: "+91 80 2502 4444", email: "info@manipalhospital.com", latitude: "12.9592", longitude: "77.6475", rating: "4.6", emergencyAvailable: true },
    { name: "Narayana Health City", address: "258/A, Bommasandra, Bangalore 560099", phone: "+91 80 7122 2222", email: "info@narayanahealth.org", latitude: "12.8120", longitude: "77.6870", rating: "4.8", emergencyAvailable: true },
  ];
  const hospitalIds: number[] = [];
  for (const h of hospitalData) {
    const id = await insertAndGetId(schema.hospitals, h);
    hospitalIds.push(id);
  }
  const [h1, h2, h3, h4] = hospitalIds;

  // Create Hospital Admin user
  const hospitalAdminId = await insertAndGetId(schema.users, {
    email: "hospital_admin@eccenta.com",
    name: "Hospital Admin",
    roleId: rolesMap["HOSPITAL_ADMIN"],
    status: "active" as const,
    isVerified: true,
    phone: "+91 90000 00002",
    password: hashedPassword,
    hospitalId: h1,
  });

  // Hospital beds
  const bedData = [
    { hospitalId: h1, bedType: "icu" as const, totalBeds: 50, availableBeds: 12 }, { hospitalId: h1, bedType: "oxygen" as const, totalBeds: 100, availableBeds: 34 },
    { hospitalId: h1, bedType: "general" as const, totalBeds: 300, availableBeds: 87 }, { hospitalId: h1, bedType: "pediatric" as const, totalBeds: 40, availableBeds: 15 },
    { hospitalId: h1, bedType: "emergency" as const, totalBeds: 30, availableBeds: 8 },
    { hospitalId: h2, bedType: "icu" as const, totalBeds: 35, availableBeds: 5 }, { hospitalId: h2, bedType: "oxygen" as const, totalBeds: 80, availableBeds: 22 },
    { hospitalId: h2, bedType: "general" as const, totalBeds: 250, availableBeds: 65 }, { hospitalId: h2, bedType: "pediatric" as const, totalBeds: 30, availableBeds: 11 },
    { hospitalId: h2, bedType: "emergency" as const, totalBeds: 20, availableBeds: 3 },
    { hospitalId: h3, bedType: "icu" as const, totalBeds: 40, availableBeds: 9 }, { hospitalId: h3, bedType: "oxygen" as const, totalBeds: 90, availableBeds: 28 },
    { hospitalId: h3, bedType: "general" as const, totalBeds: 280, availableBeds: 102 }, { hospitalId: h3, bedType: "pediatric" as const, totalBeds: 35, availableBeds: 18 },
    { hospitalId: h3, bedType: "emergency" as const, totalBeds: 25, availableBeds: 6 },
    { hospitalId: h4, bedType: "icu" as const, totalBeds: 60, availableBeds: 18 }, { hospitalId: h4, bedType: "oxygen" as const, totalBeds: 120, availableBeds: 45 },
    { hospitalId: h4, bedType: "general" as const, totalBeds: 400, availableBeds: 156 }, { hospitalId: h4, bedType: "pediatric" as const, totalBeds: 50, availableBeds: 22 },
    { hospitalId: h4, bedType: "emergency" as const, totalBeds: 35, availableBeds: 10 },
  ];
  for (const b of bedData) await db.insert(schema.hospitalBeds).values(b);

  // Doctors
  const doctorData = [
    { userId: doc1Id, specialization: "Cardiology", qualification: "MBBS, MD (Cardiology), DM", experience: 18, consultationFee: "1500.00", rating: "4.8", languages: "English, Hindi, Kannada", onlineAvailable: true, offlineAvailable: true, hospitalId: h1, clinicAddress: "Apollo Hospitals, Bannerghatta Road", clinicTimings: "Mon-Sat: 9:00 AM - 5:00 PM", bio: "Renowned cardiologist with 18+ years of experience.", totalPatients: 12500, city: "Bangalore", state: "Karnataka", country: "India", gender: "male" as const, latitude: "12.8913", longitude: "77.5966", profileImage: "https://i.pravatar.cc/150?u=dr1", registrationNumber: "MCI-12345", services: JSON.stringify(["ECG", "Echo", "Stress Test"]), phone: "+91 99887 76655", totalReviews: 45 },
    { userId: doc2Id, specialization: "Dermatology", qualification: "MBBS, MD (Dermatology)", experience: 12, consultationFee: "800.00", rating: "4.6", languages: "English, Hindi, Gujarati", onlineAvailable: true, offlineAvailable: true, hospitalId: h2, clinicAddress: "Fortis Hospital, Cunningham Road", clinicTimings: "Mon-Fri: 10:00 AM - 6:00 PM", bio: "Specializes in cosmetic dermatology and skin allergies.", totalPatients: 8200, city: "Delhi", state: "Delhi", country: "India", gender: "female" as const, latitude: "28.6139", longitude: "77.2090", profileImage: "https://i.pravatar.cc/150?u=dr2", registrationNumber: "MCI-54321", services: JSON.stringify(["Skin Biopsy", "Laser Treatment"]), phone: "+91 99776 65544", totalReviews: 32 },
    { userId: doc3Id, specialization: "Orthopedics", qualification: "MBBS, MS (Ortho), Fellowship", experience: 15, consultationFee: "1200.00", rating: "4.7", languages: "English, Hindi, Urdu", onlineAvailable: false, offlineAvailable: true, hospitalId: h3, clinicAddress: "Manipal Hospital, HAL Airport Road", clinicTimings: "Mon-Sat: 8:00 AM - 4:00 PM", bio: "Expert in joint replacement surgery and sports medicine.", totalPatients: 9800, city: "Mumbai", state: "Maharashtra", country: "India", gender: "male" as const, latitude: "19.0760", longitude: "72.8777", profileImage: "https://i.pravatar.cc/150?u=dr3", registrationNumber: "MCI-11223", services: JSON.stringify(["Joint Replacement", "Fracture Care"]), phone: "+91 99665 54433", totalReviews: 50 },
    { userId: doc4Id, specialization: "Gynecology", qualification: "MBBS, MD (OB-GYN), DNB", experience: 20, consultationFee: "1000.00", rating: "4.9", languages: "English, Hindi, Telugu", onlineAvailable: true, offlineAvailable: true, hospitalId: h4, clinicAddress: "Narayana Health City, Bommasandra", clinicTimings: "Mon-Sat: 9:00 AM - 3:00 PM", bio: "Leading gynecologist specializing in high-risk pregnancies.", totalPatients: 15000, city: "Lucknow", state: "Uttar Pradesh", country: "India", gender: "female" as const, latitude: "26.8467", longitude: "80.9462", profileImage: "https://i.pravatar.cc/150?u=dr4", registrationNumber: "MCI-99887", services: JSON.stringify(["Pregnancy Care", "Ultrasound"]), phone: "+91 99554 43322", totalReviews: 70 },
    { userId: doc5Id, specialization: "Pediatrics", qualification: "MBBS, MD (Pediatrics)", experience: 14, consultationFee: "900.00", rating: "4.7", languages: "English, Hindi, Malayalam", onlineAvailable: true, offlineAvailable: true, hospitalId: h1, clinicAddress: "Apollo Hospitals, Bannerghatta Road", clinicTimings: "Mon-Sat: 10:00 AM - 6:00 PM", bio: "Experienced pediatrician with expertise in neonatal care.", totalPatients: 11000, city: "Bangalore", state: "Karnataka", country: "India", gender: "male" as const, latitude: "12.8913", longitude: "77.5966", profileImage: "https://i.pravatar.cc/150?u=dr5", registrationNumber: "MCI-44556", services: JSON.stringify(["Vaccination", "Newborn Care"]), phone: "+91 99443 32211", totalReviews: 25 },
    { userId: doc6Id, specialization: "Neurology", qualification: "MBBS, MD (Neurology), DM", experience: 16, consultationFee: "1800.00", rating: "4.8", languages: "English, Hindi, Marathi", onlineAvailable: true, offlineAvailable: true, hospitalId: h2, clinicAddress: "Fortis Hospital, Cunningham Road", clinicTimings: "Tue-Sat: 9:00 AM - 4:00 PM", bio: "Leading neurologist in stroke management and epilepsy.", totalPatients: 7600, city: "Delhi", state: "Delhi", country: "India", gender: "female" as const, latitude: "28.6139", longitude: "77.2090", profileImage: "https://i.pravatar.cc/150?u=dr6", registrationNumber: "MCI-77665", services: JSON.stringify(["EEG", "Stroke Management"]), phone: "+91 99332 21100", totalReviews: 40 },
    { userId: doc7Id, specialization: "ENT", qualification: "MBBS, MS (ENT)", experience: 10, consultationFee: "800.00", rating: "4.5", languages: "English, Hindi", onlineAvailable: true, offlineAvailable: true, clinicAddress: "Sunrise Clinic, Andheri", clinicTimings: "Mon-Sat: 10:00 AM - 8:00 PM", bio: "ENT specialist with focus on hearing disorders.", totalPatients: 5000, city: "Mumbai", state: "Maharashtra", country: "India", gender: "male" as const, latitude: "19.1136", longitude: "72.8697", profileImage: "https://i.pravatar.cc/150?u=dr7", registrationNumber: "MCI-11111", services: JSON.stringify(["Audiometry", "Endoscopy"]), phone: "+91 99221 10099", totalReviews: 15 },
    { userId: doc8Id, specialization: "Psychiatry", qualification: "MBBS, MD (Psychiatry)", experience: 11, consultationFee: "1200.00", rating: "4.8", languages: "English, Hindi", onlineAvailable: true, offlineAvailable: true, clinicAddress: "Mind Care Clinic, Gomti Nagar", clinicTimings: "Mon-Fri: 11:00 AM - 7:00 PM", bio: "Compassionate psychiatrist focusing on anxiety and depression.", totalPatients: 4500, city: "Lucknow", state: "Uttar Pradesh", country: "India", gender: "male" as const, latitude: "26.8467", longitude: "80.9462", profileImage: "https://i.pravatar.cc/150?u=dr8", registrationNumber: "MCI-22222", services: JSON.stringify(["CBT", "Counseling"]), phone: "+91 99110 09988", totalReviews: 22 },
    { userId: doc9Id, specialization: "General Physician", qualification: "MBBS, MD (Internal Medicine)", experience: 25, consultationFee: "600.00", rating: "4.4", languages: "English, Hindi, Tamil", onlineAvailable: true, offlineAvailable: true, clinicAddress: "Health First Clinic, Jayanagar", clinicTimings: "Mon-Sat: 9:00 AM - 9:00 PM", bio: "Senior consultant for infectious diseases and general ailments.", totalPatients: 25000, city: "Bangalore", state: "Karnataka", country: "India", gender: "male" as const, latitude: "12.9299", longitude: "77.5826", profileImage: "https://i.pravatar.cc/150?u=dr9", registrationNumber: "MCI-33333", services: JSON.stringify(["General Consultation", "Fever Treatment"]), phone: "+91 99009 98877", totalReviews: 120 },
    { userId: doc10Id, specialization: "Ophthalmology", qualification: "MBBS, MS (Ophthalmology)", experience: 13, consultationFee: "900.00", rating: "4.7", languages: "English, Hindi, Punjabi", onlineAvailable: false, offlineAvailable: true, clinicAddress: "Vision Eye Center, Rajouri Garden", clinicTimings: "Mon-Sat: 10:00 AM - 6:00 PM", bio: "Expert in cataract surgery and LASIK.", totalPatients: 6700, city: "Delhi", state: "Delhi", country: "India", gender: "male" as const, latitude: "28.6139", longitude: "77.2090", profileImage: "https://i.pravatar.cc/150?u=dr10", registrationNumber: "MCI-44444", services: JSON.stringify(["LASIK", "Cataract Surgery"]), phone: "+91 98998 87766", totalReviews: 28 },
    { userId: doc11Id, specialization: "Oncology", qualification: "MBBS, MD, DM (Medical Oncology)", experience: 17, consultationFee: "2000.00", rating: "4.9", languages: "English, Bengali", onlineAvailable: true, offlineAvailable: true, clinicAddress: "Hope Cancer Institute, Bandra", clinicTimings: "Mon-Fri: 9:00 AM - 5:00 PM", bio: "Renowned oncologist with experience in targeted therapy.", totalPatients: 8900, city: "Mumbai", state: "Maharashtra", country: "India", gender: "male" as const, latitude: "19.0596", longitude: "72.8295", profileImage: "https://i.pravatar.cc/150?u=dr11", registrationNumber: "MCI-55555", services: JSON.stringify(["Chemotherapy", "Targeted Therapy"]), phone: "+91 98887 76655", totalReviews: 65 },
    { userId: doc12Id, specialization: "Physiotherapy", qualification: "BPT, MPT (Ortho)", experience: 8, consultationFee: "500.00", rating: "4.6", languages: "English, Hindi", onlineAvailable: true, offlineAvailable: true, clinicAddress: "Active Rehab, Hazratganj", clinicTimings: "Mon-Sat: 8:00 AM - 8:00 PM", bio: "Specialized in sports injuries and post-op rehab.", totalPatients: 3400, city: "Lucknow", state: "Uttar Pradesh", country: "India", gender: "female" as const, latitude: "26.8467", longitude: "80.9462", profileImage: "https://i.pravatar.cc/150?u=dr12", registrationNumber: "MCI-66666", services: JSON.stringify(["Manual Therapy", "Exercise Prescription"]), phone: "+91 98776 65544", totalReviews: 18 },
    { userId: doc13Id, specialization: "Dentistry", qualification: "BDS, MDS (Endodontics)", experience: 9, consultationFee: "400.00", rating: "4.5", languages: "English, Kannada", onlineAvailable: true, offlineAvailable: true, clinicAddress: "Smile Dental, HSR Layout", clinicTimings: "Mon-Sun: 10:00 AM - 8:00 PM", bio: "Root canal specialist.", totalPatients: 4100, city: "Bangalore", state: "Karnataka", country: "India", gender: "male" as const, latitude: "12.9121", longitude: "77.6446", profileImage: "https://i.pravatar.cc/150?u=dr13", registrationNumber: "MCI-77777", services: JSON.stringify(["Root Canal", "Teeth Whitening"]), phone: "+91 98665 54433", totalReviews: 30 },
    { userId: doc14Id, specialization: "Gastroenterology", qualification: "MBBS, MD, DM (Gastro)", experience: 21, consultationFee: "1600.00", rating: "4.8", languages: "English, Hindi, Punjabi", onlineAvailable: true, offlineAvailable: true, clinicAddress: "Gastro Clinic, Saket", clinicTimings: "Tue-Sat: 9:00 AM - 3:00 PM", bio: "Expert in liver diseases and endoscopy.", totalPatients: 14000, city: "Delhi", state: "Delhi", country: "India", gender: "female" as const, latitude: "28.5246", longitude: "77.2066", profileImage: "https://i.pravatar.cc/150?u=dr14", registrationNumber: "MCI-88888", services: JSON.stringify(["Endoscopy", "Colonoscopy"]), phone: "+91 98554 43322", totalReviews: 55 },
    { userId: doc15Id, specialization: "Pulmonology", qualification: "MBBS, MD (Pulmonary Medicine)", experience: 14, consultationFee: "1100.00", rating: "4.7", languages: "English, Marathi", onlineAvailable: true, offlineAvailable: true, clinicAddress: "Breathe Easy Clinic, Dadar", clinicTimings: "Mon-Sat: 10:00 AM - 5:00 PM", bio: "Specialist in asthma and sleep disorders.", totalPatients: 7200, city: "Mumbai", state: "Maharashtra", country: "India", gender: "female" as const, latitude: "19.0176", longitude: "72.8562", profileImage: "https://i.pravatar.cc/150?u=dr15", registrationNumber: "MCI-99999", services: JSON.stringify(["PFT", "Bronchoscopy"]), phone: "+91 98443 32211", totalReviews: 24 },
  ];
  const doctorIds: number[] = [];
  for (const d of doctorData) {
    const id = await insertAndGetId(schema.doctors, d);
    doctorIds.push(id);
  }

  // Pharmacies
  const pharmacyData = [
    { name: "MedPlus Pharmacy", address: "12, Indiranagar, Bangalore 560038", phone: "+91 80 4567 8901", openTime: "08:00", closeTime: "22:00", isOpen: true, rating: "4.3" },
    { name: "Apollo Pharmacy", address: "45, Koramangala 4th Block, Bangalore 560034", phone: "+91 80 5678 9012", openTime: "07:00", closeTime: "23:00", isOpen: true, rating: "4.5" },
    { name: "Netmeds Store", address: "78, Whitefield Main Road, Bangalore 560066", phone: "+91 80 6789 0123", openTime: "09:00", closeTime: "21:00", isOpen: true, rating: "4.1" },
  ];
  const pharmacyIds: number[] = [];
  for (const p of pharmacyData) {
    const id = await insertAndGetId(schema.pharmacies, p);
    pharmacyIds.push(id);
  }

  // Medicines
  const medicineData = [
    { name: "Paracetamol 500mg", genericName: "Acetaminophen", manufacturer: "Cipla", category: "Pain Relief", description: "Used for fever and mild to moderate pain" },
    { name: "Amoxicillin 250mg", genericName: "Amoxicillin", manufacturer: "Sun Pharma", category: "Antibiotic", description: "Broad-spectrum antibiotic" },
    { name: "Metformin 500mg", genericName: "Metformin HCl", manufacturer: "USV Ltd", category: "Diabetes", description: "Oral diabetes medicine" },
    { name: "Atorvastatin 10mg", genericName: "Atorvastatin Calcium", manufacturer: "Ranbaxy", category: "Cholesterol", description: "Lowers cholesterol" },
    { name: "Omeprazole 20mg", genericName: "Omeprazole", manufacturer: "Dr. Reddy's", category: "Gastric", description: "Proton pump inhibitor" },
    { name: "Cetirizine 10mg", genericName: "Cetirizine HCl", manufacturer: "Cipla", category: "Allergy", description: "Antihistamine for allergy relief" },
    { name: "Azithromycin 500mg", genericName: "Azithromycin", manufacturer: "Alkem", category: "Antibiotic", description: "Macrolide antibiotic" },
    { name: "Ibuprofen 400mg", genericName: "Ibuprofen", manufacturer: "Mankind Pharma", category: "Pain Relief", description: "NSAID for pain" },
    { name: "Amlodipine 5mg", genericName: "Amlodipine Besylate", manufacturer: "Torrent Pharma", category: "Blood Pressure", description: "Calcium channel blocker" },
    { name: "Losartan 50mg", genericName: "Losartan Potassium", manufacturer: "Macleods", category: "Blood Pressure", description: "ARB for hypertension" },
  ];
  const medicineIds: number[] = [];
  for (const m of medicineData) {
    const id = await insertAndGetId(schema.medicines, m);
    medicineIds.push(id);
  }

  // Pharmacy stock
  for (const pId of pharmacyIds) {
    for (const mId of medicineIds) {
      await db.insert(schema.pharmacyStock).values({ pharmacyId: pId, medicineId: mId, price: (Math.random() * 200 + 20).toFixed(2), quantity: Math.floor(Math.random() * 100) + 5 });
    }
  }

  // Ambulances
  await db.insert(schema.ambulances).values({ providerName: "Apollo Life Saver", ambulanceType: "Advanced Life Support (ALS)", baseFare: 750, rating: "4.8", vehicleNumber: "KA-01-AB-1234", driverName: "Ramesh Kumar", driverPhone: "+91 98765 11111", status: "available", hospitalId: h1, latitude: "12.9200", longitude: "77.6100" });
  await db.insert(schema.ambulances).values({ providerName: "City Ambulance Service", ambulanceType: "Basic Life Support (BLS)", baseFare: 500, rating: "4.2", vehicleNumber: "KA-01-CD-5678", driverName: "Suresh Yadav", driverPhone: "+91 98765 22222", status: "available", hospitalId: h2, latitude: "12.9700", longitude: "77.5800" });
  await db.insert(schema.ambulances).values({ providerName: "Fortis Emergency", ambulanceType: "ICU Ambulance", baseFare: 1200, rating: "4.9", vehicleNumber: "KA-01-EF-9012", driverName: "Mohammed Ali", driverPhone: "+91 98765 33333", status: "en_route", hospitalId: h3, latitude: "12.9500", longitude: "77.6300" });
  await db.insert(schema.ambulances).values({ providerName: "Manipal Rescue", ambulanceType: "Neonatal Ambulance", baseFare: 1500, rating: "4.7", vehicleNumber: "KA-01-GH-3456", driverName: "Vinay Shetty", driverPhone: "+91 98765 44444", status: "available", hospitalId: h4, latitude: "12.8500", longitude: "77.6700" });
  await db.insert(schema.ambulances).values({ providerName: "Lucknow Rapid Care", ambulanceType: "Advanced Life Support (ALS)", baseFare: 800, rating: "4.6", vehicleNumber: "UP-32-AB-9999", driverName: "Amit Singh", driverPhone: "+91 98765 55555", status: "available", hospitalId: h4, latitude: "26.8467", longitude: "80.9462" });
  await db.insert(schema.ambulances).values({ providerName: "Gomti Nagar Emergency", ambulanceType: "Basic Life Support (BLS)", baseFare: 400, rating: "4.1", vehicleNumber: "UP-32-XY-8888", driverName: "Prakash Verma", driverPhone: "+91 98765 66666", status: "available", hospitalId: h4, latitude: "26.8500", longitude: "80.9500" });

  // Laboratories
  const labData = [
    { name: "SRL Diagnostics", address: "22, MG Road, Bangalore 560001", phone: "+91 80 4444 5555", homeCollection: true, rating: "4.5", latitude: "12.9716", longitude: "77.5946" },
    { name: "Thyrocare Labs", address: "56, HSR Layout, Bangalore 560102", phone: "+91 80 5555 6666", homeCollection: true, rating: "4.3", latitude: "12.9121", longitude: "77.6446" },
    { name: "Metropolis Healthcare", address: "89, JP Nagar, Bangalore 560078", phone: "+91 80 6666 7777", homeCollection: false, rating: "4.6", latitude: "12.9063", longitude: "77.5857" },
    { name: "Dr. Lal PathLabs", address: "10, Hazratganj, Lucknow 226001", phone: "+91 522 1111 2222", homeCollection: true, rating: "4.8", latitude: "26.8467", longitude: "80.9462" },
    { name: "Thyrocare Lucknow", address: "Gomti Nagar, Lucknow", phone: "+91 522 3333 4444", homeCollection: true, rating: "4.4", latitude: "26.8500", longitude: "80.9500" },
  ];
  const labIds: number[] = [];
  for (const l of labData) { labIds.push(await insertAndGetId(schema.laboratories, l)); }

  // Lab tests
  const labTestData = [
    { labId: labIds[0], name: "Complete Blood Count (CBC)", description: "Measures blood components", price: "450.00", reportTime: "6 hours" },
    { labId: labIds[0], name: "Lipid Profile", description: "Cholesterol and triglycerides test", price: "800.00", reportTime: "12 hours" },
    { labId: labIds[0], name: "Thyroid Profile (T3, T4, TSH)", description: "Complete thyroid function test", price: "900.00", reportTime: "24 hours" },
    { labId: labIds[0], name: "HbA1c", description: "Average blood sugar over 3 months", price: "600.00", reportTime: "8 hours" },
    { labId: labIds[1], name: "Liver Function Test (LFT)", description: "Assess liver health", price: "700.00", reportTime: "12 hours" },
    { labId: labIds[1], name: "Kidney Function Test (KFT)", description: "Assess kidney health", price: "750.00", reportTime: "12 hours" },
    { labId: labIds[1], name: "Vitamin D Test", description: "Measures vitamin D levels", price: "1200.00", reportTime: "24 hours" },
    { labId: labIds[2], name: "COVID-19 RT-PCR", description: "COVID-19 detection test", price: "500.00", reportTime: "6 hours" },
    { labId: labIds[2], name: "Urine Routine Analysis", description: "Complete urine examination", price: "300.00", reportTime: "4 hours" },
    { labId: labIds[2], name: "ECG", description: "Electrocardiogram", price: "400.00", reportTime: "1 hour" },
    { labId: labIds[3], name: "Complete Blood Count (CBC)", description: "Measures blood components", price: "450.00", reportTime: "6 hours" },
    { labId: labIds[3], name: "Lipid Profile", description: "Cholesterol and triglycerides test", price: "800.00", reportTime: "12 hours" },
    { labId: labIds[4], name: "Thyroid Profile (T3, T4, TSH)", description: "Complete thyroid function test", price: "900.00", reportTime: "24 hours" },
  ];
  for (const t of labTestData) await db.insert(schema.labTests).values(t);

  // Blood banks
  const bbIds: number[] = [];
  bbIds.push(await insertAndGetId(schema.bloodBanks, { name: "Red Cross Blood Bank", address: "1, Race Course Road, Bangalore 560001", phone: "+91 80 2222 3333" }));
  bbIds.push(await insertAndGetId(schema.bloodBanks, { name: "Rotary Blood Bank", address: "34, Jayanagar 4th Block, Bangalore 560011", phone: "+91 80 3333 4444" }));

  // Blood inventory
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  for (const bbId of bbIds) {
    for (const bg of bloodGroups) {
      await db.insert(schema.bloodInventory).values({ bloodBankId: bbId, bloodGroup: bg, unitsAvailable: Math.floor(Math.random() * 30) + 2 });
    }
  }

  // Sample appointments
  await db.insert(schema.appointments).values({ patientId: patient1Id, doctorId: doctorIds[0], appointmentDate: gd(1), appointmentTime: "10:00:00", tokenNumber: 3, status: "scheduled", queuePosition: 3, estimatedWaitMinutes: 45, notes: "Regular checkup" });
  await db.insert(schema.appointments).values({ patientId: patient1Id, doctorId: doctorIds[1], appointmentDate: gd(3), appointmentTime: "14:00:00", tokenNumber: 5, status: "scheduled", queuePosition: 5, estimatedWaitMinutes: 75, notes: "Skin allergy consultation" });
  await db.insert(schema.appointments).values({ patientId: patient1Id, doctorId: doctorIds[4], appointmentDate: gd(-2), appointmentTime: "11:00:00", tokenNumber: 2, status: "completed", queuePosition: 0, estimatedWaitMinutes: 0, notes: "Child vaccination follow-up" });

  // Health records
  await db.insert(schema.healthRecords).values({ patientId: patient1Id, recordType: "Prescription", title: "General Checkup Prescription", description: "Prescribed Paracetamol 500mg and Cetirizine 10mg for seasonal cold", doctorName: "Dr. Rajesh Mehta", hospitalName: "Apollo Hospitals", recordDate: gd(-10) });
  await db.insert(schema.healthRecords).values({ patientId: patient1Id, recordType: "Lab Report", title: "Complete Blood Count Report", description: "CBC report - all values within normal range", doctorName: "Dr. Sunita Gupta", hospitalName: "Fortis Hospital", recordDate: gd(-30) });
  await db.insert(schema.healthRecords).values({ patientId: patient1Id, recordType: "Vaccination", title: "COVID-19 Booster Dose", description: "Covishield booster dose administered", doctorName: "Dr. Anil Nair", hospitalName: "Apollo Hospitals", recordDate: gd(-90) });
  await db.insert(schema.healthRecords).values({ patientId: patient1Id, recordType: "X-Ray", title: "Chest X-Ray", description: "Routine chest X-ray - no abnormalities detected", doctorName: "Dr. Faisal Khan", hospitalName: "Manipal Hospital", recordDate: gd(-60) });

  // Medicine reminders
  await db.insert(schema.medicineReminders).values({ patientId: patient1Id, medicineName: "Metformin 500mg", dosage: "1 tablet", frequency: "Twice daily", reminderTime: "08:00:00", startDate: gd(-30), endDate: gd(60), isActive: true });
  await db.insert(schema.medicineReminders).values({ patientId: patient1Id, medicineName: "Atorvastatin 10mg", dosage: "1 tablet", frequency: "Once daily (Night)", reminderTime: "21:00:00", startDate: gd(-15), endDate: gd(75), isActive: true });
  await db.insert(schema.medicineReminders).values({ patientId: patient1Id, medicineName: "Cetirizine 10mg", dosage: "1 tablet", frequency: "Once daily", reminderTime: "22:00:00", startDate: gd(-5), endDate: gd(5), isActive: true });

  // Doctor Reviews
  const reviews = [
    { doctorId: doctorIds[0], patientId: patient1Id, rating: "5.0", reviewText: "Very caring doctor. Explained everything clearly." },
    { doctorId: doctorIds[0], patientId: patient2Id, rating: "4.5", reviewText: "Excellent diagnosis, helped a lot." },
    { doctorId: doctorIds[1], patientId: patient1Id, rating: "4.0", reviewText: "Long wait time but good treatment." },
    { doctorId: doctorIds[1], patientId: patient2Id, rating: "5.0", reviewText: "Great experience. Skin improved in a week." },
    { doctorId: doctorIds[2], patientId: patient1Id, rating: "4.5", reviewText: "Very knowledgeable about joint issues." },
    { doctorId: doctorIds[3], patientId: patient2Id, rating: "5.0", reviewText: "Highly recommended for pregnancy care." },
    { doctorId: doctorIds[4], patientId: patient1Id, rating: "4.5", reviewText: "Great with kids, my child felt comfortable." },
    { doctorId: doctorIds[5], patientId: patient2Id, rating: "5.0", reviewText: "Cured my frequent headaches. Fantastic!" },
    { doctorId: doctorIds[6], patientId: patient1Id, rating: "4.0", reviewText: "Good doctor, but clinic was a bit crowded." },
    { doctorId: doctorIds[7], patientId: patient2Id, rating: "5.0", reviewText: "Extremely patient and understanding." },
    { doctorId: doctorIds[8], patientId: patient1Id, rating: "4.5", reviewText: "Accurate diagnosis for my fever." },
    { doctorId: doctorIds[9], patientId: patient2Id, rating: "4.0", reviewText: "Surgery went well, recovery was smooth." },
    { doctorId: doctorIds[10], patientId: patient1Id, rating: "5.0", reviewText: "Best oncologist. Provided great emotional support." },
    { doctorId: doctorIds[11], patientId: patient2Id, rating: "4.5", reviewText: "My back pain is completely gone after 5 sessions." },
    { doctorId: doctorIds[12], patientId: patient1Id, rating: "4.0", reviewText: "Painless root canal experience." },
    { doctorId: doctorIds[13], patientId: patient2Id, rating: "5.0", reviewText: "Solved my gastric issues quickly." },
    { doctorId: doctorIds[14], patientId: patient1Id, rating: "4.5", reviewText: "Breathing improved after the prescribed treatment." },
    { doctorId: doctorIds[0], patientId: patient2Id, rating: "4.8", reviewText: "Very detailed consultation, didn't rush." },
    { doctorId: doctorIds[1], patientId: patient1Id, rating: "4.2", reviewText: "Good results but medicines were expensive." },
    { doctorId: doctorIds[2], patientId: patient2Id, rating: "5.0", reviewText: "Helped me avoid surgery with right exercises." }
  ];
  for (const r of reviews) await db.insert(schema.doctorReviews).values(r);

  console.log("✅ Database seeded successfully!");
  await pool.end();
}

function gd(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

seed().catch(console.error);
