import { User } from '../types';
import { api } from '../api/client';

export const registerWithEmail = async (
    email: string,
    password: string,
    name: string,
    userType: 'client' | 'manager',
    agencyName?: string
): Promise<User> => {
    return api.post('/auth/register', { email, password, name, userType, agencyName });
};

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
    return api.post('/auth/login', { email, password });
};

export const signInWithGoogle = async (userType: 'client' | 'manager'): Promise<User> => {
    throw new Error('Google Sign-In is disabled in this version.');
};

export const logoutUser = async (): Promise<void> => {
    // No-op for stateless JWT/Simple auth for now
    return;
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
    // Implement if API supports it
    console.warn('updateUserProfile not implemented in backend yet');
};

export const getUser = async (userId: string): Promise<User | null> => {
    // Could implement /users/:id endpoint
    return null;
};
