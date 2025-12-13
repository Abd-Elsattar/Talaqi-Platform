# Talaqi Platform - Backend Technical Specification

**Version:** 1.0
**Date:** November 24, 2025
**Target Audience:** Frontend Development Team

---

## Table of Contents

1. [API Endpoints Documentation](#1-api-endpoints-documentation)
2. [DTOs Documentation](#2-dtos-documentation)
3. [Entities / Models Overview](#3-entities--models-overview)
4. [Matching System Explanation](#4-matching-system-explanation)
5. [AIService Analysis](#5-aiservice-analysis)
6. [Validation Rules](#6-validation-rules)
7. [User Flows / Use Cases](#7-user-flows--use-cases)
8. [Frontend Requirements](#8-frontend-requirements)

---

## 1. API Endpoints Documentation

All API endpoints follow REST conventions and return responses wrapped in a `Result<T>` object with the following structure:

```json
{
  "isSuccess": true,
  "data": { /* response data */ },
  "message": "Success message",
  "errors": []
}
```

### 1.1 Authentication Endpoints (`/api/auth`)

#### POST /api/auth/register
**Description:** Register a new user account
**Authentication:** Not required
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123",
  "confirmPassword": "password123"
}
```
**Response (Success - 200 OK):**
```json
{
  "isSuccess": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "...",
    "expiresAt": "2025-11-25T12:00:00Z",
    "user": {
      "id": "guid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "profilePictureUrl": null,
      "role": "User",
      "isEmailVerified": false,
      "isActive": true
    }
  },
  "message": "User registered successfully",
  "errors": []
}
```

#### POST /api/auth/login
**Description:** Authenticate user and receive tokens
**Authentication:** Not required
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (Success - 200 OK):** Same structure as register

**Response (Unauthorized - 401):**
```json
{
  "isSuccess": false,
  "data": null,
  "message": "Invalid email or password",
  "errors": []
}
```

#### POST /api/auth/send-email-confirmation
**Description:** Send email verification code
**Authentication:** Not required
**Request Body:**
```json
{
  "email": "john@example.com"
}
```
**Response (200 OK):**
```json
{
  "isSuccess": true,
  "message": "Verification code sent to email",
  "errors": []
}
```

#### POST /api/auth/confirm-email
**Description:** Verify email with confirmation code
**Authentication:** Not required
**Request Body:**
```json
{
  "email": "john@example.com",
  "code": "ABC123"
}
```
**Response (Success - 200 OK):** Standard Result structure

#### POST /api/auth/forgot-password
**Description:** Request password reset code
**Authentication:** Not required
**Request Body:**
```json
{
  "email": "john@example.com"
}
```
**Response (200 OK):** Standard Result structure

#### POST /api/auth/reset-password
**Description:** Reset password with verification code
**Authentication:** Not required
**Request Body:**
```json
{
  "email": "john@example.com",
  "code": "ABC123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```
**Response (Success - 200 OK):** Standard Result structure

#### POST /api/auth/refresh-token
**Description:** Refresh access token
**Authentication:** Required (using old refresh token)
**Request Body:**
```json
{
  "refreshToken": "..."
}
```
**Response (Success - 200 OK):** Same as login response

---

### 1.2 Lost Items Endpoints (`/api/lostitems`)

#### GET /api/lostitems
**Description:** Get paginated list of lost items
**Authentication:** Not required
**Query Parameters:**
- `pageNumber` (int, default: 1)
- `pageSize` (int, default: 10)
- `category` (string, optional)

**Response (200 OK):**
```json
{
  "isSuccess": true,
  "data": {
    "items": [
      {
        "id": "guid",
        "userId": "guid",
        "userName": "John Doe",
        "userProfilePicture": "http://...",
        "category": "PersonalBelongings",
        "title": "Lost Wallet",
        "description": "Black leather wallet",
        "imageUrl": "http://...",
        "location": {
          "address": "123 Main St",
          "latitude": 40.7128,
          "longitude": -74.0060,
          "city": "New York",
          "governorate": "NY"
        },
        "dateLost": "2025-11-20T10:00:00Z",
        "contactInfo": "john@example.com",
        "status": "Active",
        "createdAt": "2025-11-21T08:00:00Z",
        "matchCount": 3
      }
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalCount": 25,
    "totalPages": 3,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "message": null,
  "errors": []
}
```

#### GET /api/lostitems/{id}
**Description:** Get specific lost item by ID
**Authentication:** Not required
**Path Parameters:**
- `id` (guid): Lost item ID

**Response (Success - 200 OK):**
```json
{
  "isSuccess": true,
  "data": {
    /* Same structure as item in list */
  },
  "message": null,
  "errors": []
}
```

#### GET /api/lostitems/my-items
**Description:** Get current user's lost items
**Authentication:** Required
**Response (200 OK):** Returns list of lost items without pagination

#### GET /api/lostitems/feed
**Description:** Get feed of recent lost items
**Authentication:** Not required
**Query Parameters:**
- `count` (int, default: 20): Number of items to return

**Response (200 OK):**
```json
{
  "isSuccess": true,
  "data": [
    /* Array of lost items */
  ],
  "message": null,
  "errors": []
}
```

#### POST /api/lostitems
**Description:** Create a new lost item
**Authentication:** Required
**Request Body:**
```json
{
  "category": "PersonalBelongings",
  "title": "Lost Wallet",
  "description": "Black leather wallet with cards",
  "imageUrl": "http://example.com/image.jpg",
  "location": {
    "address": "123 Main St",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "city": "New York",
    "governorate": "NY"
  },
  "dateLost": "2025-11-20T10:00:00Z",
  "contactInfo": "john@example.com"
}
```
**Response (Created - 201):**
```json
{
  "isSuccess": true,
  "data": {
    /* LostItemDto with generated ID and timestamps */
  },
  "message": "Lost item created successfully",
  "errors": []
}
```

#### PUT /api/lostitems/{id}
**Description:** Update an existing lost item
**Authentication:** Required (must own the item)
**Path Parameters:**
- `id` (guid): Lost item ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "imageUrl": "http://new-image-url.jpg",
  "location": { /* LocationDto */ },
  "contactInfo": "newcontact@example.com",
  "status": "Active"
}
```
**Response (200 OK):** Standard Result structure

#### DELETE /api/lostitems/{id}
**Description:** Delete a lost item
**Authentication:** Required (must own the item)
**Path Parameters:**
- `id` (guid): Lost item ID

**Response (200 OK):** Standard Result structure with success message

---

### 1.3 Found Items Endpoints (`/api/founditems`)

#### GET /api/founditems/{id}
**Description:** Get specific found item by ID
**Authentication:** Not required
**Path Parameters:**
- `id` (guid): Found item ID

**Response (200 OK):**
```json
{
  "isSuccess": true,
  "data": {
    "id": "guid",
    "userId": "guid",
    "userName": "Jane Smith",
    "category": "PersonalBelongings",
    "title": "Found Wallet",
    "description": "Black leather wallet found near park",
    "imageUrl": "http://...",
    "location": {
      "address": "456 Park Ave",
      "latitude": 40.7580,
      "longitude": -73.9855,
      "city": "New York",
      "governorate": "NY"
    },
    "dateFound": "2025-11-21T14:00:00Z",
    "contactInfo": "jane@example.com",
    "status": "Active",
    "createdAt": "2025-11-21T15:00:00Z"
  },
  "message": null,
  "errors": []
}
```

#### GET /api/founditems/my-items
**Description:** Get current user's found items
**Authentication:** Required
**Response (200 OK):** Returns array of found items

#### POST /api/founditems
**Description:** Create a new found item
**Authentication:** Required
**Request Body:**
```json
{
  "category": "PersonalBelongings",
  "title": "Found Wallet",
  "description": "Black leather wallet",
  "imageUrl": "http://example.com/image.jpg",
  "location": {
    "address": "456 Park Ave",
    "latitude": 40.7580,
    "longitude": -73.9855,
    "city": "New York",
    "governorate": "NY"
  },
  "dateFound": "2025-11-21T14:00:00Z",
  "contactInfo": "jane@example.com"
}
```
**Response (Created - 201):** Returns FoundItemDto

#### PUT /api/founditems/{id}
**Description:** Update an existing found item
**Authentication:** Required (must own the item)
**Path Parameters:**
- `id` (guid): Found item ID

**Request Body:** Same as POST but all fields optional

#### DELETE /api/founditems/{id}
**Description:** Delete a found item
**Authentication:** Required (must own the item)
**Path Parameters:**
- `id` (guid): Found item ID

---

### 1.4 Matches Endpoints (`/api/matches`)

#### GET /api/matches/my-matches
**Description:** Get all matches for current user
**Authentication:** Required
**Response (200 OK):**
```json
{
  "isSuccess": true,
  "data": [
    {
      "id": "guid",
      "lostItemId": "guid",
      "foundItemId": "guid",
      "confidenceScore": 85.50,
      "status": "Pending",
      "createdAt": "2025-11-22T10:00:00Z",
      "lostItem": {
        /* LostItemDto */
      },
      "foundItem": {
        /* FoundItemDto */
      }
    }
  ],
  "message": null,
  "errors": []
}
```

#### GET /api/matches/{id}
**Description:** Get specific match by ID
**Authentication:** Required
**Path Parameters:**
- `id` (guid): Match ID

**Response (200 OK):**
```json
{
  "isSuccess": true,
  "data": {
    /* MatchDto with populated LostItem and FoundItem */
  },
  "message": null,
  "errors": []
}
```

#### PUT /api/matches/{id}/status
**Description:** Update match status
**Authentication:** Required (must be owner of lost item)
**Path Parameters:**
- `id` (guid): Match ID

**Request Body:**
```json
{
  "status": "Confirmed"  // Pending, Confirmed, Rejected, Resolved
}
```
**Response (200 OK):** Standard Result structure

---

### 1.5 User Profile Endpoints (`/api/users`)

#### GET /api/users/profile
**Description:** Get current user's profile
**Authentication:** Required
**Response (200 OK):**
```json
{
  "isSuccess": true,
  "data": {
    "id": "guid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "profilePictureUrl": "http://...",
    "createdAt": "2025-11-01T10:00:00Z",
    "lostItemsCount": 5,
    "foundItemsCount": 3
  },
  "message": null,
  "errors": []
}
```

#### PUT /api/users/profile
**Description:** Update user profile
**Authentication:** Required
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```
**Response (200 OK):** Standard Result structure

#### POST /api/users/profile-picture
**Description:** Upload profile picture
**Authentication:** Required
**Content-Type:** multipart/form-data
**Form Data:**
- `file`: Image file (JPG, PNG, GIF, max 5MB)

**Response (200 OK):**
```json
{
  "isSuccess": true,
  "data": {
    "imageUrl": "http://api.example.com/uploads/profile.jpg",
    "message": "Profile picture updated successfully"
  },
  "message": null,
  "errors": []
}
```

#### DELETE /api/users/account
**Description:** Delete user account
**Authentication:** Required
**Response (200 OK):** Standard Result structure with success message

---

### 1.6 File Upload Endpoints (`/api/upload`)

#### POST /api/upload/image
**Description:** Upload an image
**Authentication:** Required
**Content-Type:** multipart/form-data
**Form Data:**
- `file`: Image file (JPG, PNG, GIF, max 5MB)

**Response (200 OK):**
```json
{
  "isSuccess": true,
  "data": {
    "imageUrl": "http://api.example.com/uploads/uuid-filename.jpg"
  },
  "message": null,
  "errors": []
}
```

---

### 1.7 Admin Endpoints (`/api/admin`) - Admin Role Only

#### GET /api/admin/users
**Description:** Get paginated list of all users
**Authentication:** Required (Admin role)
**Query Parameters:**
- `pageNumber` (int, default: 1)
- `pageSize` (int, default: 20)

**Response (200 OK):**
```json
{
  "isSuccess": true,
  "data": {
    "items": [
      {
        "id": "guid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phoneNumber": "+1234567890",
        "role": "User",
        "isActive": true,
        "createdAt": "2025-11-01T10:00:00Z"
      }
    ],
    "pageNumber": 1,
    "pageSize": 20,
    "totalCount": 150,
    "totalPages": 8
  },
  "message": null,
  "errors": []
}
```

#### GET /api/admin/statistics
**Description:** Get platform statistics
**Authentication:** Required (Admin role)
**Response (200 OK):**
```json
{
  "isSuccess": true,
  "data": {
    "users": {
      "total": 1000,
      "active": 850
    },
    "items": {
      "lost": 500,
      "found": 480
    },
    "matches": {
      "total": 300,
      "pending": 50
    }
  },
  "message": null,
  "errors": []
}
```

#### GET /api/admin/items
**Description:** Get paginated list of all items
**Authentication:** Required (Admin role)
**Query Parameters:**
- `type` (string): "lost" or "found"
- `pageNumber` (int, default: 1)
- `pageSize` (int, default: 20)

#### PUT /api/admin/users/{id}/status
**Description:** Activate/deactivate user account
**Authentication:** Required (Admin role)
**Path Parameters:**
- `id` (guid): User ID

**Request Body:**
```json
{
  "isActive": false
}
```
**Response (200 OK):**
```json
{
  "isSuccess": true,
  "message": "User status updated successfully",
  "errors": []
}
```

---

## 2. DTOs Documentation

### 2.1 Authentication DTOs

#### RegisterDto
```json
{
  "firstName": "string (required, max 50 chars)",
  "lastName": "string (required, max 50 chars)",
  "email": "string (required, valid email format)",
  "phoneNumber": "string (required)",
  "password": "string (required, min 6, max 100 chars)",
  "confirmPassword": "string (required, must match password)"
}
```

#### LoginDto
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required)"
}
```

#### ConfirmEmailDto
```json
{
  "email": "string (required, valid email format)",
  "code": "string (required, exactly 6 characters)"
}
```

#### ForgotPasswordDto
```json
{
  "email": "string (required, valid email format)"
}
```

#### ResetPasswordDto
```json
{
  "email": "string (required, valid email format)",
  "code": "string (required)",
  "newPassword": "string (required, min 6, max 100 chars)",
  "confirmPassword": "string (required, must match newPassword)"
}
```

#### AuthResponseDto
```json
{
  "accessToken": "string (JWT token)",
  "refreshToken": "string",
  "expiresAt": "DateTime",
  "user": "UserDto"
}
```

#### UserDto
```json
{
  "id": "Guid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "profilePictureUrl": "string? (nullable)",
  "role": "string (User or Admin)",
  "isEmailVerified": "bool",
  "isActive": "bool"
}
```

---

### 2.2 Item DTOs

#### CreateLostItemDto
```json
{
  "category": "string (required) - PersonalBelongings, People, or Pets",
  "title": "string (required)",
  "description": "string (required)",
  "imageUrl": "string? (optional, URL to uploaded image)",
  "location": "LocationDto (required)",
  "dateLost": "DateTime (required)",
  "contactInfo": "string (required - email or phone)"
}
```

#### UpdateLostItemDto
```json
{
  "title": "string",
  "description": "string",
  "imageUrl": "string? (optional)",
  "location": "LocationDto",
  "contactInfo": "string",
  "status": "string - Active, Found, Closed, or Expired"
}
```

#### LostItemDto
```json
{
  "id": "Guid",
  "userId": "Guid",
  "userName": "string",
  "userProfilePicture": "string",
  "category": "string",
  "title": "string",
  "description": "string",
  "imageUrl": "string?",
  "location": "LocationDto",
  "dateLost": "DateTime",
  "contactInfo": "string",
  "status": "string",
  "createdAt": "DateTime",
  "matchCount": "int"
}
```

#### CreateFoundItemDto
```json
{
  "category": "string (required)",
  "title": "string (required)",
  "description": "string (required)",
  "imageUrl": "string? (optional)",
  "location": "LocationDto (required)",
  "dateFound": "DateTime (required)",
  "contactInfo": "string (required)"
}
```

#### UpdateFoundItemDto
```json
{
  "title": "string",
  "description": "string",
  "imageUrl": "string?",
  "location": "LocationDto",
  "contactInfo": "string",
  "status": "string"
}
```

#### FoundItemDto
```json
{
  "id": "Guid",
  "userId": "Guid",
  "userName": "string",
  "category": "string",
  "title": "string",
  "description": "string",
  "imageUrl": "string?",
  "location": "LocationDto",
  "dateFound": "DateTime",
  "contactInfo": "string",
  "status": "string",
  "createdAt": "DateTime"
}
```

#### MatchDto
```json
{
  "id": "Guid",
  "lostItemId": "Guid",
  "foundItemId": "Guid",
  "confidenceScore": "decimal (0-100)",
  "status": "string - Pending, Confirmed, Rejected, Resolved",
  "createdAt": "DateTime",
  "lostItem": "LostItemDto?",
  "foundItem": "FoundItemDto?"
}
```

#### LocationDto
```json
{
  "address": "string (required)",
  "latitude": "double? (optional, for GPS location)",
  "longitude": "double? (optional, for GPS location)",
  "city": "string? (optional)",
  "governorate": "string? (optional)"
}
```

---

### 2.3 User Profile DTOs

#### UserProfileDto
```json
{
  "id": "Guid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "profilePictureUrl": "string?",
  "createdAt": "DateTime",
  "lostItemsCount": "int",
  "foundItemsCount": "int"
}
```

#### UpdateUserProfileDto
```json
{
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string"
}
```

---

### 2.4 AI Analysis DTOs

#### AIAnalysisResult
```json
{
  "success": "bool",
  "error": "string?",
  "keywords": "string[]?",
  "imageFeatures": "string? (base64 encoded image URL)",
  "additionalData": "Dictionary<string, object>?",
  "tags": "string[]?",
  "description": "string?"
}
```

---

### 2.5 Statistics DTOs

#### DashboardStatisticsDto
```json
{
  "users": "UserStatistics",
  "items": "ItemStatistics",
  "matches": "MatchStatistics",
  "recentActivities": "RecentActivityDto[]"
}
```

#### UserStatistics
```json
{
  "total": "int",
  "active": "int",
  "registeredToday": "int",
  "registeredThisWeek": "int",
  "registeredThisMonth": "int"
}
```

#### ItemStatistics
```json
{
  "totalLost": "int",
  "totalFound": "int",
  "activeLost": "int",
  "activeFound": "int",
  "resolvedToday": "int",
  "byCategory": "Dictionary<string, int>"
}
```

#### MatchStatistics
```json
{
  "total": "int",
  "pending": "int",
  "confirmed": "int",
  "resolved": "int",
  "averageConfidenceScore": "decimal",
  "generatedToday": "int"
}
```

#### RecentActivityDto
```json
{
  "type": "string",
  "description": "string",
  "timestamp": "DateTime",
  "userName": "string?",
  "itemTitle": "string?"
}
```

---

## 3. Entities / Models Overview

### 3.1 Domain Entity Relationship Diagram

```
User (1) ----< (N) LostItem
User (1) ----< (N) FoundItem

LostItem (1) ----< (N) Match
FoundItem (1) ----< (N) Match
```

### 3.2 Entity Descriptions

#### BaseEntity
Base class for all entities with common fields:
- `Id` (Guid): Unique identifier
- `CreatedAt` (DateTime): Creation timestamp
- `UpdatedAt` (DateTime?): Last update timestamp
- `IsDeleted` (bool): Soft delete flag

#### User
Represents platform users
- `FirstName` (string, max 50)
- `LastName` (string, max 50)
- `Email` (string, unique)
- `PhoneNumber` (string)
- `PasswordHash` (string, hashed)
- `ProfilePictureUrl` (string?, optional)
- `Role` (string: "User" or "Admin", default "User")
- `IsEmailVerified` (bool, default false)
- `IsActive` (bool, default true)
- `RefreshToken` (string?, optional)
- `RefreshTokenExpiryTime` (DateTime)
- **Navigation Properties:**
  - `LostItems` (ICollection<LostItem>)
  - `FoundItems` (ICollection<FoundItem>)

#### ItemBase (Abstract)
Base class for LostItem and FoundItem
- `UserId` (Guid): Owner ID
- `Category` (ItemCategory enum)
- `Title` (string)
- `Description` (string)
- `ImageUrl` (string?, optional)
- `Location` (Location value object)
- `ContactInfo` (string)
- `AIAnalysisData` (string?, optional - JSON serialized AIAnalysisResult)
- `Status` (ItemStatus enum: Active, Found, Closed, Expired)

#### LostItem
Extends ItemBase, represents lost items
- `DateLost` (DateTime): When the item was lost
- **Navigation Properties:**
  - `User` (User): Owner
  - `Matches` (ICollection<Match>): Associated matches

#### FoundItem
Extends ItemBase, represents found items
- `DateFound` (DateTime): When the item was found
- **Navigation Properties:**
  - `User` (User): Owner
  - `Matches` (ICollection<Match>): Associated matches

#### Match
Represents a potential match between lost and found items
- `LostItemId` (Guid): Reference to LostItem
- `FoundItemId` (Guid): Reference to FoundItem
- `ConfidenceScore` (decimal 0-100): Match confidence percentage
- `Status` (MatchStatus enum: Pending, Confirmed, Rejected, Resolved)
- `NotificationSent` (bool, default false)
- `NotificationSentAt` (DateTime?, optional)
- `MatchDetails` (string?, optional - JSON details)
- **Navigation Properties:**
  - `LostItem` (LostItem): Associated lost item
  - `FoundItem` (FoundItem): Associated found item

#### VerificationCode
Temporary verification codes for email/password reset
- `Email` (string)
- `Code` (string, 6 characters)
- `ExpiresAt` (DateTime)
- `IsUsed` (bool, default false)
- `Purpose` (string: "PasswordReset" or "EmailVerification")

---

### 3.3 Enums

#### ItemCategory
- `PersonalBelongings` (1): Wallets, phones, keys, bags, etc.
- `People` (2): Missing persons reports
- `Pets` (3): Lost or found pets

#### ItemStatus
- `Active` (1): Item is active and searchable
- `Found` (2): Item has been resolved
- `Closed` (3): Item is closed by user
- `Expired` (4): Item is expired (auto-closed)

#### MatchStatus
- `Pending` (1): Newly created, awaiting user action
- `Confirmed` (2): Match confirmed by user
- `Rejected` (3): Match rejected by user
- `Resolved` (4): Match completed successfully

---

### 3.4 Value Objects

#### Location
Represents a geographic location
- `Address` (string): Full address
- `Latitude` (double?, optional): GPS latitude
- `Longitude` (double?, optional): GPS longitude
- `City` (string?, optional)
- `Governorate` (string?, optional)

---

## 4. Matching System Explanation

The Talaqi platform features an intelligent matching system that automatically finds potential matches between lost and found items using AI analysis and weighted scoring algorithms.

### 4.1 Overall Matching Flow

1. **Item Creation**: When a user creates a lost or found item, the system automatically:
   - Uploads and stores the image (if provided)
   - Triggers AI analysis on the item's image, description, and location
   - Stores the AI analysis results as JSON in the `AIAnalysisData` field

2. **Automatic Matching**: After item creation:
   - The system queries for items of the same category
   - Compares items using the scoring algorithm
   - Creates matches for items scoring above the threshold
   - Sends email notifications to affected users

3. **User Action**: Users can view matches and update their status:
   - Confirm: User confirms it's a valid match
   - Reject: User rejects the match
   - Resolve: User marks the match as successfully resolved

### 4.2 Match Scoring Algorithm

Each potential match receives a confidence score from 0-100 based on three factors:

#### MATCH_THRESHOLD = 60
Only matches scoring **60 or higher** are created as potential matches.

#### Scoring Components

##### 1. Keyword Scoring (Jaccard Similarity)
- **Purpose**: Measures text similarity between lost and found items
- **Method**: Compares AI-extracted keywords from descriptions and images
- **Formula**: `(Intersection / Union) × 100`
- **Weight**: Varies by category (see weights below)

**Example:**
```
Lost keywords: ["wallet", "black", "leather", "credit", "cards"]
Found keywords: ["wallet", "black", "leather", "id", "license"]
Intersection: ["wallet", "black", "leather"] = 3
Union: ["wallet", "black", "leather", "credit", "cards", "id", "license"] = 7
Score: (3/7) × 100 = 42.86
```

##### 2. Location Scoring (Haversine Distance)
- **Purpose**: Measures proximity between where item was lost and found
- **Method**: Calculates distance using GPS coordinates
- **Scoring Tiers**:
  - **≤ 0.2 km**: 100 points (same location)
  - **≤ 2 km**: 75 points (very close)
  - **≤ 10 km**: 40 points (same city)
  - **> 10 km**: 10 points (far away)

**Distance Calculation**: Uses Haversine formula with Earth radius of 6371 km

##### 3. Date Scoring
- **Purpose**: Measures temporal proximity between lost and found dates
- **Method**: Calculates days difference
- **Scoring Tiers**:
  - **≤ 1 day**: 100 points (same day)
  - **≤ 3 days**: 80 points (very recent)
  - **≤ 7 days**: 60 points (same week)
  - **≤ 30 days**: 30 points (same month)
  - **> 30 days**: 10 points (old)

### 4.3 Category-Based Weighting System

Different item categories emphasize different scoring factors:

#### People (Missing Persons)
```yaml
Keywords: 45%
Location: 35%
Date: 20%
```
*Rationale*: Personal descriptions are critical, location context matters, recent reports are prioritized

#### PersonalBelongings
```yaml
Keywords: 55%
Location: 30%
Date: 15%
```
*Rationale*: Item identification through description/image is most important, location helps narrow down

#### Pets
```yaml
Keywords: 50%
Location: 40%
Date: 10%
```
*Rationale*: Location is very important (pets don't travel far), physical descriptions matter, timing is flexible

### 4.4 Final Score Calculation

```
Final Score = (KeywordScore × KeywordWeight) +
              (LocationScore × LocationWeight) +
              (DateScore × DateWeight)

Score is clamped between 0-100
```

**Example Calculation (PersonalBelongings):**
```
KeywordScore: 43
LocationScore: 75
DateScore: 80

Weight: Keyword=0.55, Location=0.30, Date=0.15

Final Score = (43 × 0.55) + (75 × 0.30) + (80 × 0.15)
            = 23.65 + 22.50 + 12.00
            = 58.15

Result: Below threshold, NO match created
```

**Example Calculation (PersonalBelongings):**
```
KeywordScore: 70
LocationScore: 75
DateScore: 80

Final Score = (70 × 0.55) + (75 × 0.30) + (80 × 0.15)
            = 38.50 + 22.50 + 12.00
            = 73.00

Result: Above threshold, MATCH CREATED
```

### 4.5 Duplicate Prevention

Before creating a match, the system checks:
1. **Database Query**: Calls `GetMatchByItemsAsync(lostItemId, foundItemId)`
2. **Existence Check**: If match exists, it's skipped
3. **Duplicate Prevention**: Ensures only one match per lost/found item pair

### 4.6 Notification System

When a new match is created:
1. **Email Sent**: To the owner of the lost item
2. **Notification Flag**: `NotificationSent` set to true
3. **Timestamp**: `NotificationSentAt` records when notification was sent
4. **Email Content**: Includes lost item title and match details

**Note**: Notifications are only sent to lost item owners (not found item owners)

### 4.7 Match Status Lifecycle

1. **Pending** (Default)
   - Newly created matches start in this state
   - User needs to take action
   - Can be updated to Confirmed, Rejected, or Resolved

2. **Confirmed**
   - User confirms the match is valid
   - Proceeds toward resolution

3. **Rejected**
   - User rejects the match
   - No further action needed
   - Match remains in database for analytics

4. **Resolved**
   - Match has been successfully completed
   - Both items are considered resolved

---

## 5. AIService Analysis

The AIService uses OpenAI's GPT-4o-mini model to analyze images and text, extracting meaningful keywords and features that power the matching system.

### 5.1 Service Architecture

- **Interface**: `IAIService` (Application layer)
- **Implementation**: `AIService` (Infrastructure layer)
- **Model**: GPT-4o-mini (configurable via appsettings)
- **Caching**: 6-hour memory cache for results
- **Logging**: Full error logging for debugging

### 5.2 Configuration Requirements

The service requires the following in `appsettings.json`:
```json
{
  "OpenAI": {
    "ApiKey": "your-openai-api-key",
    "Model": "gpt-4o-mini"
  }
}
```

### 5.3 Analysis Methods

#### 5.3.1 AnalyzeImageAsync(imageUrl)
**Purpose**: Analyze an image and extract descriptive features
**Process**:
1. **Cache Check**: Looks for cached result at `img:{imageUrl}`
2. **OpenAI Request**: Sends image URL to GPT-4o-mini with prompt:
   ```
   System: Analyze the image and describe objects, colors, people, and features.
   User: Image URL: {imageUrl}
   ```
3. **Response Processing**:
   - Extracts description text
   - Runs keyword extraction on description
   - Creates base64-encoded image reference
   - Takes top 8 keywords as tags
4. **Caching**: Stores result for 6 hours
5. **Return**: `AIAnalysisResult` object

**Example Result**:
```json
{
  "success": true,
  "description": "A black leather wallet lying on a wooden table. The wallet appears to have several credit card slots visible.",
  "keywords": ["black", "leather", "wallet", "credit", "card", "table", "wooden"],
  "tags": ["black", "leather", "wallet", "credit", "card", "table", "wooden", "slots"],
  "imageFeatures": "aHR0cDovL2V4YW1wbGUuY29tL3NvbWVfaW1hZ2UuanBn", // base64 encoded URL
  "additionalData": {
    "description": "A black leather wallet..."
  }
}
```

#### 5.3.2 AnalyzeTextAsync(text)
**Purpose**: Extract keywords from text descriptions
**Process**:
1. **Cache Check**: Looks for cached result at `txt:{hash}`
2. **OpenAI Request**: Sends text to GPT-4o-mini with prompt:
   ```
   System: Extract important keywords.
   User: Extract keywords from: {text}
   ```
3. **Response Processing**:
   - Extracts keywords from AI response
   - Takes top 8 keywords as tags
4. **Caching**: Stores result for 6 hours
5. **Return**: `AIAnalysisResult` with keywords and tags

#### 5.3.3 AnalyzeLocationAsync(location)
**Purpose**: Normalize and prepare location data
**Process**:
1. **Normalization**: Converts location to lowercase, trims whitespace
2. **Cache Check**: Looks for cached result at `loc:{normalized}`
3. **Result Creation**: Creates normalized address data
4. **Caching**: Stores result for 6 hours
5. **Return**: `AIAnalysisResult` with normalized address

#### 5.3.4 AnalyzeLostItemAsync(imageUrl, description, location)
**Purpose**: Comprehensive analysis of a lost item
**Process**:
1. **Multiple Analyses**: Runs all three analysis methods in parallel
2. **Result Combination**: Merges all results into single `AIAnalysisResult`
3. **Combined Keywords**: Deduplicates keywords from all sources
4. **Combined Tags**: Takes top 10 distinct tags
5. **Return**: Unified analysis result

**Combination Logic**:
- `Success`: True if any analysis succeeded
- `Keywords`: All keywords combined and deduplicated
- `Tags`: Top 10 distinct tags
- `Description`: First non-empty description from image analysis
- `AdditionalData`: All additional data merged
- `ImageFeatures`: First non-empty image features

#### 5.3.5 AnalyzeFoundItemAsync(imageUrl, description, location)
**Purpose**: Same as AnalyzeLostItemAsync (alias method)
**Implementation**: Calls `AnalyzeLostItemAsync`

### 5.4 Keyword Extraction Algorithm

After AI generates description, keywords are extracted using:

**Stop Words Filtered**:
```
"the", "a", "an", "and", "or", "in", "for", "with",
"this", "that", "from", "you", "your", "was", "were", "are"
```

**Extraction Rules**:
- Split by spaces, commas, periods, newlines
- Filter out words ≤ 3 characters
- Filter out stop words
- Convert to lowercase
- Deduplicate
- Limit to 25 keywords max

**Example**:
```
Input: "Black leather wallet with credit cards and ID"
Processing:
1. Split: ["Black", "leather", "wallet", "with", "credit", "cards", "and", "ID"]
2. Filter short: ["Black", "leather", "wallet", "with", "credit", "cards", "and", "ID"]
3. Filter stop: ["Black", "leather", "wallet", "credit", "cards", "ID"]
4. Result: ["black", "leather", "wallet", "credit", "cards", "id"]
```

### 5.5 Caching Strategy

- **Memory Cache**: In-memory caching for 6 hours
- **Cache Keys**:
  - Images: `img:{imageUrl}`
  - Text: `txt:{textHash}`
  - Location: `loc:{normalizedAddress}`
- **Benefits**:
  - Reduces API calls
  - Improves response time
  - Reduces costs

### 5.6 Error Handling

- **Try-Catch**: All methods wrapped in exception handling
- **Logging**: Full exception logging with context
- **Graceful Failure**: Returns `AIAnalysisResult` with `success: false` and error message
- **Partial Success**: Combined analyses can succeed even if one component fails

### 5.7 AIAnalysisResult Structure

```csharp
public class AIAnalysisResult
{
    public bool Success { get; set; }              // Overall success flag
    public string? Error { get; set; }             // Error message if failed

    public List<string>? Keywords { get; set; }    // Extracted keywords
    public string? ImageFeatures { get; set; }     // Base64 image URL
    public Dictionary<string, object>? AdditionalData { get; set; } // Extra data

    public List<string>? Tags { get; set; }        // Top keywords for UI
    public string? Description { get; set; }       // AI-generated description
}
```

**Storage**: `AIAnalysisResult` is serialized to JSON and stored in:
- `LostItem.AIAnalysisData`
- `FoundItem.AIAnalysisData`

**Deserialization**: When matching, JSON is deserialized back to `AIAnalysisResult` for scoring

---

## 6. Validation Rules

All validation is performed server-side. Frontend should mirror these rules for better UX.

### 6.1 Authentication Validations

#### RegisterDto
| Field | Required | Constraints | Error Message |
|-------|----------|-------------|---------------|
| FirstName | ✓ | 1-50 chars | "First name is required" / "First name cannot exceed 50 characters" |
| LastName | ✓ | 1-50 chars | "Last name is required" / "Last name cannot exceed 50 characters" |
| Email | ✓ | Valid email format | "Email is required" / "Invalid email address" |
| PhoneNumber | ✓ | Non-empty | "Phone number is required" |
| Password | ✓ | 6-100 chars | "Password is required" / "Password must be between 6 and 100 characters" |
| ConfirmPassword | ✓ | Must match Password | "Confirm password is required" / "Passwords do not match" |

#### LoginDto
| Field | Required | Constraints |
|-------|----------|-------------|
| Email | ✓ | Valid email format |
| Password | ✓ | Non-empty |

#### ConfirmEmailDto
| Field | Required | Constraints |
|-------|----------|-------------|
| Email | ✓ | Valid email format |
| Code | ✓ | Exactly 6 characters |

#### ResetPasswordDto
| Field | Required | Constraints |
|-------|----------|-------------|
| Email | ✓ | Valid email format |
| Code | ✓ | Non-empty |
| NewPassword | ✓ | 6-100 chars |
| ConfirmPassword | ✓ | Must match NewPassword |

### 6.2 Item Validations

#### CreateLostItemDto
| Field | Required | Constraints | Business Rules |
|-------|----------|-------------|----------------|
| Category | ✓ | Must be: PersonalBelongings, People, or Pets | |
| Title | ✓ | Non-empty | 1-200 chars recommended |
| Description | ✓ | Non-empty | Detailed descriptions improve matching |
| ImageUrl | ✗ | URL format if provided | JPG, PNG, GIF supported |
| Location.Address | ✓ | Non-empty | Must provide address |
| Location.Latitude | ✗ | -90 to 90 if provided | Should match address |
| Location.Longitude | ✗ | -180 to 180 if provided | Should match address |
| Location.City | ✗ | | |
| Location.Governorate | ✗ | | |
| DateLost | ✓ | DateTime | Must be today or in the past |
| ContactInfo | ✓ | Non-empty | Email or phone number |

#### CreateFoundItemDto
| Field | Required | Constraints | Business Rules |
|-------|----------|-------------|----------------|
| Category | ✓ | Must be: PersonalBelongings, People, or Pets | Must match lost item category |
| Title | ✓ | Non-empty | |
| Description | ✓ | Non-empty | |
| ImageUrl | ✗ | URL format if provided | |
| Location.Address | ✓ | Non-empty | |
| Location.Latitude | ✗ | -90 to 90 if provided | |
| Location.Longitude | ✗ | -180 to 180 if provided | |
| Location.City | ✗ | | |
| Location.Governorate | ✗ | | |
| DateFound | ✓ | DateTime | Must be today or in the past, should be >= DateLost |
| ContactInfo | ✓ | Non-empty | |

#### UpdateLostItemDto / UpdateFoundItemDto
All fields are **optional**. Only provided fields will be updated.

| Field | Constraints |
|-------|-------------|
| Title | 1-200 chars |
| Description | Non-empty |
| ImageUrl | URL format if provided |
| Location.Address | Non-empty if Location provided |
| ContactInfo | Non-empty |
| Status | Must be: Active, Found, Closed, or Expired |

### 6.3 User Profile Validations

#### UpdateUserProfileDto
| Field | Required | Constraints |
|-------|----------|-------------|
| FirstName | ✗ | 1-50 chars if provided |
| LastName | ✗ | 1-50 chars if provided |
| PhoneNumber | ✗ | Non-empty if provided |

### 6.4 File Upload Validations

#### Profile Picture / Image Upload
| Constraint | Rule |
|------------|------|
| File Size | Max 5MB |
| Formats | JPG, JPEG, PNG, GIF |
| Content Type | Must be image/* |
| File Name | UUID generated, original extension preserved |

**Error Response** (if invalid):
```json
{
  "isSuccess": false,
  "message": "Failed to upload image. Please ensure the file is a valid image (JPG, PNG, GIF) and under 5MB.",
  "errors": []
}
```

### 6.5 Business Rules

#### Date Rules
1. **Lost Items**: `DateLost` must be today or in the past (no future dates)
2. **Found Items**: `DateFound` must be today or in the past (no future dates)
3. **Found vs Lost**: For logical matches, `DateFound` should be >= `DateLost` (found after lost)

#### Category Rules
1. Categories are **case-insensitive** (PersonalBelongings = personalbelongings = PERSONALBELONGINGS)
2. Matching only occurs between items of the **same category**
3. Available categories:
   - `PersonalBelongings`
   - `People`
   - `Pets`

#### Location Rules
1. **GPS Coordinates**: If latitude is provided, longitude must also be provided (and vice versa)
2. **Address Required**: Address is always required (GPS is optional)
3. **Coordinate Ranges**: Latitude: -90 to 90, Longitude: -180 to 180
4. **Proximity Scoring**: Only works when both items have GPS coordinates

#### Match Status Rules
1. **Ownership**: Only the owner of the LostItem can update match status
2. **Valid Status Values**: Pending, Confirmed, Rejected, Resolved
3. **Case-Insensitive**: Status values are case-insensitive

#### Item Status Rules
1. **Valid Values**: Active, Found, Closed, Expired
2. **Default**: New items start as "Active"
3. **Closed/Expired**: Items marked as Closed or Expired won't be included in new matches
4. **Owner Only**: Only the owner can update item status

#### User Account Rules
1. **Email Uniqueness**: Each email can only be registered once
2. **Email Verification**: Users must verify email before certain actions (configurable)
3. **Account Deletion**: Soft delete (IsDeleted flag), not permanent removal
4. **Role-Based Access**: Admin endpoints require Admin role

---

## 7. User Flows / Use Cases

### 7.1 User Registration Flow

```
1. User Registration
   ├─ POST /api/auth/register
   │  ├─ Validation
   │  ├─ Check email uniqueness
   │  ├─ Hash password
   │  ├─ Create user (IsEmailVerified = false)
   │  └─ Return tokens and user data
   │
   ├─ Email Verification
   │  ├─ POST /api/auth/send-email-confirmation
   │  │  └─ Generate 6-digit code (stored in VerificationCode table)
   │  │
   │  ├─ POST /api/auth/confirm-email
   │  │  └─ Verify code, set IsEmailVerified = true
   │  │
   └─ Authentication
      ├─ POST /api/auth/login
      │  └─ Return access token + refresh token
      │
      └─ Use access token for subsequent API calls
```

**Expected Frontend UX**:
- Registration form with validation
- Automatic redirect to verification page
- Email sent with 6-digit code
- Code verification form
- Login after successful verification

---

### 7.2 Reporting a Lost Item Flow

```
1. Create Lost Item
   ├─ User clicks "Report Lost Item"
   ├─ Fill form (Category, Title, Description, Image, Location, Date, Contact)
   ├─ POST /api/upload/image (if image provided)
   │  └─ Returns imageUrl
   │
   ├─ POST /api/lostitems
   │  ├─ Validate input
   │  ├─ Create LostItem entity
   │  ├─ Trigger AI Analysis (AnalyzeLostItemAsync)
   │  │  ├─ Analyze image (if provided)
   │  │  ├─ Analyze description
   │  │  ├─ Analyze location
   │  │  └─ Combine results → JSON
   │  │
   │  ├─ Store AI analysis in LostItem.AIAnalysisData
   │  └─ Return created LostItemDto
   │
   └─ Automatic Matching
      └─ MatchingService.FindMatchesForLostItemAsync
         ├─ Query FoundItems of same category
         ├─ For each FoundItem:
         │  ├─ Calculate match score
         │  ├─ If score >= 60:
         │  │  ├─ Check for duplicates
         │  │  ├─ Create Match
         │  │  ├─ Send email notification to LostItem owner
         │  │  └─ Flag NotificationSent
         │
         └─ Return list of created matches
```

**Expected Frontend UX**:
- Form with fields matching CreateLostItemDto
- Image upload component with preview
- Location picker (address + optional GPS)
- Date picker (default to today)
- Success page showing created item and any matches found
- Email confirmation sent to user

---

### 7.3 Reporting a Found Item Flow

```
1. Create Found Item
   ├─ User clicks "Report Found Item"
   ├─ Fill form (Category, Title, Description, Image, Location, Date, Contact)
   ├─ POST /api/upload/image (if image provided)
   │
   ├─ POST /api/founditems
   │  ├─ Validate input
   │  ├─ Create FoundItem entity
   │  ├─ Trigger AI Analysis (AnalyzeFoundItemAsync)
   │  └─ Return Created FoundItemDto
   │
   └─ Automatic Matching
      └─ MatchingService.FindMatchesForFoundItemAsync
         ├─ Query LostItems of same category
         ├─ Calculate scores
         ├─ Create matches for scores >= 60
         └─ Send email notification to LostItem owner
```

**Expected Frontend UX**:
- Similar to Lost Item form
- Success page showing created item
- List of potential matches (if found)
- **Note**: Found item owners don't receive email notifications (only lost item owners do)

---

### 7.4 Automatic Matching Workflow (System Perspective)

```
Matching Trigger (After Item Creation)
├─ 1. Retrieve Item
│   └─ Get LostItem or FoundItem by ID
│
├─ 2. Retrieve AI Analysis
│   └─ Deserialize AIAnalysisData from database
│
├─ 3. Query Opposite Items
│   └─ If LostItem created → Query FoundItems of same category
│   └─ If FoundItem created → Query LostItems of same category
│
├─ 4. For Each Potential Match
│   ├─ Retrieve AI Analysis for both items
│   ├─ Calculate Match Score
│   │   ├─ Keyword Score (Jaccard similarity)
│   │   ├─ Location Score (Haversine distance)
│   │   ├─ Date Score (Days difference)
│   │   └─ Weighted Total
│   │
│   └─ If Score >= 60:
│       ├─ Check for existing match (duplicate prevention)
│       ├─ Create Match entity
│       ├─ Send Email Notification
│       │   └─ To: LostItem.User.Email
│       │   └─ Subject: "A potential match found"
│       │   └─ Content: LostItem details
│       └─ Mark NotificationSent = true
│
└─ 5. Save Changes
    └─ Commit all created matches to database
```

---

### 7.5 Viewing Matches Flow

```
1. User Requests Matches
   └─ GET /api/matches/my-matches
      └─ Returns all matches where user owns LostItem
         └─ Includes populated LostItem and FoundItem
```

**Expected Frontend UX**:
- Matches list page
- Cards showing both lost and found items side-by-side
- Confidence score prominently displayed
- Action buttons: Confirm, Reject, View Details
- Filter by status (Pending, Confirmed, etc.)
- Pagination if many matches

---

### 7.6 Updating Match Status Flow

```
1. User Takes Action on Match
   ├─ Select match from list
   ├─ Click action button (Confirm/Reject/Resolve)
   │
   ├─ PUT /api/matches/{matchId}/status
   │  ├─ Validate user owns LostItem
   │  ├─ Update Match.Status
   │  └─ Save changes
   │
   └─ Return updated MatchDto

Status Transitions:
├─ Pending → Confirmed (User confirms it's a match)
├─ Pending → Rejected (User rejects the match)
├─ Confirmed → Resolved (User marks as successfully completed)
└─ Rejected → Resolved (Completed after rejection)
```

**Expected Frontend UX**:
- Confirmation dialog before status change
- Update match status
- Show success message
- Refresh match list
- Optionally update item status (e.g., when match resolved, mark items as "Found")

---

### 7.7 Email Notification Flow

```
1. Match Created
   └─ MatchingService.TryCreateMatch
      ├─ Create Match entity
      └─ EmailService.SendMatchNotificationAsync
          ├─ To: LostItem.User.Email
          ├─ Subject: "A potential match found for your lost item: {LostItem.Title}"
          ├─ Body includes:
          │   ├─ Match confidence score
          │   ├─ Lost item details
          │   ├─ Found item details
          │   └─ Link to view match
          └─ Mark match.NotificationSent = true
              └─ Set match.NotificationSentAt = DateTime.UtcNow
```

**Email Content Example**:
```
Subject: A potential match found for your lost wallet

Dear John Doe,

We've found a potential match for your lost item:

Lost Item: Black Leather Wallet
Lost Date: November 20, 2025
Location: 123 Main St, New York

Found Item: Black Leather Wallet
Found Date: November 21, 2025
Location: 456 Park Ave, New York

Confidence Score: 73%

View Match: [Link to web app]

Best regards,
Talaqi Team
```

---

### 7.8 User Profile Management Flow

```
1. View Profile
   └─ GET /api/users/profile
      └─ Returns UserProfileDto with statistics

2. Update Profile
   ├─ PUT /api/users/profile
   │  └─ Update FirstName, LastName, PhoneNumber
   │
   └─ Upload Profile Picture
      ├─ POST /api/users/profile-picture
      │  ├─ Upload file via IFormFile
      │  ├─ Validate (JPG, PNG, GIF, max 5MB)
      │  ├─ Save to uploads directory
      │  ├─ Generate URL
      │  └─ Update User.ProfilePictureUrl
      │
      └─ Returns: { imageUrl, message }

3. Delete Account
   └─ DELETE /api/users/account
      └─ Soft delete (IsDeleted = true, User.IsActive = false)
```

**Expected Frontend UX**:
- Profile page showing user info and statistics
- Editable form for name and phone
- Profile picture with upload button
- Delete account button with confirmation

---

### 7.9 Admin Dashboard Flow

```
1. View Users
   └─ GET /api/admin/users?page=1&size=20
      └─ Paginated list of users

2. View Platform Statistics
   └─ GET /api/admin/statistics
      └─ Returns:
         ├─ User stats (total, active)
         ├─ Item stats (lost, found)
         └─ Match stats (total, pending)

3. View All Items
   └─ GET /api/admin/items?type=lost&page=1&size=20
      └─ Paginated list of items

4. Update User Status
   └─ PUT /api/admin/users/{userId}/status
      └─ Body: { isActive: false }
         └─ Deactivate user account
```

---

## 8. Frontend Requirements

### 8.1 Authentication Pages

#### 8.1.1 Registration Page
**Endpoint**: POST /api/auth/register

**Required Fields**:
- First Name (text input, max 50 chars, required)
- Last Name (text input, max 50 chars, required)
- Email (email input, required, validate format)
- Phone Number (tel input, required)
- Password (password input, min 6, max 100 chars, required)
- Confirm Password (password input, must match password, required)

**Validation**:
- Real-time validation on blur
- Show error messages below each field
- Disable submit until all fields valid
- Email format validation
- Password strength indicator (optional)

**UI Behavior**:
- Clean, modern form design
- Clear labels and placeholders
- Submit button with loading state
- Success redirect to verification page
- Error display at top or below fields

**Example Form**:
```html
<form onSubmit={handleRegister}>
  <input type="text" placeholder="First Name" required />
  <input type="text" placeholder="Last Name" required />
  <input type="email" placeholder="Email" required />
  <input type="tel" placeholder="Phone Number" required />
  <input type="password" placeholder="Password (min 6 chars)" required />
  <input type="password" placeholder="Confirm Password" required />
  <button type="submit">Register</button>
</form>
```

#### 8.1.2 Login Page
**Endpoint**: POST /api/auth/login

**Required Fields**:
- Email (email input, required)
- Password (password input, required)

**UI Behavior**:
- Email and password fields
- "Remember Me" checkbox (optional)
- Forgot Password link
- Login button with loading state
- Error display on failed login
- Redirect to dashboard on success
- Store tokens in localStorage/sessionStorage

#### 8.1.3 Email Verification Page
**Endpoints**:
- POST /api/auth/send-email-confirmation
- POST /api/auth/confirm-email

**Required Fields**:
- Email (pre-filled from registration)
- Verification Code (6-digit numeric string, required)

**UI Behavior**:
- Display email being verified
- Code input (6 boxes for digits, or single field)
- Resend code button (with countdown)
- Success redirect to login
- Error display for invalid code

#### 8.1.4 Password Reset Flow
**Endpoints**:
- POST /api/auth/forgot-password (request reset)
- POST /api/auth/reset-password (complete reset)

**Steps**:
1. Forgot password page: enter email → POST /api/auth/forgot-password
2. Check email for verification code
3. Reset password page: enter email, code, new password, confirm password
4. POST /api/auth/reset-password
5. Redirect to login with success message

---

### 8.2 Item Management Pages

#### 8.2.1 Report Lost Item Page
**Endpoint**: POST /api/lostitems

**Form Fields**:
```javascript
const formData = {
  category: "PersonalBelongings",  // dropdown: PersonalBelongings, People, Pets
  title: "",                        // text input, required
  description: "",                  // textarea, required
  imageUrl: null,                   // file upload (optional)
  location: {
    address: "",                    // text input, required
    latitude: null,                 // number input (optional)
    longitude: null,                // number input (optional)
    city: "",                       // text input (optional)
    governorate: ""                 // text input (optional)
  },
  dateLost: new Date(),             // date picker, required
  contactInfo: ""                   // text input, required
}
```

**UI Components**:
1. **Category Dropdown**
   - Options: Personal Belongings, People, Pets
   - Required field

2. **Image Upload**
   - File input with drag-and-drop
   - Preview image after upload
   - POST /api/upload/image before form submission
   - Show upload progress
   - Error handling for invalid files

3. **Location Picker**
   - Address text input (required)
   - GPS coordinates (optional) - can auto-detect or manual
   - Map integration (optional, recommended)
   - City and Governorate fields (optional)

4. **Date Picker**
   - Default to today
   - Max date: today
   - Allow past dates only

5. **Contact Info**
   - Text input
   - Accept email or phone number
   - Help text: "How should people contact you about this item?"

**Form Submission**:
- Validate all fields before submit
- Show loading state
- On success: show created item and any matches found
- Email confirmation sent to user

**Post-Creation Behavior**:
- Show success message
- Display created item details
- Show list of matches found (if any)
- "View My Items" link

#### 8.2.2 Report Found Item Page
**Similar to Lost Item Page** with differences:
- Form title: "Report Found Item"
- Date field: DateFound
- No "my items" section needed
- Success shows found item and potential matches
- **Note**: No email notification sent to found item owner

#### 8.2.3 Lost Items List Page
**Endpoint**: GET /api/lostitems

**Query Parameters**:
- pageNumber (default: 1)
- pageSize (default: 10)
- category (optional filter)

**UI Components**:
1. **Search/Filter Bar**
   - Category filter dropdown
   - Search box (optional)
   - Clear filters button

2. **Pagination**
   - Previous/Next buttons
   - Page numbers
   - Show "Showing X-Y of Z items"

3. **Item Cards**
   - Display: image, title, category, date lost, location, match count
   - Click to view details
   - Show owner name (optional)

**Response Handling**:
```javascript
// Response structure
{
  isSuccess: true,
  data: {
    items: [...],           // Array of LostItemDto
    pageNumber: 1,
    pageSize: 10,
    totalCount: 25,
    totalPages: 3,
    hasPreviousPage: false,
    hasNextPage: true
  }
}
```

#### 8.2.4 My Items Page (Authenticated)
**Endpoints**:
- GET /api/lostitems/my-items
- GET /api/founditems/my-items

**UI Components**:
1. **Tabs**
   - "My Lost Items" tab
   - "My Found Items" tab

2. **Item List**
   - Show user's items
   - Action buttons: View, Edit, Delete
   - Status badge
   - Match count

3. **Empty State**
   - Show message if no items
   - "Report Lost Item" button
   - "Report Found Item" button

**Edit/Delete Functionality**:
- Edit: Navigate to edit page with pre-filled form
- Delete: Confirmation dialog, then DELETE /api/lostitems/{id}
- After delete: Refresh list

#### 8.2.5 Item Detail Page
**Endpoints**:
- GET /api/lostitems/{id}
- GET /api/founditems/{id}

**UI Components**:
1. **Item Details**
   - Large image (if available)
   - Title
   - Category
   - Description
   - Location (with map if GPS available)
   - Date lost/found
   - Contact info
   - Status
   - Created date

2. **Owner Information**
   - Name
   - Profile picture (if available)
   - Contact info (only show to authenticated users)

3. **Matches Section** (for lost items only)
   - Show related matches
   - Confidence scores
   - Action buttons

4. **Action Buttons** (if item belongs to user)
   - Edit button
   - Delete button

---

### 8.3 Matches Pages

#### 8.3.1 My Matches Page
**Endpoint**: GET /api/matches/my-matches

**UI Components**:
1. **Match List**
   - Cards showing LostItem and FoundItem side-by-side
   - Confidence score prominently displayed
   - Match status badge

2. **Status Filters**
   - "All" tab
   - "Pending" tab
   - "Confirmed" tab
   - "Resolved" tab

3. **Match Card Content**
   - Lost Item image and details
   - Found Item image and details
   - Confidence score
   - Created date
   - Status badge

**Match Card Example**:
```html
<div class="match-card">
  <div class="lost-item">
    <img src="..." />
    <h3>Lost: Black Wallet</h3>
    <p>Nov 20, 2025 - 123 Main St</p>
  </div>

  <div class="confidence-score">
    <div class="score">73%</div>
    <div class="score-label">Match</div>
  </div>

  <div class="found-item">
    <img src="..." />
    <h3>Found: Black Wallet</h3>
    <p>Nov 21, 2025 - 456 Park Ave</p>
  </div>

  <div class="actions">
    <span class="badge status-pending">Pending</span>
    <button class="btn-confirm">Confirm</button>
    <button class="btn-reject">Reject</button>
  </div>
</div>
```

#### 8.3.2 Match Detail Page
**Endpoint**: GET /api/matches/{id}

**UI Components**:
1. **Side-by-Side Comparison**
   - Lost Item (left)
     - Image
     - Title
     - Description
     - Location
     - Date lost

   - Found Item (right)
     - Image
     - Title
     - Description
     - Location
     - Date found

2. **Match Information**
   - Confidence score (large, prominent)
   - Match status
   - Created date

3. **Action Buttons**
   - Confirm button (if pending)
   - Reject button (if pending)
   - Mark as Resolved (if confirmed)

**Update Status Flow**:
```javascript
const updateStatus = async (matchId, status) => {
  const response = await fetch(`/api/matches/${matchId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (response.ok) {
    // Show success message
    // Refresh match data
    // Redirect back to list
  }
}
```

---

### 8.4 User Profile Pages

#### 8.4.1 Profile Page
**Endpoint**: GET /api/users/profile

**UI Components**:
1. **Profile Header**
   - Profile picture (large, editable)
   - Name
   - Email (read-only)
   - Member since date

2. **Statistics Section**
   - Lost items count
   - Found items count
   - Total matches (optional)

3. **Edit Button**
   - Navigate to edit form

#### 8.4.2 Edit Profile Page
**Endpoint**: PUT /api/users/profile

**Form Fields**:
```javascript
{
  firstName: "",    // text input
  lastName: "",     // text input
  phoneNumber: ""   // tel input
}
```

**UI Behavior**:
- Pre-fill form with current values
- Real-time validation
- Save button with loading state
- Success message on save
- Cancel button to return without saving

#### 8.4.3 Upload Profile Picture
**Endpoint**: POST /api/users/profile-picture

**UI Components**:
1. **Current Picture**
   - Display current profile picture
   - Fallback to initials if no picture

2. **Upload Button**
   - File input with image preview
   - Drag-and-drop support
   - Show upload progress

**File Validation**:
- Max size: 5MB
- Formats: JPG, PNG, GIF
- Show error for invalid files

**Upload Flow**:
```javascript
const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/users/profile-picture', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();

  if (result.isSuccess) {
    // Update UI with new image URL
    // Show success message
  }
}
```

---

### 8.5 File Upload Component

**Reusable across all pages that need image uploads**

**Features**:
1. **Drag & Drop Zone**
   - Visual feedback on drag over
   - Drop to upload

2. **File Input Button**
   - Browse files button

3. **Preview**
   - Show image before upload
   - Remove/replace option

4. **Upload Progress**
   - Progress bar
   - Percentage

5. **Error Handling**
   - File too large
   - Invalid format
   - Upload failed

**Component API**:
```javascript
<ImageUpload
  onUpload={handleUpload}
  maxSize={5 * 1024 * 1024}  // 5MB
  acceptedFormats={['image/jpeg', 'image/png', 'image/gif']}
  buttonText="Upload Image"
  currentImage={imageUrl}
  onRemove={handleRemove}
/>
```

---

### 8.6 Admin Dashboard (Admin Role Only)

#### 8.6.1 Admin Statistics Page
**Endpoint**: GET /api/admin/statistics

**UI Components**:
1. **Statistics Cards**
   - Total Users / Active Users
   - Total Lost Items / Total Found Items
   - Total Matches / Pending Matches

2. **Charts** (optional)
   - User growth over time
   - Items by category
   - Match success rate

#### 8.6.2 Admin Users Page
**Endpoint**: GET /api/admin/users

**Query Parameters**:
- pageNumber
- pageSize

**UI Components**:
1. **User Table**
   - Columns: Name, Email, Phone, Role, Status, Created, Actions
   - Pagination
   - Search/filter (optional)

2. **Actions**
   - View Details button
   - Deactivate/Activate toggle
   - PUT /api/admin/users/{id}/status

#### 8.6.3 Admin Items Page
**Endpoint**: GET /api/admin/items

**Query Parameters**:
- type (lost/found)
- pageNumber
- pageSize

**UI Components**:
1. **Tabs**
   - Lost Items tab
   - Found Items tab

2. **Items Table**
   - Similar to users table
   - Columns: Title, Category, Status, Owner, Created, Actions

---

### 8.7 Error Handling Guidelines

#### 8.7.1 API Response Structure
All API responses follow this pattern:
```javascript
{
  isSuccess: true/false,
  data: {...},         // Response data on success
  message: "...",      // Success or error message
  errors: [...]        // Array of error messages
}
```

#### 8.7.2 Error Display Strategy

1. **Form Validation Errors**
   - Show field-level errors below each field
   - Highlight invalid fields
   - Real-time validation on blur

2. **API Errors**
   - Show message at top of form/page
   - Use toast notifications for non-blocking errors
   - Log errors to console for debugging

3. **Network Errors**
   - Show "Network Error" message
   - Suggest checking internet connection
   - Retry button

4. **Loading States**
   - Show spinners during API calls
   - Disable submit buttons during submission
   - Skeleton loaders for data fetching

#### 8.7.3 Error Message Examples

**Registration Error**:
```json
{
  "isSuccess": false,
  "message": "Registration failed",
  "errors": ["Email is already registered"]
}
```

**Display**:
- Red error banner at top
- Field-specific errors below fields
- Don't allow form submission

**Network Error**:
```javascript
// Show toast notification
toast.error('Network error. Please check your connection and try again.');
```

**Validation Error**:
```html
<input type="email" className={errors.email ? 'error' : ''} />
{errors.email && <span className="error-message">{errors.email}</span>}
```

#### 8.7.4 HTTP Status Code Handling

| Status | Meaning | Handling |
|--------|---------|----------|
| 200 | Success | Display response data |
| 201 | Created | Show success message, redirect |
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show "Access Denied" |
| 404 | Not Found | Show "Item not found" |
| 500 | Server Error | Show "Something went wrong" message |

---

### 8.8 Authentication & Authorization

#### 8.8.1 Token Storage
- Store `accessToken` and `refreshToken` in localStorage
- Include `accessToken` in Authorization header:
  ```
  Authorization: Bearer {accessToken}
  ```

#### 8.8.2 Protected Routes
Routes requiring authentication:
- /lostitems/my-items
- /lostitems (POST, PUT, DELETE)
- /founditems (all except GET by ID)
- /matches (all)
- /users/profile
- /upload

**Route Guard Implementation**:
```javascript
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};
```

#### 8.8.3 Token Refresh
- When API returns 401, attempt to refresh token
- POST /api/auth/refresh-token with refreshToken
- If refresh fails, redirect to login
- Retry original request with new token

**Implementation**:
```javascript
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await fetch('/api/auth/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (response.ok) {
    const result = await response.json();
    localStorage.setItem('accessToken', result.data.accessToken);
    localStorage.setItem('refreshToken', result.data.refreshToken);
    return true;
  }
  return false;
};
```

#### 8.8.4 Admin Role Check
Admin-only routes:
- /admin/*

**Check**:
```javascript
const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'Admin';
};
```

---

### 8.9 UI/UX Guidelines

#### 8.9.1 Design System

**Colors**:
- Primary: Blue (#007bff)
- Success: Green (#28a745)
- Warning: Orange (#ffc107)
- Danger: Red (#dc3545)
- Light: Light gray (#f8f9fa)
- Dark: Dark gray (#343a40)

**Typography**:
- Headings: Bold, sizes 24px, 20px, 18px
- Body: Regular, 16px
- Small text: 14px
- Labels: Medium, 14px

**Spacing**:
- Base unit: 8px
- Padding: 8px, 16px, 24px, 32px
- Margin: 8px, 16px, 24px, 32px

#### 8.9.2 Component Library Suggestions

**Recommended Libraries**:
- React: Material-UI, Ant Design, or Chakra UI
- Vue: Vuetify or Quasar
- Angular: Angular Material
- Flutter: Material Design widgets

**Essential Components**:
- Form inputs (text, email, password, textarea)
- Buttons (primary, secondary, outline)
- Cards
- Modals/Dialogs
- Tables with pagination
- Loading spinners
- Toast notifications
- Image upload with preview
- Date picker
- Dropdown/Select

#### 8.9.3 Responsive Design

**Breakpoints**:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Optimizations**:
- Touch-friendly button sizes (min 44px)
- Single-column layouts
- Collapsible navigation
- Optimized image sizes
- Simplified forms

#### 8.9.4 Accessibility

**Requirements**:
- Alt text for all images
- Proper form labels
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader compatibility
- Focus indicators

---

### 8.10 Suggested Pages Structure

#### 8.10.1 Public Pages
```
/
├── /login
├── /register
├── /forgot-password
├── /reset-password
├── /verify-email
├── /lost-items
│   └── /lost-items/:id
└── /found-items
    └── /found-items/:id
```

#### 8.10.2 Authenticated Pages
```
/dashboard
├── /profile
├── /my-items
│   ├── /my-items/lost
│   └── /my-items/found
├── /report-lost
├── /report-found
├── /matches
│   ├── /matches (list)
│   └── /matches/:id (detail)
└── /upload
```

#### 8.10.3 Admin Pages
```
/admin
├── /admin/dashboard
├── /admin/users
└── /admin/items
```

---

### 8.11 Performance Optimizations

#### 8.11.1 Image Handling
- Upload images before form submission
- Show compressed thumbnails in lists
- Lazy load images in long lists
- Use appropriate image formats (WebP when possible)

#### 8.11.2 Data Fetching
- Implement pagination for item lists
- Cache API responses where appropriate
- Use infinite scroll or "Load More" for long lists
- Optimistic updates for form submissions

#### 8.11.3 State Management
- Use React Query, SWR, or Apollo for data fetching
- Implement proper loading and error states
- Cache user authentication state
- Local state for form data

---

### 8.12 Testing Guidelines

#### 8.12.1 Unit Tests
- Form validation logic
- Helper functions
- API response parsing

#### 8.12.2 Integration Tests
- Complete user flows (register, login, report item)
- Match status updates
- Image upload

#### 8.12.3 E2E Tests
- User registration and verification
- Reporting lost item and viewing matches
- Updating match status
- Profile management

---

## Summary

This technical specification provides complete documentation for the Talaqi Platform backend API. The frontend team should:

1. **Implement authentication flow** with proper token management
2. **Build forms** matching the DTO specifications
3. **Handle file uploads** with proper validation
4. **Display matches** with confidence scores prominently
5. **Implement real-time validation** for better UX
6. **Handle errors gracefully** with user-friendly messages
7. **Follow responsive design** principles
8. **Implement proper loading states** and feedback

The backend uses Clean Architecture with Domain-Driven Design principles, featuring:
- Entity Framework Core for data access
- AutoMapper for DTO mapping
- OpenAI integration for AI analysis
- Automatic matching system with weighted scoring
- Email notifications for match alerts
- Role-based access control (User/Admin)

For any questions or clarifications, please refer to the code documentation or contact the backend team.

---

**Document Version**: 1.0
**Last Updated**: November 24, 2025
**Maintained By**: Backend Development Team
