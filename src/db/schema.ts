import {
  mysqlTable,
  varchar,
  text,
  int,
  boolean,
  timestamp,
  date,
  time,
  decimal,
  mysqlEnum,
  index,
} from "drizzle-orm/mysql-core";

// Roles
export const roles = mysqlTable("roles", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
});

// Permissions
export const permissions = mysqlTable("permissions", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
});

// Role Permissions
export const rolePermissions = mysqlTable("role_permissions", {
  id: int("id").primaryKey().autoincrement(),
  roleId: int("role_id").notNull().references(() => roles.id),
  permissionId: int("permission_id").notNull().references(() => permissions.id),
});

// Users
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  roleId: int("role_id").notNull().references(() => roles.id),
  status: mysqlEnum("status", ["active", "pending", "suspended"]).default("active"),
  isVerified: boolean("is_verified").default(false),
  hospitalId: int("hospital_id"),
  phone: varchar("phone", { length: 20 }),
  avatar: text("avatar"),
  bloodGroup: varchar("blood_group", { length: 5 }),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  emergencyContact: varchar("emergency_contact", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Hospitals (defined before doctors for FK reference)
export const hospitals = mysqlTable("hospitals", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.0"),
  emergencyAvailable: boolean("emergency_available").default(true),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Doctors
export const doctors = mysqlTable("doctors", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id),
  specialization: varchar("specialization", { length: 100 }).notNull(),
  qualification: varchar("qualification", { length: 255 }).notNull(),
  experience: int("experience").notNull(),
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.0"),
  languages: text("languages"),
  onlineAvailable: boolean("online_available").default(true),
  offlineAvailable: boolean("offline_available").default(true),
  hospitalId: int("hospital_id").references(() => hospitals.id),
  clinicAddress: text("clinic_address"),
  clinicTimings: varchar("clinic_timings", { length: 100 }),
  bio: text("bio"),
  totalPatients: int("total_patients").default(0),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }).default("India"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  profileImage: text("profile_image"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  services: text("services"),
  phone: varchar("phone", { length: 20 }),
  totalReviews: int("total_reviews").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  specIdx: index("idx_doctors_specialization").on(table.specialization),
  cityIdx: index("idx_doctors_city").on(table.city),
  hospitalIdx: index("idx_doctors_hospital_id").on(table.hospitalId),
}));

