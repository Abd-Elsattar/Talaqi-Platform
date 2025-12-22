// Item Models
// Defines data structures for lost and found items
import { LocationDto } from './location';

// Status enums for lost and found items
export enum LostItemStatus {
    Active = 'Active',
    Found = 'Found',
    Closed = 'Closed',
    Expired = 'Expired'
}

// Status enums for found items
export enum FoundItemStatus {
    Available = 'Available',
    Returned = 'Returned',
    Closed = 'Closed',
    Expired = 'Expired'
}

// Item categories
export type ItemCategory =
    | 'PersonalBelongings'
    | 'People'
    | 'Pets';

// Base item interface
interface BaseItem {
    id: string;
    userId: string;
    userName: string;
    category: ItemCategory;
    title: string;
    description: string;
    imageUrl?: string;
    location: LocationDto;
    contactInfo: string;
    createdAt: string;
}

// Lost Item Data Transfer Object
export interface LostItemDto extends BaseItem {
    userProfilePicture?: string;
    dateLost: string;
    status: LostItemStatus;
    matchCount: number;
}

// Create Lost Item Data Transfer Object
export interface CreateLostItemDto {
    category: ItemCategory;
    title: string;
    description: string;
    imageUrl?: string;
    location: LocationDto;
    dateLost: string;
    contactInfo: string;
}

// Update Lost Item Data Transfer Object
export interface UpdateLostItemDto {
    category?: ItemCategory;
    title?: string;
    description?: string;
    imageUrl?: string;
    location?: LocationDto;
    dateLost?: string;
    contactInfo?: string;
    status?: LostItemStatus;
}

// Found Item Data Transfer Object
export interface FoundItemDto extends BaseItem {
    dateFound: string;
    status: FoundItemStatus;
}

// Create Found Item Data Transfer Object
export interface CreateFoundItemDto {
    category: ItemCategory;
    title: string;
    description: string;
    imageUrl?: string;
    location: LocationDto;
    dateFound: string;
    contactInfo: string;
}

// Update Found Item Data Transfer Object
export interface UpdateFoundItemDto {
    category?: ItemCategory;
    title?: string;
    description?: string;
    imageUrl?: string;
    location?: LocationDto;
    dateFound?: string;
    contactInfo?: string;
    status?: FoundItemStatus;
}
