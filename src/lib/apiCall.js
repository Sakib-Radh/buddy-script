import { request, upload } from '@/lib/network';

export function register(payload) {
  return request('POST', '/api/auth/register', payload);
}

export function login(payload) {
  return request('POST', '/api/auth/login', payload);
}

export function logout() {
  return request('POST', '/api/auth/logout');
}

export function createPost(formData) {
  return upload('/api/posts', formData);
}

export function getPosts(cursor) {
  const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
  return request('GET', `/api/posts${qs}`);
}

// target is { postId } or { commentId }
export function toggleLike(target) {
  return request('POST', '/api/likes', target);
}

export function getLikers(target) {
  const qs = new URLSearchParams(target).toString();
  return request('GET', `/api/likes?${qs}`);
}

export function getComments(postId) {
  return request('GET', `/api/comments?postId=${encodeURIComponent(postId)}`);
}

export function addComment({ postId, content, parentId }) {
  return request('POST', '/api/comments', { postId, content, parentId });
}
