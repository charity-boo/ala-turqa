import { auth } from "./firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = async () => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  const token = await auth.currentUser.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getStaffMembers = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/admin/staff`, { headers });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch staff members');
  }
  
  return await response.json();
};

export const createStaffMember = async (staffData) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/admin/staff`, {
    method: 'POST',
    headers,
    body: JSON.stringify(staffData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create staff member');
  }
  
  return await response.json();
};
