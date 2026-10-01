import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

/**
 * Passwords are never stored. What is kept is a salted scrypt hash, written as
 *   scrypt$<cost>$<salt>$<hash>
 * so the cost can be raised later without locking anyone out.
 */
const COST = 32768; // N: work factor
const BLOCK = 8;
const PARALLEL = 1;
const KEY_LENGTH = 64;

function derive(password: string, salt: Buffer, cost: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, { N: cost, r: BLOCK, p: PARALLEL, maxmem: 128 * 1024 * 1024 }, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await derive(password, salt, COST);
  return `scrypt$${COST}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, cost, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt' || !cost || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64');
  const given = await derive(password, Buffer.from(salt, 'base64'), Number(cost));
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Checked when the email is unknown, so a wrong email takes as long as a wrong password */
export const DUMMY_HASH = `scrypt$${COST}$${Buffer.alloc(16).toString('base64')}$${Buffer.alloc(KEY_LENGTH).toString('base64')}`;
