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
