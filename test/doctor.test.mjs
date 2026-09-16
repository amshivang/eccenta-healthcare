import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { createToken } from '../src/lib/auth.ts';

test('Doctor API & Security Verification', async (t) => {
  const BASE_URL = 'http://localhost:3000';

  const patientToken = createToken({
    userId: 9999,
    email: 'test.patient@eccenta.health',
    role: 'PATIENT',
    permissions: [],
    name: 'Test Patient',
  });

  await t.test('GET /api/doctor/stats rejects unauthenticated requests with 401', async () => {
    const res = await fetch(`${BASE_URL}/api/doctor/stats`);
    assert.equal(res.status, 401);
  });

  await t.test('GET /api/doctor/stats rejects non-doctor (PATIENT) with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/doctor/stats`, {
      headers: {
        Cookie: `auth_token=${patientToken}`,
      },
    });
    assert.equal(res.status, 403);
  });

  await t.test('GET /api/doctor/appointments rejects unauthenticated requests with 401', async () => {
    const res = await fetch(`${BASE_URL}/api/doctor/appointments`);
    assert.equal(res.status, 401);
  });

  await t.test('GET /api/doctor/appointments rejects non-doctor (PATIENT) with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/doctor/appointments`, {
      headers: {
        Cookie: `auth_token=${patientToken}`,
      },
    });
    assert.equal(res.status, 403);
  });

  await t.test('PATCH /api/appointments/[id] rejects unauthenticated mutation with 401', async () => {
    const res = await fetch(`${BASE_URL}/api/appointments/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    });
    assert.equal(res.status, 401);
  });

  await t.test('PATCH /api/appointments/[id] prevents IDOR tampering by non-owner patient', async () => {
    const res = await fetch(`${BASE_URL}/api/appointments/1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `auth_token=${patientToken}`,
      },
      body: JSON.stringify({ status: 'completed' }),
    });
    // Should be either 403 (Forbidden if appointment exists) or 404 (Not found)
    assert.ok(res.status === 403 || res.status === 404, `Status was ${res.status}, expected 403 or 404`);
  });
});
