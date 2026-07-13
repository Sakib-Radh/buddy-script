import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { uploadImage } from '@/lib/upload';
import { getFeedPosts } from '@/lib/posts';

export async function GET(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor') || undefined;

  try {
    const { posts, nextCursor } = await getFeedPosts({ userId: user.id, cursor });
    return NextResponse.json({ posts, nextCursor });
  } catch (err) {
    console.error('Feed fetch failed:', err);
    return NextResponse.json({ error: 'Could not load the feed.' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const form = await request.formData();
  const content = (form.get('content') || '').toString().trim();
  const visibility = form.get('visibility') === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC';
  const image = form.get('image');

  if (!content && !(image && image.size > 0)) {
    return NextResponse.json(
      { error: 'Write something or add an image.' },
      { status: 400 }
    );
  }

  let imageUrl = null;
  if (image && image.size > 0) {
    if (!image.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 5MB.' }, { status: 400 });
    }
    try {
      imageUrl = await uploadImage(image);
    } catch (err) {
      console.error('Image upload failed:', err);
      return NextResponse.json(
        { error: 'Could not upload the image. Please try again.' },
        { status: 502 }
      );
    }
  }

  try {
    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        content,
        imageUrl,
        visibility,
      },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        visibility: true,
        createdAt: true,
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error('Post create failed:', err);
    return NextResponse.json({ error: 'Could not create the post.' }, { status: 500 });
  }
}
