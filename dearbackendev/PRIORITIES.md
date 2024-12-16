# Backend Implementation Priorities

## Immediate Priorities (Phase 1)

### Authentication & User Management

- [ ] Implement JWT authentication with refresh tokens
  - Currently handling login/register in AuthContext
  - Need to support both owner and renter types
  - Required for all protected routes

### Property Management (Core Features)

- [ ] Create Property Model & Migration with essential fields:

  ```php
  - id
  - owner_id
  - title
  - description
  - type (apartment, villa, etc.)
  - price
  - bedrooms
  - bathrooms
  - area
  - location
  - year_built
  - furnished (boolean)
  - images (json/relationship)
  - amenities (json)
  - booking_status
  - created_at
  - updated_at
  ```

- [ ] Implement CRUD API endpoints for properties:
  ```php
  - GET /api/properties (with filters)
  - GET /api/properties/{id}
  - POST /api/properties
  - PUT /api/properties/{id}
  - DELETE /api/properties/{id}
  ```

### Tour Request System

- [ ] Create TourRequest Model & Migration:

  ```php
  - id
  - property_id
  - renter_id
  - owner_id
  - tour_date
  - tour_time
  - status (pending/approved/rejected)
  - created_at
  - updated_at
  ```

- [ ] Implement tour request endpoints:
  ```php
  - GET /api/tour-requests
  - POST /api/tour-requests
  - PUT /api/tour-requests/{id}/status
  ```

### User Profile

- [ ] Create UserProfile Model & Migration:
  ```php
  - id
  - user_id
  - full_name
  - phone
  - email
  - business_name (for owners)
  - business_license (for owners)
  - address
  - created_at
  - updated_at
  ```

## Phase 2 Priorities

### Image Management

- [ ] Implement image upload system
- [ ] Add image optimization
- [ ] Create image storage structure
- [ ] Handle multiple images per property

### Search & Filtering

- [ ] Implement property search
- [ ] Add filter functionality
- [ ] Create location-based search

### Settings & Preferences

- [ ] Create user settings storage
- [ ] Implement notification preferences
- [ ] Add language preferences

## Later Phases

### Enhanced Features

- [ ] Property analytics
- [ ] Review/rating system
- [ ] Property favoriting
- [ ] Real-time notifications

### Payment Integration

- [ ] Payment gateway integration
- [ ] Subscription system
- [ ] Invoice generation

### Security & Performance

- [ ] Rate limiting
- [ ] Caching
- [ ] API monitoring
