import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

// A like targets exactly one of a post or a comment. Returns { postId } or
// { commentId }, or null if neither/both were provided.
function parseTarget(source) {
  const postId = typeof source.postId === 'string' ? source.postId : null;
  const commentId = typeof source.commentId === 'string' ? source.commentId : null;
  if (Boolean(postId) === Boolean(commentId)) return null; // need exactly one
  return postId ? { postId } : { commentId };
}

async function targetExists(target) {
  if (target.postId) {
    return prisma.post.findUnique({ where: { id: target.postId }, select: { id: true } });
  }
  return prisma.comment.findUnique({ where: { id: target.commentId }, select: { id: true } });
}

// Toggle a like on a post or comment for the current user, returning the new
// state and fresh count.
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const target = parseTarget(body);
  if (!target) {
    return NextResponse.json(
      { error: 'Provide exactly one of postId or commentId.' },
      { status: 400 }
    );
  }

  try {
    if (!(await targetExists(target))) {
      return NextResponse.json({ error: 'Target not found.' }, { status: 404 });
    }

    const existing = await prisma.like.findFirst({
      where: { userId: user.id, ...target },
      select: { id: true },
    });

    let liked;
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      liked = false;
    } else {
      await prisma.like.create({ data: { userId: user.id, ...target } });
      liked = true;
    }

    const likeCount = await prisma.like.count({ where: target });
    return NextResponse.json({ liked, likeCount });
  } catch (err) {
    console.error('Like toggle failed:', err);
    return NextResponse.json({ error: 'Could not update the like.' }, { status: 500 });
  }
}

// List who liked a given post or comment, newest first.
export async function GET(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const target = parseTarget({
    postId: searchParams.get('postId') || undefined,
    commentId: searchParams.get('commentId') || undefined,
  });
  if (!target) {
    return NextResponse.json(
      { error: 'Provide exactly one of postId or commentId.' },
      { status: 400 }
    );
  }

  try {
    const likes = await prisma.like.findMany({
      where: target,
      orderBy: { createdAt: 'desc' },
      select: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    return NextResponse.json({ users: likes.map((l) => l.user) });
  } catch (err) {
    console.error('Like list failed:', err);
    return NextResponse.json({ error: 'Could not load likes.' }, { status: 500 });
  }
}
