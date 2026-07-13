'use client';

function timeAgo(value) {
  const then = new Date(value).getTime();
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(value).toLocaleDateString();
}

export default function Post({ post }) {
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
    </article>
  );
}
