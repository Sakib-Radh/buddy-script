import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import LogoutButton from '@/components/LogoutButton';

export default async function Feed() {
  const user = await getCurrentUser();

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: 20 }}>
      <h1>Feed</h1>
      {user ? (
        <>
          <p>
            Logged in as <strong>{user.firstName} {user.lastName}</strong> ({user.email})
          </p>
          <LogoutButton />
        </>
      ) : (
        <p>
          You are not logged in. <Link href="/login">Go to login</Link>
        </p>
      )}
    </div>
  );
}
