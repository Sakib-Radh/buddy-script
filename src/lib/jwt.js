import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'session';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secretKey);
  return payload;
}
