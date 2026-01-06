# TODO - Auth Features Fixes

## Phase 1: Backend Fixes (Critical)
- [x] 1.1 Fix Register endpoint to extract all fields (phone, city, gender, profilePic)
- [x] 1.2 Update Register endpoint to save all fields to database
- [x] 1.3 Update Login response to include phone, city, gender, role

## Phase 2: Frontend Improvements
- [x] 2.1 Add error handling & loading states to Login.js
- [x] 2.2 Add error handling & loading states to Register.js
- [x] 2.3 Add error message styling to Auth.css
- [x] 2.4 Add background image from Pexels to Auth.css

## Phase 3: Auth Flow Improvements
- [x] 3.1 Auto-login after registration
- [x] 3.2 Redirect to home after login (using window.location.href)
- [x] 3.3 Navbar updates immediately with round profile avatar
- [x] 3.4 Added profile-avatar CSS class for round images

## Phase 4: Testing
- [ ] 4.1 Restart backend server
- [ ] 4.2 Restart frontend server
- [ ] 4.3 Test registration with all fields
- [ ] 4.4 Verify auto-login after registration
- [ ] 4.5 Test login and verify user data
- [ ] 4.6 Test error handling (wrong password, existing email)
- [ ] 4.7 Verify profile picture displays as round avatar
- [ ] 4.8 Test logout functionality



