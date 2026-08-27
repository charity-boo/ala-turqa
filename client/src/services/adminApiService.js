import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const withAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken(true);
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const parseJsonResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  
  if (!response.ok) {
    if (isJson) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.error || `Request failed (${response.status})`);
    }
    const text = await response.text().catch(() => '');
    throw new Error(`Server error (${response.status}): ${text.slice(0, 100) || 'Request failed'}`);
  }
  
  if (isJson) {
    return await response.json();
  }
  throw new Error('Invalid JSON response from server');
};

export const getAdminUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: 'GET',
    headers: await withAuthHeaders(),
  });
  return parseJsonResponse(response);
};

export const setAdminUserRole = async ({ uid, role }) => {
  const response = await fetch(`${API_BASE_URL}/admin/users/role`, {
    method: 'POST',
    headers: await withAuthHeaders(),
    body: JSON.stringify({ uid, role }),
  });
  return parseJsonResponse(response);
};
