import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import FeedClient from '@/components/FeedClient';

export default async function Feed() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return <FeedClient user={user} />;
}
