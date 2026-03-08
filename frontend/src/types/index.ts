import { Timestamp } from 'firebase/firestore';

// ─── Enums / Union Types ───────────────────────────────────────────────────────

export type PetSpecies = 'dog' | 'cat';
export type PetSex = 'male' | 'female';
export type PetSize = 'small' | 'medium' | 'large';
export type FurLength = 'short' | 'medium' | 'long' | 'none';
export type PetStatus = 'available' | 'pending' | 'adopted';
export type AdoptionStatus = 'pending' | 'confirmed' | 'rejected';

// ─── Const arrays (úteis para iterar em formulários e filtros) ────────────────

export const SPECIES = ['dog', 'cat'] as const;
export const SEX = ['male', 'female'] as const;
export const SIZE = ['small', 'medium', 'large'] as const;
export const FUR_LEN = ['short', 'medium', 'long', 'none'] as const;
export const PET_STATUS = ['available', 'pending', 'adopted'] as const;
export const ADOPT_STATUS = ['pending', 'confirmed', 'rejected'] as const;

// ─── Labels em português para exibição na UI ──────────────────────────────────

export const SPECIES_LABEL: Record<PetSpecies, string> = {
  dog: 'Cão',
  cat: 'Gato',
};

export const SEX_LABEL: Record<PetSex, string> = {
  male: 'Macho',
  female: 'Fêmea',
};

export const SIZE_LABEL: Record<PetSize, string> = {
  small: 'Pequeno',
  medium: 'Médio',
  large: 'Grande',
};

export const FUR_LEN_LABEL: Record<FurLength, string> = {
  short: 'Curto',
  medium: 'Médio',
  long: 'Longo',
  none: 'Sem pelo',
};

export const PET_STATUS_LABEL: Record<PetStatus, string> = {
  available: 'Disponível',
  pending: 'Pendente',
  adopted: 'Adotado',
};

export const ADOPT_STATUS_LABEL: Record<AdoptionStatus, string> = {
  pending: 'Aguardando',
  confirmed: 'Confirmado',
  rejected: 'Recusado',
};

// ─── Interfaces: User ─────────────────────────────────────────────────────────

export interface UserAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;    // Sigla: "SP", "RJ", etc.
  zipCode: string;  // Apenas dígitos: "01310100"
}

export interface User {
  uid: string;
  fullName: string;
  email: string;
  cpf: string;      // Armazenado criptografado (AES-256)
  phone: string;    // Apenas dígitos: "11987654321"
  address: UserAddress;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Interfaces: Pet ──────────────────────────────────────────────────────────

export interface MeetingLocation {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  formattedAddress: string; // Ex: "Rua das Flores, 142, Vila Madalena, São Paulo, SP"
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  ageMonths: number;
  sex: PetSex;
  size: PetSize;
  furColor: string | null;
  furLength: FurLength;
  eyeColor: string;
  neutered: boolean;
  description: string;
  photoUrl: string;
  meetingLocation: MeetingLocation;
  status: PetStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Interfaces: Adoption ─────────────────────────────────────────────────────

export interface Adoption {
  id: string;
  petId: string;
  adopterId: string;
  donorId: string;
  status: AdoptionStatus;
  emailSent: boolean;
  requestedAt: Timestamp;
  resolvedAt: Timestamp | null;
}

// ─── Interfaces: Mail (Firebase Trigger Email) ────────────────────────────────

export interface MailDocument {
  to: string[];
  message: {
    subject: string;
    html: string;
  };
}

// ─── Tipos auxiliares para formulários ───────────────────────────────────────

/** Dados do formulário de cadastro de usuário (sem uid/timestamps) */
export type RegisterFormData = Omit<User, 'uid' | 'cpf' | 'createdAt' | 'updatedAt'> & {
  password: string;
  cpf: string; // CPF em texto puro — será criptografado antes de salvar
};

/** Dados do formulário de cadastro de pet (sem id/ownerId/photoUrl/status/timestamps) */
export type CreatePetData = Omit<Pet, 'id' | 'ownerId' | 'photoUrl' | 'status' | 'createdAt' | 'updatedAt'>;

/** Filtros disponíveis no catálogo (RF05) */
export interface PetFilters {
  species?: PetSpecies;
  sex?: PetSex;
  size?: PetSize;
  furColor?: string;
  furLength?: FurLength;
  eyeColor?: string;
  neutered?: boolean;
  city?: string;
  neighborhood?: string;
}

// ─── Utilitário: formata idade para exibição na UI ───────────────────────────

export function formatAge(ageMonths: number): string {
  if (ageMonths < 12) {
    return `${ageMonths} ${ageMonths === 1 ? 'mês' : 'meses'}`;
  }
  const years = Math.floor(ageMonths / 12);
  return `${years} ${years === 1 ? 'ano' : 'anos'}`;
}

// ─── Utilitário: monta formattedAddress ──────────────────────────────────────

export function buildFormattedAddress(loc: Omit<MeetingLocation, 'formattedAddress'>): string {
  const parts = [
    loc.street,
    loc.number,
    loc.complement,
    loc.neighborhood,
    loc.city,
    loc.state,
  ].filter(Boolean);
  return parts.join(', ');
}
