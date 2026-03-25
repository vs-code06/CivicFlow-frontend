import client from './client';

export interface ZoneArea {
    _id?: string;
    name: string;
    type: string[];
    status: 'good' | 'attention' | 'critical';
    cleanlinessScore: number;
    issues: number;
    lastVisit: string;
    nextPickup: string;
    coordinates?: { lat: number; lng: number };
}

interface ZoneSchedule {
    day: string;
    types: ('trash' | 'recycle' | 'compost' | 'bulk')[];
    startTime: string;
    endTime: string;
}

interface ZoneAlert {
    type: 'info' | 'warning' | 'critical' | 'success';
    title: string;
    message: string;
    active: boolean;
    createdAt?: string;
}

export interface Zone {
    _id: string;
    name: string;
    manager: string;
    status: 'Good' | 'Attention' | 'Critical';
    healthScore: number;
    score: number; // Alias for healthScore
    tasks: number;
    issues: number; // Active issues count
    coverage: number;
    areas: ZoneArea[];
    schedule?: ZoneSchedule[];
    alerts?: ZoneAlert[];
    coordinates?: { lat: number; lng: number }; // Added Zone center
    // Efficiency Tracking
    currentMetrics?: {
        totalCollections: number;
        perfectCollections: number;
        contaminatedCollections: number;
        blockedCollections: number;
        missedCollections: number;
    };
    efficiencyHistory?: {
        date: string;
        score: number;
        metrics: any;
    }[];
    createdAt?: string;
    updatedAt?: string;
}

export const getZones = async (): Promise<Zone[]> => {
    const response = await client.get('/zones');
    return response.data.zones || response.data;
};

export const getMyZone = async (): Promise<Zone | null> => {
    const response = await client.get('/zones/my');
    return response.data.zone || null;
};

export const getZoneById = async (id: string): Promise<Zone> => {
    const response = await client.get(`/zones/${id}`);
    return response.data.zone || response.data;
};

export const createZone = async (data: Partial<Zone>): Promise<Zone> => {
    const response = await client.post('/zones', data);
    return response.data;
};

export const addAreaToZone = async (zoneId: string, data: Partial<ZoneArea>): Promise<Zone> => {
    const response = await client.post(`/zones/${zoneId}/areas`, data);
    return response.data;
};

export const updateZoneSchedule = async (zoneId: string, schedule: { day: string; types: string[]; startTime: string; endTime: string }[]): Promise<Zone> => {
    const response = await client.put(`/zones/${zoneId}/schedule`, { schedule });
    return response.data.zone || response.data;
};

export const getZoneScheduleStatus = async (zoneId: string): Promise<any> => {
    const response = await client.get(`/zones/${zoneId}/schedule-status`);
    return response.data;
};

export const dispatchToday = async (): Promise<any> => {
    const response = await client.post('/tasks/dispatch-today');
    return response.data;
};
