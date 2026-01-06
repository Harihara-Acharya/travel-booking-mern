# User Profile & Booking System Improvements

## Information Gathered

### Current State:
- **User.js**: Has name, email, password, role - missing profilePic
- **authRoutes.js**: Has register/login - missing /me endpoint
- **bookingRoutes.js**: Has create/getMy - missing cancel & duplicate prevention
- **server.js**: Only has auth, packages, bookings routes
- **Navbar.js**: Uses simple isLoggedIn state - no user data fetch
- **MyBookings.js**: No cancel functionality

### Target State:
- User profile with profile picture
- Navbar shows user profile pic
- Profile update endpoint
- Cancel booking functionality
- Duplicate booking prevention
- Booking status tracking

---

## Implementation Plan

### Step 1: Update User Model
**File**: `backend/models/User.js`
- Add profilePic field with default image URL

### Step 2: Update Booking Model
**File**: `backend/models/Booking.js`
- Add status field (default: "Active")

### Step 3: Update Auth Routes
**File**: `backend/routes/authRoutes.js`
- Add GET /me endpoint to return user info (without password)

### Step 4: Create User Routes
**File**: `backend/routes/userRoutes.js` (NEW)
- Add PUT /profile endpoint to update profile picture

### Step 5: Update Server
**File**: `backend/server.js`
- Mount user routes at /api/users

### Step 6: Update Booking Routes
**File**: `backend/routes/bookingRoutes.js`
- Add duplicate booking check
- Add DELETE /:id endpoint for cancellation
- Update GET /my to filter by status

### Step 7: Update Navbar
**File**: `frontend/src/components/Navbar.js`
- Fetch user data from /auth/me endpoint
- Display profile picture
- Show user name on hover (optional)

### Step 8: Update App.css
**File**: `frontend/src/App.css`
- Add .profile-pic styles

### Step 9: Update MyBookings
**File**: `frontend/src/pages/MyBookings.js`
- Add cancel booking function
- Add cancel button with confirmation
- Show booking status

---

## Files to Edit/Create

1. `backend/models/User.js` - Add profilePic
2. `backend/models/Booking.js` - Add status
3. `backend/routes/authRoutes.js` - Add /me endpoint
4. `backend/routes/userRoutes.js` - NEW FILE
5. `backend/server.js` - Add user routes
6. `backend/routes/bookingRoutes.js` - Add cancel + duplicate check
7. `frontend/src/components/Navbar.js` - Show profile pic
8. `frontend/src/App.css` - Add profile pic CSS
9. `frontend/src/pages/MyBookings.js` - Add cancel button

---

## Follow-up Steps

After implementation:
1. Test user registration (check default profile pic)
2. Test login and navbar profile pic display
3. Test booking creation (check duplicate prevention)
4. Test booking cancellation
5. Test profile picture update

