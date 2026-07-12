import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken, SESSION_COOKIE } from '@/lib/jwt';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { userId } = await verifyToken(token);
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
  } catch {
    return null;
  }
}
