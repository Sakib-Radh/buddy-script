import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

const authorSelect = { select: { id: true, firstName: true, lastName: true } };

// Flatten a comment row (with its own like info) into the shape the UI uses.
function shapeComment(c) {
  return {
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    author: c.author,
    likeCount: c._count.likes,
    likedByMe: c.likes.length > 0,
    replies: (c.replies || []).map(shapeComment),
  };
}

function selectFor(userId, withReplies) {
  const base = {
    id: true,
    content: true,
    createdAt: true,
    author: authorSelect,
    _count: { select: { likes: true } },
    likes: { where: { userId }, select: { id: true }, take: 1 },
  };
  if (withReplies) {
    base.replies = { orderBy: { createdAt: 'asc' }, select: selectFor(userId, false) };
  }
  return base;
}

// Create a comment on a post, or a reply when parentId is given. Replies are
// kept one level deep: replying to a reply re-parents to its top-level comment.
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

  const postId = typeof body.postId === 'string' ? body.postId : null;
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  const parentId = typeof body.parentId === 'string' ? body.parentId : null;

  if (!postId) {
    return NextResponse.json({ error: 'A postId is required.' }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: 'Write something first.' }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    let effectiveParentId = null;
    if (parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, postId: true, parentId: true },
      });
      if (!parent || parent.postId !== postId) {
        return NextResponse.json({ error: 'Parent comment not found.' }, { status: 404 });
      }
      // If replying to a reply, attach to its top-level parent instead.
      effectiveParentId = parent.parentId ?? parent.id;
    }

    const comment = await prisma.comment.create({
      data: { postId, authorId: user.id, content, parentId: effectiveParentId },
      select: selectFor(user.id, true),
    });

    return NextResponse.json({ comment: shapeComment(comment) }, { status: 201 });
  } catch (err) {
    console.error('Comment create failed:', err);
    return NextResponse.json({ error: 'Could not add the comment.' }, { status: 500 });
  }
}

// List a post's comments (top level, oldest first) with their replies.
export async function GET(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  if (!postId) {
    return NextResponse.json({ error: 'A postId is required.' }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: 'asc' },
      select: selectFor(user.id, true),
    });
    return NextResponse.json({ comments: comments.map(shapeComment) });
  } catch (err) {
    console.error('Comment list failed:', err);
    return NextResponse.json({ error: 'Could not load comments.' }, { status: 500 });
  }
}
