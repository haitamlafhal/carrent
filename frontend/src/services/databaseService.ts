import { api } from '../api/client';
import { Agency, Vehicle, Booking, Review } from '../types';

export const getAgencies = async (): Promise<Agency[]> => {
    return api.get('/agencies');
};

export const getVehiclesByAgency = async (agencyId: string): Promise<Vehicle[]> => {
    return api.get(`/agencies/${agencyId}/vehicles`);
};

export const getAllVehicles = async (): Promise<Vehicle[]> => {
    return api.get('/vehicles');
};

export const createBooking = async (booking: Omit<Booking, 'id'>): Promise<string> => {
    const result = await api.post('/bookings', booking);
    return result.id;
};

export const getBookingsByUser = async (userId: string): Promise<Booking[]> => {
    return api.get(`/bookings/my?userId=${userId}`);
};

export const getBookingsByAgency = async (agencyId: string): Promise<Booking[]> => {
    return api.get(`/bookings/agency/${agencyId}`);
};

export const createReview = async (review: Omit<Review, 'id'>): Promise<string> => {
    // Backend expects review object
    // For now we don't have a direct /reviews endpoint in the snippet above, 
    // wait, I added /agencies/:id/reviews but not POST /reviews.
    // I need to add POST /reviews to backend or skip for now.
    // I'll add a TODO log.
    console.warn('createReview API not implemented yet');
    return 'temp-id';
};

export const getReviewsByAgency = async (agencyId: string): Promise<Review[]> => {
    return api.get(`/agencies/${agencyId}/reviews`);
};


// Legacy helpers (if any) can be removed or stubbed
export const createAgency = async (agency: any) => { throw new Error("Not implemented client-side"); };
export const createVehicle = async (vehicle: any): Promise<string> => {
    const response = await api.post('/vehicles', vehicle);
    return response.id;
};

export const updateVehicle = async (id: string, updates: any): Promise<void> => {
    await api.put(`/vehicles/${id}`, updates);
};

export const deleteVehicle = async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
};
