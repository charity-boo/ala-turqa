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
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || 'Request failed');
  }
  return payload;
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
