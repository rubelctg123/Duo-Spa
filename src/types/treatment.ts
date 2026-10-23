export type CategoryType = 'all' | 'duo' | 'massage' | 'visage' | 'forfaits';

export type TreatmentFormat = 'duo' | 'solo';

export interface AddOnOption {
  id: string;
  name: string;
  description: string;
  price: number; // in CAD
  durationExtraMinutes: number;
}

export interface Treatment {
  id: string;
  name: string;
  category: 'duo' | 'massage' | 'visage' | 'forfaits';
  format: 'duo' | 'solo';
  durationMinutes: number;
  durationLabel: string;
  pricePerPerson: number; // Prix par personne en $ CAD
  totalPrice: number; // Prix total du soin (ex: 2x pour duo)
  badge?: string;
  popular?: boolean;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  includes: string[];
  restrictions?: string;
  image: string;
  availableAddons: AddOnOption[];
}

export interface BookingGuest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface BookingState {
  treatment: Treatment | null;
  selectedAddonIds: string[];
  date: string;
  timeSlot: string;
  therapistPreference: string;
  primaryGuest: BookingGuest;
  secondGuest: BookingGuest;
  acceptedPolicy: boolean;
  acceptedPrivacy: boolean;
  bookingCode?: string;
  calculatedTotal: number;
  depositDue: number;
  balanceDue: number;
}
