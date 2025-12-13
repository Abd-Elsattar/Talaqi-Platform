// Match Data Transfer Object
// Represents a match between a lost item and a found item
import { LostItemDto } from './item';
import { FoundItemDto } from './item';

// Match status enumeration
export enum MatchStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Rejected = 'Rejected',
    Resolved = 'Resolved'
}

// Match Data Transfer Object
export interface MatchDto {
    id: string;
    lostItemId: string;
    foundItemId: string;
    confidenceScore: number;
    status: string;
    createdAt: string;
    lostItem?: LostItemDto;
    foundItem?: FoundItemDto;
}

// Update Match Status Data Transfer Object
export interface UpdateMatchStatusDto {
    status: string;
}

// Function to normalize match status strings
export function normalizeMatchStatus(status: string | MatchStatus): 'Pending' | 'Confirmed' | 'Rejected' | 'Resolved' {
    const s = typeof status === 'string' ? status.toLowerCase() : String(status).toLowerCase();
    switch (s) {
        case 'pending':
            return 'Pending';
        case 'confirmed':
            return 'Confirmed';
        case 'rejected':
            return 'Rejected';
        case 'resolved':
        case 'completed':
            return 'Resolved';
        default:
            return 'Pending';
    }
}

// Admin Statistics Data Transfer Object
export interface AdminStatisticsDto {
    users: {
        total: number;
        active: number;
    };
    items: {
        lost: number;
        found: number;
    };
    matches: {
        total: number;
        pending: number;
    };
}
