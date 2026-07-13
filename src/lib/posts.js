import prisma from '@/lib/prisma';

export const PAGE_SIZE = 10;

export async function getFeedPosts({ userId, cursor, limit = PAGE_SIZE }) {
  const posts = await prisma.post.findMany({
    where: {
      OR: [{ visibility: 'PUBLIC' }, { authorId: userId }],
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      content: true,
      imageUrl: true,
      visibility: true,
      createdAt: true,
      author: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  let nextCursor = null;
  if (posts.length > limit) {
    posts.pop();
    nextCursor = posts[posts.length - 1].id;
  }

  return { posts, nextCursor };
}
