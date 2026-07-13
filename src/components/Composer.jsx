'use client';

import { useRef, useState } from 'react';
import { createPost } from '@/lib/apiCall';

export default function Composer({ onCreated }) {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  function pickImage(e) {
    const file = e.target.files[0];
    setImage(file || null);
    setPreview(file ? URL.createObjectURL(file) : '');
  }

  function clearImage() {
    setImage(null);
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!content.trim() && !image) {
      setError('Write something or add an image.');
      return;
    }

    const form = new FormData();
    form.append('content', content);
    form.append('visibility', visibility);
    if (image) form.append('image', image);

    setLoading(true);
    try {
      const { post } = await createPost(form);
      onCreated(post);
      setContent('');
      setVisibility('PUBLIC');
      clearImage();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="_feed_inner_area _feed_inner_text_area _b_radious10 _padd_t24 _padd_b24 _padd_l24 _padd_r24">
      <form onSubmit={handleSubmit}>
        <div className="_feed_inner_text_area_box">
          <div className="_feed_inner_text_area_box_image _mar_r10">
            <img src="/assets/images/txt_img.png" alt="" className="_txt_img" />
          </div>
          <div className="_feed_inner_text_area_box_form">
            <textarea
              className="_textarea"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {preview && (
          <div className="_mar_t16" style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={preview}
              alt=""
              style={{ maxWidth: '100%', borderRadius: '6px', display: 'block' }}
            />
            <button
              type="button"
              onClick={clearImage}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <p className="_mar_t16" style={{ color: '#e74c3c', fontSize: '14px' }}>
            {error}
          </p>
        )}

        <div className="_feed_inner_text_area_bottom">
          <div className="_feed_inner_text_area_item" style={{ alignItems: 'center', gap: '20px' }}>
            <label
              className="_feed_inner_text_area_bottom_photo_link"
              style={{ cursor: 'pointer', margin: 0 }}
            >
              <input ref={fileRef} type="file" accept="image/*" onChange={pickImage} hidden />
              Photo
            </label>

            <select
              className="_feed_inner_text_area_bottom_photo_link"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>

          <button type="submit" className="_feed_inner_text_area_btn_link" disabled={loading}>
            <span>{loading ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
