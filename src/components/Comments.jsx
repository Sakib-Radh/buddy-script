'use client';

import { useEffect, useState } from 'react';
import CommentItem from '@/components/CommentItem';
import { getComments, addComment } from '@/lib/apiCall';

export default function Comments({ postId, onAdded }) {
  const [comments, setComments] = useState(null); // null = loading
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getComments(postId)
      .then((res) => {
        if (active) setComments(res.comments);
      })
      .catch(() => {
        if (active) setComments([]);
      });
    return () => {
      active = false;
    };
  }, [postId]);

  async function submit(e) {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setBusy(true);
    setError('');
    try {
      const { comment } = await addComment({ postId, content });
      setComments((prev) => [...(prev || []), comment]);
      setText('');
      if (onAdded) onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ margin: '12px 0 0 0' }}>
      <form onSubmit={submit} style={{ display: 'flex', gap: '8px', margin: '0 0 14px 0' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="_feed_inner_comment_box"
          style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 14px', fontSize: '14px' }}
        />
        <button type="submit" className="_btn1" disabled={busy}>
          {busy ? '...' : 'Comment'}
        </button>
      </form>
      {error && <p style={{ color: '#e74c3c', fontSize: '12px' }}>{error}</p>}

      {comments === null ? (
        <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)' }}>Loading comments…</p>
      ) : comments.length === 0 ? (
        <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)' }}>No comments yet. Be the first.</p>
      ) : (
        comments.map((c) => (
          <CommentItem key={c.id} postId={postId} comment={c} onReplyAdded={onAdded} />
        ))
      )}
    </div>
  );
}
