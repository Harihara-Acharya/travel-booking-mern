# Partner Role Implementation Plan

## Current State Analysis

### Already Exists:
1. **User Model** - Has `role` field with default `"user"`
2. **Auth Middleware** - Decodes token including `role`
3. **Login Response** - Returns user role in token and response
4. **API Service** - Has interceptors for token injection

### Needs to be Added:
1. Enum validation for role field
2. partnerMiddleware for authorization
3. Package ownership (partnerId)
4. Partner package CRUD APIs
5. Partner booking visibility
6. Partner dashboard frontend

---

## Implementation Steps

### STEP 1 — ADD PARTNER ROLE (Auth Foundation)
**Goal**: Add enum validation to User role field

**Files to Modify:**
- `backend/models/User.js` - Add enum validation

**Changes:**
```javascript
role: { 
  type: String, 
  enum: ["user", "partner", "admin"],
  default: "user" 
}
```

**Validation:** Existing users without role will work (defaults not applied retroactively, but no migration needed as role is optional string).

---

### STEP 2 — PARTNER AUTH MIDDLEWARE (Security)
**Goal**: Create middleware to restrict routes to partners

**Files to Create:**
- `backend/middleware/partnerMiddleware.js`

**Content:**
```javascript
module.exports = function (req, res, next) {
  if (req.user.role !== "partner") {
    return res.status(403).json({ message: "Access denied. Partners only." });
  }
  next();
};
```

---

### STEP 3 — PACKAGE OWNERSHIP (Core Change)
**Goal**: Associate each package with a partner

**Files to Modify:**
- `backend/models/Package.js` - Add partnerId field
- `backend/routes/packageRoutes.js` - Set partnerId on create

**Package Schema Changes:**
```javascript
partnerId: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: "User",
  required: true
}
```

**Package Creation Changes:**
- Add partnerId from req.user.id
- Only partners can create packages

---

### STEP 4 — PARTNER PACKAGE CRUD APIs
**Goal**: Create partner-only package management routes

**Files to Create:**
- `backend/routes/partnerRoutes.js`

**Routes:**
- `POST /api/partner/packages` - Create package
- `GET /api/partner/packages` - List own packages
- `PUT /api/partner/packages/:id` - Update own package
- `DELETE /api/partner/packages/:id` - Delete own package

**Middleware Stack:**
- auth + partnerMiddleware on all routes
- Ownership validation on update/delete

---

### STEP 5 — PARTNER BOOKINGS VIEW
**Goal**: Allow partners to see bookings for their packages

**Files to Modify:**
- `backend/routes/partnerRoutes.js` - Add bookings endpoint

**New Endpoint:**
- `GET /api/partner/bookings` - Get all bookings for partner's packages

**Logic:**
- Find bookings where package.partnerId === req.user.id
- Populate user and package details

---

### STEP 6 — PARTNER DASHBOARD (Frontend)
**Goal**: Create separate UI for partners

**Files to Create:**
- `frontend/src/pages/PartnerDashboard.js`
- `frontend/src/pages/PartnerPackages.js`
- `frontend/src/pages/PartnerPackageForm.js`
- `frontend/src/pages/PartnerBookings.js`

**Files to Modify:**
- `frontend/src/App.js` - Add partner routes
- `frontend/src/components/Navbar.js` - Add partner nav link

**Routes:**
- `/partner/dashboard` - Main dashboard
- `/partner/packages` - List own packages
- `/partner/packages/new` - Create package
- `/partner/packages/edit/:id` - Edit package

---

### STEP 7 — FINAL SAFETY CHECKS
**Validation:**
- [ ] Users cannot access partner routes
- [ ] Partners cannot access admin routes
- [ ] Partners cannot modify others' packages
- [ ] Bookings remain functional

---

## File Summary

### New Files:
| File | Purpose |
|------|---------|
| `backend/middleware/partnerMiddleware.js` | Role authorization |
| `backend/routes/partnerRoutes.js` | Partner APIs |
| `frontend/src/pages/PartnerDashboard.js` | Partner dashboard |
| `frontend/src/pages/PartnerPackages.js` | Package list |
| `frontend/src/pages/PartnerPackageForm.js` | Package form |
| `frontend/src/pages/PartnerBookings.js` | Bookings list |

### Modified Files:
| File | Changes |
|------|---------|
| `backend/models/User.js` | Add enum validation |
| `backend/models/Package.js` | Add partnerId field |
| `backend/routes/packageRoutes.js` | Set partnerId on create |
| `backend/server.js` | Register partner routes |
| `frontend/src/App.js` | Add partner routes |
| `frontend/src/components/Navbar.js` | Add partner nav |

---

## Testing Checklist

After implementation:
1. Login as existing user → role is "user"
2. Manually set user role to "partner" in DB
3. Login as partner → can access partner routes
4. Partner can create package (partnerId set correctly)
5. Partner can see only their packages
6. Partner can see bookings for their packages
7. Normal user cannot access partner routes

