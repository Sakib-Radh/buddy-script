'use client';

import { useState } from 'react';
import Composer from '@/components/Composer';
import Post from '@/components/Post';
import LogoutButton from '@/components/LogoutButton';
import { getPosts } from '@/lib/apiCall';

export default function FeedClient({ user, initialPosts = [], initialCursor = null }) {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  function handleCreated(post) {
    setPosts((prev) => [post, ...prev]);
  }

  async function loadMore() {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    setError('');
    try {
      const { posts: more, nextCursor } = await getPosts(cursor);
      setPosts((prev) => [...prev, ...more]);
      setCursor(nextCursor);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <section className="_feed_wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-10 col-sm-12">
            <div className="_feed_inner_area _b_radious10 _padd_t16 _padd_b16 _padd_l24 _padd_r24">
              <div className="_feed_inner_timeline_post_top" style={{ margin: 0 }}>
                <img
                  src="/assets/images/logo.svg"
                  alt="Buddy Script"
                  style={{ maxWidth: '150px' }}
                />
                <div className="_feed_inner_timeline_post_box" style={{ cursor: 'default' }}>
                  <div className="_feed_inner_timeline_post_box_image">
                    <img src="/assets/images/mini_pic.png" alt="" className="_post_img" />
                  </div>
                  <h4
                    className="_feed_inner_timeline_post_box_title"
                    style={{ margin: '0 16px 0 0' }}
                  >
                    {user.firstName} {user.lastName}
                  </h4>
                  <LogoutButton />
                </div>
              </div>
            </div>

            <Composer onCreated={handleCreated} />

            {posts.length === 0 ? (
              <div
                className="_feed_inner_area _b_radious10 _padd_t24 _padd_b24 _padd_l24 _padd_r24"
                style={{ textAlign: 'center' }}
              >
                <p className="_feed_inner_timeline_post_box_para">
                  Your new posts will show up here.
                </p>
              </div>
            ) : (
              posts.map((post) => <Post key={post.id} post={post} />)
            )}

            {error && (
              <p style={{ color: '#e74c3c', fontSize: '14px', textAlign: 'center' }}>{error}</p>
            )}

            {cursor && (
              <div style={{ textAlign: 'center', margin: '8px 0 0 0' }}>
                <button
                  type="button"
                  className="_btn1"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
