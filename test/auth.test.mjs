import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, createToken, verifyToken } from '../src/lib/auth.ts';

test('hashPassword and verifyPassword', async (t) => {
  await t.test('hashes a password and verifies correctly', async () => {
    const password = 'SuperSecretPassword123!';
    const hash = await hashPassword(password);

    assert.ok(hash, 'Hash should be non-empty');
    assert.notEqual(hash, password, 'Hash should not equal plaintext password');

    const isValid = await verifyPassword(password, hash);
    assert.equal(isValid, true, 'Valid password should verify successfully');
  });

  await t.test('rejects invalid password', async () => {
    const password = 'CorrectPassword123';
    const wrongPassword = 'WrongPassword456';
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(wrongPassword, hash);
    assert.equal(isValid, false, 'Wrong password should fail verification');
  });
});

test('createToken and verifyToken', async (t) => {
  const mockPayload = {
    userId: 42,
    email: 'test.patient@eccenta.health',
    role: 'PATIENT',
    permissions: ['view:records', 'book:appointments'],
    name: 'John Doe',
  };

  await t.test('creates and verifies a valid JWT token', () => {
    const token = createToken(mockPayload);
    assert.ok(token, 'Token should be generated');
    assert.equal(typeof token, 'string', 'Token should be a string');

    const decoded = verifyToken(token);
    assert.ok(decoded, 'Decoded token should not be null');
    assert.equal(decoded.userId, mockPayload.userId);
    assert.equal(decoded.email, mockPayload.email);
    assert.equal(decoded.role, mockPayload.role);
    assert.deepEqual(decoded.permissions, mockPayload.permissions);
    assert.equal(decoded.name, mockPayload.name);
  });

  await t.test('returns null for tampered token', () => {
    const token = createToken(mockPayload);
    const tampered = token.slice(0, -5) + 'abcde';

    const decoded = verifyToken(tampered);
    assert.equal(decoded, null, 'Tampered token should verify as null');
  });

  await t.test('returns null for malformed or empty token', () => {
    assert.equal(verifyToken(''), null);
    assert.equal(verifyToken('invalid.token.structure'), null);
  });
});
