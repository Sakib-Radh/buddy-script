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
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId }, select: { id: true }, take: 1 },
    },
  });

  let nextCursor = null;
  if (posts.length > limit) {
    posts.pop();
    nextCursor = posts[posts.length - 1].id;
  }

  // Flatten the like info into a shape the UI can consume directly.
  const shaped = posts.map(({ _count, likes, ...post }) => ({
    ...post,
    likeCount: _count.likes,
    commentCount: _count.comments,
    likedByMe: likes.length > 0,
  }));

  return { posts: shaped, nextCursor };
}
