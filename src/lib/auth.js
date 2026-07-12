import bcrypt from 'bcryptjs';

export function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}

export function verifyPassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}