// Doctor Reviews
export const doctorReviews = mysqlTable("doctor_reviews", {
  id: int("id").primaryKey().autoincrement(),
  doctorId: int("doctor_id").notNull().references(() => doctors.id),
  patientId: int("patient_id").notNull().references(() => users.id),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull(),
  reviewText: text("review_text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Favorite Doctors
export const favoriteDoctors = mysqlTable("favorite_doctors", {
  id: int("id").primaryKey().autoincrement(),
  patientId: int("patient_id").notNull().references(() => users.id),
  doctorId: int("doctor_id").notNull().references(() => doctors.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Hospital Beds
export const hospitalBeds = mysqlTable("hospital_beds", {
  id: int("id").primaryKey().autoincrement(),
  hospitalId: int("hospital_id").notNull().references(() => hospitals.id),
  bedType: mysqlEnum("bed_type", ["icu", "oxygen", "general", "pediatric", "emergency"]).notNull(),
  totalBeds: int("total_beds").notNull(),
  availableBeds: int("available_beds").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  hospBedIdx: index("idx_hospital_beds_hosp_type").on(table.hospitalId, table.bedType),
}));

// Appointments
export const appointments = mysqlTable("appointments", {
  id: int("id").primaryKey().autoincrement(),
  patientId: int("patient_id").notNull().references(() => users.id),
  doctorId: int("doctor_id").notNull().references(() => doctors.id),
  appointmentDate: date("appointment_date").notNull(),
  appointmentTime: time("appointment_time").notNull(),
  tokenNumber: int("token_number"),
  status: mysqlEnum("status", [
    "scheduled", "in_queue", "in_progress", "completed", "cancelled",
  ]).default("scheduled").notNull(),
  queuePosition: int("queue_position"),
  estimatedWaitMinutes: int("estimated_wait_minutes"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Pharmacies
export const pharmacies = mysqlTable("pharmacies", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  openTime: time("open_time"),
  closeTime: time("close_time"),
  isOpen: boolean("is_open").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Medicines
export const medicines = mysqlTable("medicines", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  genericName: varchar("generic_name", { length: 255 }),
  manufacturer: varchar("manufacturer", { length: 255 }),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Pharmacy Medicine Stock
export const pharmacyStock = mysqlTable("pharmacy_stock", {
  id: int("id").primaryKey().autoincrement(),
  pharmacyId: int("pharmacy_id").notNull().references(() => pharmacies.id),
  medicineId: int("medicine_id").notNull().references(() => medicines.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  pharmMedIdx: index("idx_pharmacy_stock_pharm_med").on(table.pharmacyId, table.medicineId),
}));

// Ambulances
export const ambulances = mysqlTable("ambulances", {
  id: int("id").primaryKey().autoincrement(),
  providerName: varchar("provider_name", { length: 255 }).notNull(),
  vehicleNumber: varchar("vehicle_number", { length: 20 }).notNull(),
  driverName: varchar("driver_name", { length: 255 }).notNull(),
  driverPhone: varchar("driver_phone", { length: 20 }).notNull(),
  ambulanceType: varchar("ambulance_type", { length: 100 }).notNull().default("Basic Life Support (BLS)"),
  baseFare: int("base_fare").notNull().default(500),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("4.5"),
  status: mysqlEnum("status", [
    "available", "dispatched", "en_route", "arrived", "returning",
  ]).default("available").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  hospitalId: int("hospital_id").references(() => hospitals.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Ambulance Requests
export const ambulanceRequests = mysqlTable("ambulance_requests", {
  id: int("id").primaryKey().autoincrement(),
  patientId: int("patient_id").notNull().references(() => users.id),
  ambulanceId: int("ambulance_id").references(() => ambulances.id),
  pickupAddress: text("pickup_address").notNull(),
  pickupLatitude: decimal("pickup_latitude", { precision: 10, scale: 7 }),
  pickupLongitude: decimal("pickup_longitude", { precision: 10, scale: 7 }),
  destinationHospitalId: int("destination_hospital_id").references(() => hospitals.id),
  status: mysqlEnum("status", [
    "Pending", "Accepted", "On The Way", "Arrived", "Patient Picked", "Completed", "Cancelled"
  ]).default("Pending").notNull(),
  requestTime: timestamp("request_time").defaultNow().notNull(),
  acceptedTime: timestamp("accepted_time"),
  arrivalTime: timestamp("arrival_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Laboratories
export const laboratories = mysqlTable("laboratories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  homeCollection: boolean("home_collection").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lab Tests
export const labTests = mysqlTable("lab_tests", {
  id: int("id").primaryKey().autoincrement(),
  labId: int("lab_id").notNull().references(() => laboratories.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  reportTime: varchar("report_time", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lab Bookings
export const labBookings = mysqlTable("lab_bookings", {
  id: int("id").primaryKey().autoincrement(),
  patientId: int("patient_id").notNull().references(() => users.id),
  labTestId: int("lab_test_id").notNull().references(() => labTests.id),
  bookingDate: date("booking_date").notNull(),
  homeCollection: boolean("home_collection").default(false),
  status: mysqlEnum("status", [
    "booked", "sample_collected", "processing", "completed", "cancelled",
  ]).default("booked").notNull(),
  reportUrl: text("report_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Health Records
export const healthRecords = mysqlTable("health_records", {
  id: int("id").primaryKey().autoincrement(),
  patientId: int("patient_id").notNull().references(() => users.id),
  recordType: varchar("record_type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  doctorName: varchar("doctor_name", { length: 255 }),
  hospitalName: varchar("hospital_name", { length: 255 }),
  recordDate: date("record_date").notNull(),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Medicine Reminders
export const medicineReminders = mysqlTable("medicine_reminders", {
  id: int("id").primaryKey().autoincrement(),
  patientId: int("patient_id").notNull().references(() => users.id),
  medicineName: varchar("medicine_name", { length: 255 }).notNull(),
  dosage: varchar("dosage", { length: 100 }).notNull(),
  frequency: varchar("frequency", { length: 50 }).notNull(),
  reminderTime: time("reminder_time").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blood Banks
export const bloodBanks = mysqlTable("blood_banks", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blood Inventory
export const bloodInventory = mysqlTable("blood_inventory", {
  id: int("id").primaryKey().autoincrement(),
  bloodBankId: int("blood_bank_id").notNull().references(() => bloodBanks.id),
  bloodGroup: varchar("blood_group", { length: 5 }).notNull(),
  unitsAvailable: int("units_available").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  bloodBankIdx: index("idx_blood_inventory_bank").on(table.bloodBankId),
}));

// Emergency SOS
export const emergencySos = mysqlTable("emergency_sos", {
  id: int("id").primaryKey().autoincrement(),
  patientId: int("patient_id").notNull().references(() => users.id),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  address: text("address"),
  isActive: boolean("is_active").default(true),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
