'use client';

import { useState } from 'react';
import { toggleLike, getLikers } from '@/lib/apiCall';

// Shared like behaviour for any target ({ postId } or { commentId }): optimistic
// toggle with revert on error, plus an on-demand "who liked" list.
export function useLike(target, initialLiked, initialCount) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);
  const [likersOpen, setLikersOpen] = useState(false);
  const [likers, setLikers] = useState(null); // null = not loaded yet

  async function toggle() {
    if (busy) return;
    setBusy(true);

    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevCount + (prevLiked ? -1 : 1));

    try {
      const res = await toggleLike(target);
      setLiked(res.liked);
      setCount(res.likeCount);
      if (likersOpen) {
        const list = await getLikers(target);
        setLikers(list.users);
      }
    } catch {
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setBusy(false);
    }
  }

  async function toggleLikers() {
    if (likersOpen) {
      setLikersOpen(false);
      return;
    }
    setLikersOpen(true);
    if (likers === null) {
      try {
        const res = await getLikers(target);
        setLikers(res.users);
      } catch {
        setLikers([]);
      }
    }
  }

  return { liked, count, busy, toggle, likersOpen, likers, toggleLikers };
}
