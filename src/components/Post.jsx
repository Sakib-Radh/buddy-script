'use client';

import { useState } from 'react';
import { useLike } from '@/lib/useLike';
import { timeAgo } from '@/lib/time';
import Comments from '@/components/Comments';

export default function Post({ post }) {
  const like = useLike({ postId: post.id }, post.likedByMe, post.likeCount);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount ?? 0);

  return (
    <article className="_feed_inner_area _feed_inner_timeline_post_area _b_radious10 _padd_t24 _padd_b24 _padd_l24 _padd_r24">
      <div className="_feed_inner_timeline_post_top">
        <div className="_feed_inner_timeline_post_box">
          <div className="_feed_inner_timeline_post_box_image">
            <img src="/assets/images/mini_pic.png" alt="" className="_post_img" />
          </div>
          <div className="_feed_inner_timeline_post_box_content">
            <h4 className="_feed_inner_timeline_post_box_title">
              {post.author.firstName} {post.author.lastName}
            </h4>
            <p className="_feed_inner_timeline_post_box_para">
              {timeAgo(post.createdAt)} · {post.visibility === 'PRIVATE' ? 'Private' : 'Public'}
            </p>
          </div>
        </div>
      </div>

      {post.content && <p className="_feed_inner_timeline_post_title">{post.content}</p>}

      {post.imageUrl && (
        <div className="_feed_inner_timeline_image">
          <img
            src={post.imageUrl}
            alt=""
            className="_time_img"
            style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}

      {(like.count > 0 || commentCount > 0) && (
        <div className="_feed_inner_timeline_total_reacts _mar_b16">
          <div className="_feed_inner_timeline_total_reacts_txt">
            {like.count > 0 && (
              <button
                type="button"
                onClick={like.toggleLikers}
                className="_feed_inner_timeline_total_reacts_para1"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
              >
                <span>{like.count}</span> {like.count === 1 ? 'like' : 'likes'}
              </button>
            )}
          </div>
          {commentCount > 0 && (
            <div className="_feed_inner_timeline_total_reacts_para2">
              <span>{commentCount}</span> {commentCount === 1 ? 'comment' : 'comments'}
            </div>
          )}
        </div>
      )}

      {like.likersOpen && (
        <div
          className="_mar_b16"
          style={{
            background: '#F6F6F6',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            color: 'rgba(0,0,0,0.7)',
          }}
        >
          {like.likers === null
            ? 'Loading…'
            : like.likers.length === 0
              ? 'No likes yet.'
              : like.likers.map((u) => `${u.firstName} ${u.lastName}`).join(', ')}
        </div>
      )}

      <div className="_feed_inner_timeline_reaction _b_radious6">
        <div className={`_feed_reaction${like.liked ? ' _feed_reaction_active' : ''}`}>
          <button
            type="button"
            className="_feed_inner_timeline_reaction_link"
            onClick={like.toggle}
            disabled={like.busy}
            style={{ cursor: 'pointer', width: '100%', height: '100%' }}
          >
            {like.liked ? 'Liked' : 'Like'}
          </button>
        </div>
        <div className="_feed_reaction">
          <button
            type="button"
            className="_feed_inner_timeline_reaction_link"
            onClick={() => setCommentsOpen((o) => !o)}
            style={{ cursor: 'pointer', width: '100%', height: '100%' }}
          >
            Comment
          </button>
        </div>
      </div>

      {commentsOpen && (
        <Comments postId={post.id} onAdded={() => setCommentCount((c) => c + 1)} />
      )}
    </article>
  );
}
