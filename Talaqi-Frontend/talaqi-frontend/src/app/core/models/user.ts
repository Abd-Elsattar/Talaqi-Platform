// User Data Transfer Objects
export interface UserProfileDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePictureUrl?: string;
    createdAt: string;
    lostItemsCount: number;
    foundItemsCount: number;
}

// Update User Profile Data Transfer Object
export interface UpdateUserProfileDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

// Admin User Data Transfer Object
export interface AdminUserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePictureUrl?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

// Update User Status Data Transfer Object
export interface UpdateUserStatusDto {
    isActive: boolean;
}
