import client from './client';

export interface TrendData {
    _id: string;
    count: number;
    avgCompletionTime: number;
}

export interface CompositionData {
    _id: string;
    value: number;
}

export interface PerformanceData {
    _id: string;
    name: string;
    healthScore: number;
    status: string;
    completedTasks: number;
    reportedIssues: number;
    efficiency: number;
}

export interface OperationalMetrics {
    totalWasteItems: number;
    avgHealth: number;
    complaintResolution: number;
}

export const getCollectionTrends = async () => {
    const response = await client.get('/analytics/trends');
    return response.data.data;
};

export const getWasteComposition = async () => {
    const response = await client.get('/analytics/composition');
    return response.data.data;
};

export const getZonePerformance = async () => {
    const response = await client.get('/analytics/zone-performance');
    return response.data.data;
};

export const getOperationalMetrics = async () => {
    const response = await client.get('/analytics/metrics');
    return response.data.data;
};
