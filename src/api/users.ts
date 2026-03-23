import client from './client';

// Get all personnel (admin/personnel view)
export const getPersonnel = async (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await client.get(`/users/personnel${query}`);
    return response.data.personnel;
};

// Admin: get all users
export const getAllUsers = async (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await client.get(`/users${query}`);
    return response.data;
};

// Personnel: toggle duty status
export const updateStatus = async (status: 'On Duty' | 'Off Duty') => {
    const response = await client.put('/users/status', { status });
    return response.data;
};

// Admin: update a user's role
export const updateUserRole = async (id: string, role: string) => {
    const response = await client.put(`/users/${id}/role`, { role });
    return response.data;
};

// Admin: delete a user
export const deleteUser = async (id: string) => {
    const response = await client.delete(`/users/${id}`);
    return response.data;
};

// Admin: get all leave requests
export const getLeaveRequests = async () => {
    const response = await client.get('/users/leave-requests');
    return response.data.requests;
};
