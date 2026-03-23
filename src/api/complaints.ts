import client from './client';

export const getMyComplaints = async () => {
    const response = await client.get('/complaints');
    return response.data;
};

export const createComplaint = async (data: { type: string; description: string; location: string; imageUrl?: string; zoneId?: string }) => {
    const response = await client.post('/complaints', data);
    return response.data;
};

export const getComplaintStats = async () => {
    const response = await client.get('/complaints/stats');
    return response.data;
};

export const updateComplaint = async (id: string, data: any) => {
    const response = await client.put(`/complaints/${id}`, data);
    return response.data;
};
