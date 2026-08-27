import { auth } from "./firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = async () => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  const token = await auth.currentUser.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const handleApiResponse = async (response, defaultErrorMsg) => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    if (isJson) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || defaultErrorMsg);
    }
    throw new Error(`${defaultErrorMsg} (${response.status})`);
  }

  if (isJson) {
    return await response.json();
  }
  throw new Error("Invalid response format from server");
};

export const getStaffMembers = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/admin/staff`, { headers });
  return handleApiResponse(response, 'Failed to fetch staff members');
};

export const createStaffMember = async (staffData) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/admin/staff`, {
    method: 'POST',
    headers,
    body: JSON.stringify(staffData)
  });
  return handleApiResponse(response, 'Failed to create staff member');
};
