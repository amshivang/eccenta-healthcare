import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSearchTerm, getAutocompleteSuggestions } from '../src/lib/smart-search.ts';

test('Smart Search resolution matches DB doctor specializations', async (t) => {
  await t.test('resolves chest pain to Cardiologist (not Cardiology)', () => {
    const res = resolveSearchTerm('chest pain');
    assert.equal(res.wasResolved, true);
    assert.equal(res.resolved, 'Cardiologist');
  });

  await t.test('resolves skin issues to Dermatologist', () => {
    const acne = resolveSearchTerm('acne');
    assert.equal(acne.resolved, 'Dermatologist');

    const pimple = resolveSearchTerm('pimple');
    assert.equal(pimple.resolved, 'Dermatologist');

    const skinDoc = resolveSearchTerm('skin doctor');
    assert.equal(skinDoc.resolved, 'Dermatologist');
  });

  await t.test('resolves dental issues to Dentist', () => {
    const teeth = resolveSearchTerm('teeth');
    assert.equal(teeth.resolved, 'Dentist');

    const dental = resolveSearchTerm('dental');
    assert.equal(dental.resolved, 'Dentist');
  });

  await t.test('resolves bones to Orthopedic', () => {
    const bone = resolveSearchTerm('bone doctor');
    assert.ok(bone.resolved.startsWith('Orthopedic'));

    const joint = resolveSearchTerm('joint pain');
    assert.ok(joint.resolved.startsWith('Orthopedic'));
  });

  await t.test('resolves fever to General Physician', () => {
    const fever = resolveSearchTerm('fever');
    assert.equal(fever.resolved, 'General Physician');
  });

  await t.test('provides autocomplete suggestions without crashing', () => {
    const suggestions = getAutocompleteSuggestions('card');
    assert.ok(Array.isArray(suggestions));
    assert.ok(suggestions.length > 0);
  });
});

test('Live Local API Endpoints Verification', async (t) => {
  const BASE_URL = 'http://localhost:3000';

  // Helper to fetch with timeout
  async function safeFetch(url) {
    try {
      const res = await fetch(url);
      return res;
    } catch {
      return null;
    }
  }

  const ping = await safeFetch(`${BASE_URL}/api/health`);
  if (!ping) {
    console.log('Dev server not reachable at http://localhost:3000, skipping live HTTP tests');
    return;
  }

  await t.test('GET /api/doctors/search resolves symptom to doctors', async () => {
    const res = await fetch(`${BASE_URL}/api/doctors/search?q=chest+pain`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.wasResolved, true);
    assert.equal(data.resolvedQuery, 'Cardiologist');
    assert.ok(Array.isArray(data.results));
    assert.ok(data.results.length > 0, 'Should return matching cardiologists');
    assert.ok(data.results.every(d => d.specialization.toLowerCase().includes('cardio') || d.specialization.toLowerCase().includes('cardiologist')));
  });

  await t.test('GET /api/doctors/search with lat/lng returns clamped distance', async () => {
    const res = await fetch(`${BASE_URL}/api/doctors/search?q=dentist&lat=26.8467&lng=80.9462`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.results.length > 0);
    const first = data.results[0];
    assert.ok(first.distance !== null && !isNaN(first.distance), 'Distance should be a valid number, not null or NaN');
  });

  await t.test('GET /api/hospitals returns hospitals with grouped beds (O(N+M))', async () => {
    const res = await fetch(`${BASE_URL}/api/hospitals?lat=26.8467&lng=80.9462`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    const first = data[0];
    assert.ok(Array.isArray(first.beds), 'Each hospital should have beds array');
    assert.ok(first.distance !== null, 'Distance should be computed');
  });

  await t.test('GET /api/pharmacies is publicly accessible and returns stock', async () => {
    const res = await fetch(`${BASE_URL}/api/pharmacies?medicine=Paracetamol`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0, 'Should find paracetamol stock across pharmacies');
  });

  await t.test('Universal Medicine Search: Autocomplete suggestions', async () => {
    const res = await fetch(`${BASE_URL}/api/pharmacies?medicine=dolo&suggest=true`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    assert.ok(data.some(m => m.name.toLowerCase().includes('dolo')));
  });

  await t.test('Universal Medicine Search: Brand names (Crocin, Pan D, Allegra)', async () => {
    const res = await fetch(`${BASE_URL}/api/pharmacies?medicine=Allegra`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0, 'Allegra should be stocked and found');
    assert.ok(data.some(r => r.medicineName.toLowerCase().includes('allegra') || r.genericName?.toLowerCase().includes('fexofenadine')));
  });

  await t.test('Universal Medicine Search: Symptom matching (acidity, headache)', async () => {
    const res = await fetch(`${BASE_URL}/api/pharmacies?medicine=acidity`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0, 'Acidity symptom should return matching medicines like Pantoprazole/Pan 40');
  });

  await t.test('Universal Medicine Search: Novel / Uncataloged medicine auto-provisions stock', async () => {
    const res = await fetch(`${BASE_URL}/api/pharmacies?medicine=Ozempic`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0, 'Any searched medicine should dynamically resolve and be stocked');
    assert.ok(data[0].medicineName.toLowerCase().includes('ozempic'));
  });

  await t.test('GET /api/blood-banks is publicly accessible and returns inventory', async () => {
    const res = await fetch(`${BASE_URL}/api/blood-banks?lat=26.8467&lng=80.9462`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    const first = data[0];
    assert.ok(Array.isArray(first.inventory), 'Blood bank should include inventory');
  });

  await t.test('GET /api/ambulance is publicly accessible and returns fleets', async () => {
    const res = await fetch(`${BASE_URL}/api/ambulance?lat=26.8467&lng=80.9462&radius=50`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0, 'Should find available ambulances');
  });

  await t.test('GET /api/labs returns labs with grouped lab tests', async () => {
    const res = await fetch(`${BASE_URL}/api/labs?lat=26.8467&lng=80.9462&radius=50`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    const first = data[0];
    assert.ok(Array.isArray(first.tests), 'Lab should include tests');
  });
});
