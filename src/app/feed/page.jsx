import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { getFeedPosts } from '@/lib/posts';
import FeedClient from '@/components/FeedClient';

export default async function Feed() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { posts, nextCursor } = await getFeedPosts({ userId: user.id });

  return <FeedClient user={user} initialPosts={posts} initialCursor={nextCursor} />;
}
