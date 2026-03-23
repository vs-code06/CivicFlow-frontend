import client from './client';

// Get all tasks (admin/personnel) with filters
export const getTasks = async (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await client.get(`/tasks${query}`);
    return response.data;
};

// Get a single task by ID
export const getTaskById = async (id: string) => {
    const response = await client.get(`/tasks/${id}`);
    return response.data;
};

// Admin: get task stats
export const getTaskStats = async () => {
    const response = await client.get('/tasks/stats');
    return response.data;
};

// Resident: get active task in their zone (truck en route)
export const getResidentActiveTask = async () => {
    const response = await client.get('/tasks/my-zone-status');
    return response.data.task;
};

// Admin: create task
export const createTask = async (data: any) => {
    const response = await client.post('/tasks', data);
    return response.data;
};

// Admin/Personnel: update a task
export const updateTask = async (id: string, data: any) => {
    const response = await client.put(`/tasks/${id}`, data);
    return response.data;
};

// Personnel: accept a task assigned to them
export const acceptTask = async (id: string) => {
    const response = await client.post(`/tasks/${id}/accept`);
    return response.data;
};

// Personnel: start a task (begin route)
export const startTask = async (id: string) => {
    const response = await client.post(`/tasks/${id}/start`);
    return response.data;
};

// Personnel: complete a task
export const completeTask = async (id: string, data: { collectionStatus: string; notes?: string }) => {
    const response = await client.post(`/tasks/${id}/complete`, data);
    return response.data;
};

// Personnel: update task status (generic - used for issue reporting)
export const updateTaskStatus = async (id: string, status: string, extra?: any) => {
    const response = await client.put(`/tasks/${id}`, { status, ...extra });
    return response.data;
};

// Admin: delete task
export const deleteTask = async (id: string) => {
    const response = await client.delete(`/tasks/${id}`);
    return response.data;
};

// Personnel: get own tasks
export const getMyTasks = async (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await client.get(`/tasks${query}`);
    return response.data;
};
