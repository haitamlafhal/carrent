import { create } from 'zustand';
import { User, Location, AgencyFilters } from '../types';
import { logoutUser } from '../services/authService';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    userType: 'client' | 'manager' | null;
    setUser: (user: User | null) => void;
    setUserType: (type: 'client' | 'manager') => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    userType: null,
    setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
    setUserType: (userType) => set({ userType }),
    logout: async () => {
        try {
            await logoutUser(); // Firebase signOut
        } catch (error) {
            console.error('Logout error:', error);
        }
        set({ user: null, isAuthenticated: false, userType: null });
    },
}));

interface LocationState {
    currentLocation: Location | null;
    locationPermission: 'granted' | 'denied' | 'undetermined';
    isLoading: boolean;
    setCurrentLocation: (location: Location | null) => void;
    setLocationPermission: (permission: 'granted' | 'denied' | 'undetermined') => void;
    setIsLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
    currentLocation: null,
    locationPermission: 'undetermined',
    isLoading: true,
    setCurrentLocation: (location) => set({ currentLocation: location }),
    setLocationPermission: (permission) => set({ locationPermission: permission }),
    setIsLoading: (loading) => set({ isLoading: loading }),
}));

interface FilterState {
    agencyFilters: AgencyFilters;
    setAgencyFilters: (filters: Partial<AgencyFilters>) => void;
    resetFilters: () => void;
}

const defaultFilters: AgencyFilters = {
    radius: 25,
    minRating: 0,
};

export const useFilterStore = create<FilterState>((set) => ({
    agencyFilters: defaultFilters,
    setAgencyFilters: (filters) =>
        set((state) => ({
            agencyFilters: { ...state.agencyFilters, ...filters },
        })),
    resetFilters: () => set({ agencyFilters: defaultFilters }),
}));

interface BookingState {
    selectedVehicle: string | null;
    selectedAgency: string | null;
    startDate: Date | null;
    endDate: Date | null;
    deliveryType: 'pickup' | 'delivery';
    deliveryAddress: string;
    setSelectedVehicle: (id: string | null) => void;
    setSelectedAgency: (id: string | null) => void;
    setDates: (start: Date, end: Date) => void;
    setDeliveryType: (type: 'pickup' | 'delivery') => void;
    setDeliveryAddress: (address: string) => void;
    resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    selectedVehicle: null,
    selectedAgency: null,
    startDate: null,
    endDate: null,
    deliveryType: 'pickup',
    deliveryAddress: '',
    setSelectedVehicle: (id) => set({ selectedVehicle: id }),
    setSelectedAgency: (id) => set({ selectedAgency: id }),
    setDates: (start, end) => set({ startDate: start, endDate: end }),
    setDeliveryType: (type) => set({ deliveryType: type }),
    setDeliveryAddress: (address) => set({ deliveryAddress: address }),
    resetBooking: () =>
        set({
            selectedVehicle: null,
            selectedAgency: null,
            startDate: null,
            endDate: null,
            deliveryType: 'pickup',
            deliveryAddress: '',
        }),
}));
