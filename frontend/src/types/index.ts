// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePhotoUrl?: string;
  licenseImageUrl?: string;
  licenseStatus: 'pending' | 'verified' | 'rejected';
  averageRating: number;
  totalRentals: number;
  createdAt: Date;
  userType: 'client' | 'manager';
  agencyName?: string;
}

// Agency Types
export interface Agency {
  id: string;
  name: string;
  logoUrl?: string;
  coverPhotoUrl?: string;
  address: Address;
  operatingHours: OperatingHours;
  contactPhone: string;
  contactEmail: string;
  deliveryAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  distance?: number; // Distance from user in km
  availableCarsCount?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

// Vehicle Types
export type VehicleCategory = 'economy' | 'compact' | 'suv' | 'luxury' | 'van' | 'sports';
export type TransmissionType = 'automatic' | 'manual';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';

export interface Vehicle {
  id: string;
  agencyId: string;
  make: string;
  model: string;
  year: number;
  category: VehicleCategory;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  doors: number;
  luggageCapacity: number;
  features: string[];
  images: string[];
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  isAvailable: boolean;
  deliveryAvailable: boolean;
  deliveryFee: number;
  averageRating: number;
  createdAt: Date;
}

// Booking Types
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
export type DeliveryType = 'pickup' | 'delivery';

export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  agencyId: string;
  startDate: Date;
  endDate: Date;
  deliveryType: DeliveryType;
  deliveryAddress?: Address;
  basePrice: number;
  deliveryFee: number;
  totalPrice: number;
  status: BookingStatus;
  handoverChecklist?: HandoverChecklist;
  returnChecklist?: ReturnChecklist;
  createdAt: Date;
  user?: User;
  vehicle?: Vehicle;
  agency?: Agency;
}

export interface HandoverChecklist {
  fuelLevel: number;
  mileage: number;
  photos: string[];
  damageNotes: string;
  clientSignature: string;
  checkedAt: Date;
}

export interface ReturnChecklist {
  fuelLevel: number;
  mileage: number;
  photos: string[];
  damageNotes: string;
  newDamages: boolean;
  cleanlinessIssues: boolean;
  lateReturn: boolean;
  additionalCharges: number;
  checkedAt: Date;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  agencyId: string;
  bookingId: string;
  overallRating: number;
  cleanlinessRating: number;
  conditionRating: number;
  staffRating: number;
  valueRating: number;
  comment?: string;
  photos: string[];
  isAnonymous: boolean;
  createdAt: Date;
  user?: User;
}

export interface UserRating {
  id: string;
  userId: string;
  agencyId: string;
  bookingId: string;
  overallRating: number;
  vehicleCareRating: number;
  punctualityRating: number;
  communicationRating: number;
  wouldRentAgain: boolean;
  reportedDamages: boolean;
  internalNotes?: string;
  createdAt: Date;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
}

// Filter Types
export interface AgencyFilters {
  radius: number; // in km
  minRating: number;
  carCategory?: VehicleCategory;
  deliveryAvailable?: boolean;
}

export interface VehicleFilters {
  category?: VehicleCategory;
  transmission?: TransmissionType;
  fuelType?: FuelType;
  minSeats?: number;
  maxDailyRate?: number;
}

// Notification Types
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'booking' | 'reminder' | 'rating' | 'promotional';
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}
