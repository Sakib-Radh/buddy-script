'use client';

import { useState } from 'react';
import { useLike } from '@/lib/useLike';
import { addComment } from '@/lib/apiCall';
import { timeAgo } from '@/lib/time';

const linkBtn = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
  color: 'inherit',
  fontSize: '12px',
};

export default function CommentItem({ postId, comment, canReply = true, onReplyAdded }) {
  const like = useLike({ commentId: comment.id }, comment.likedByMe, comment.likeCount);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(comment.replies || []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submitReply(e) {
    e.preventDefault();
    const content = replyText.trim();
    if (!content) return;
    setBusy(true);
    setError('');
    try {
      const { comment: created } = await addComment({ postId, content, parentId: comment.id });
      setReplies((prev) => [...prev, created]);
      setReplyText('');
      setReplyOpen(false);
      if (onReplyAdded) onReplyAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'flex', gap: '10px', margin: '0 0 14px 0' }}>
      <img
        src="/assets/images/mini_pic.png"
        alt=""
        style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ background: '#F6F6F6', borderRadius: '14px', padding: '8px 14px' }}>
          <div style={{ fontWeight: 500, fontSize: '14px', color: '#000' }}>
            {comment.author.firstName} {comment.author.lastName}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.8)' }}>{comment.content}</div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            padding: '4px 14px',
            fontSize: '12px',
            color: 'rgba(0,0,0,0.5)',
          }}
        >
          <button
            type="button"
            onClick={like.toggle}
            disabled={like.busy}
            style={{
              ...linkBtn,
              fontWeight: like.liked ? 600 : 400,
              color: like.liked ? 'var(--color5)' : 'inherit',
            }}
          >
            {like.liked ? 'Liked' : 'Like'}
          </button>
          {like.count > 0 && (
            <button type="button" onClick={like.toggleLikers} style={linkBtn}>
              {like.count} {like.count === 1 ? 'like' : 'likes'}
            </button>
          )}
          {canReply && (
            <button type="button" onClick={() => setReplyOpen((o) => !o)} style={linkBtn}>
              Reply
            </button>
          )}
          <span>{timeAgo(comment.createdAt)}</span>
        </div>

        {like.likersOpen && (
          <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)', padding: '0 14px 6px' }}>
            {like.likers === null
              ? 'Loading…'
              : like.likers.length === 0
                ? 'No likes yet.'
                : like.likers.map((u) => `${u.firstName} ${u.lastName}`).join(', ')}
          </div>
        )}

        {replies.length > 0 && (
          <div style={{ margin: '8px 0 0 0' }}>
            {replies.map((r) => (
              <CommentItem key={r.id} postId={postId} comment={r} canReply={false} />
            ))}
          </div>
        )}

        {replyOpen && (
          <form onSubmit={submitReply} style={{ display: 'flex', gap: '8px', margin: '6px 0 0 0' }}>
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="_feed_inner_comment_box"
              style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 14px', fontSize: '14px' }}
            />
            <button type="submit" className="_btn1" disabled={busy}>
              {busy ? '...' : 'Reply'}
            </button>
          </form>
        )}
        {error && <p style={{ color: '#e74c3c', fontSize: '12px', padding: '0 14px' }}>{error}</p>}
      </div>
    </div>
  );
}
