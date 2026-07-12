'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/apiCall';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/login');
    router.refresh();
  }

  return (
    <button type="button" className="_btn1" onClick={handleLogout}>
      Log out
    </button>
  );
}
