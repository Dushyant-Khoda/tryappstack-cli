# Authentication & OTP

Complete authentication system with OTP-based password reset.

---

## Auth Endpoints

Base URL: `/api/v1.0/auth`

### Register

```
POST /api/v1.0/auth/register
```

```bash
curl -X POST http://localhost:3000/api/v1.0/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": { "name": "John Doe", "email": "john@example.com", "role": "team_member" },
    "access_token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully"
}
```

---

### Login

```
POST /api/v1.0/auth/login
```

```bash
curl -X POST http://localhost:3000/api/v1.0/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

**Response (200):** Same format as register — returns `user` + `access_token`.

---

### Forgot Password

Sends a 6-digit OTP to the user's email. OTP is valid for 5 minutes.

```
POST /api/v1.0/auth/forgot-password
```

```bash
curl -X POST http://localhost:3000/api/v1.0/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

> In development (`NODE_ENV=development`), the response includes `debug_otp` for testing.

---

### Verify OTP

Submit the OTP received via email. Returns a `reset_token` valid for 15 minutes.

```
POST /api/v1.0/auth/verify-otp
```

```bash
curl -X POST http://localhost:3000/api/v1.0/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "otp": "123456"}'
```

**Response (201):**

```json
{
  "success": true,
  "data": { "reset_token": "a1b2c3d4e5f6..." },
  "message": "OTP verified successfully"
}
```

**Possible errors:**

| Reason | Message |
|--------|---------|
| `no_active_otp` | No active OTP found. Please request a new OTP. |
| `otp_locked` | Too many invalid attempts. OTP is locked. |
| `otp_expired` | OTP expired. Please request a new OTP. |
| `invalid_otp` | Invalid OTP provided. |

---

### Reset Password

Use the `reset_token` from verify step. Both passwords must match and be at least 8 characters.

```
POST /api/v1.0/auth/reset-password
```

```bash
curl -X POST http://localhost:3000/api/v1.0/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"reset_token": "a1b2c3d4e5f6...", "new_password": "newpass123", "confirm_password": "newpass123"}'
```

---

### Logout

Requires authentication. Clears the token cookie.

```
POST /api/v1.0/auth/logout
```

```bash
curl -X POST http://localhost:3000/api/v1.0/auth/logout \
  -H "Cookie: token=eyJhbGciOiJIUzI1NiIs..."
```

---

## Phone OTP Endpoints

Base URL: `/api/v1.0/otp`

Separate from auth — use for phone verification, user onboarding, etc.

### Send OTP

```bash
curl -X POST http://localhost:3000/api/v1.0/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "channel": "sms"}'
```

> **Important:** You need to add an SMS provider (Twilio, MSG91, etc.) in `Src/Controller/OtpController.js`. See the TODO comment in the file.

### Verify OTP

```bash
curl -X POST http://localhost:3000/api/v1.0/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'
```

---

## Adding Roles

### Step 1: Update the User Model

Edit `Src/Models/UserModel.js`:

```javascript
role: {
    type: String,
    enum: ["super_admin", "team_member", "editor", "viewer"],  // add your roles
    required: true,
    index: true,
},
```

### Step 2: Protect Routes

```javascript
import { AuthenticationMiddleware, AuthorizationMiddleware } from "../Middleware";

// Single role
router.get("/admin", AuthenticationMiddleware, AuthorizationMiddleware("super_admin"), Controller.adminAction);

// Multiple roles
router.get("/edit", AuthenticationMiddleware, AuthorizationMiddleware("super_admin", "editor"), Controller.editAction);
```

### Step 3: Accept role during registration

Update `Src/Validations/AuthValidation.js`:

```javascript
export const registerSchema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    role: Joi.string().valid("super_admin", "team_member", "editor").default("team_member")
});
```

---

## JWT Configuration

| Env Variable | What it does | Example |
|-------------|-------------|---------|
| `JWT_SECRET` | Signs and verifies tokens | Any long random string |
| `JWT_EXPIRE` | Token lifetime | `7d`, `24h`, `30m` |
| `COOKIE_EXPIRE` | Cookie lifetime (days) | `7` |

The token is returned in the response body (`access_token`) and set as an HTTP-only cookie (`token`).

---

## OTP Configuration

Edit `Src/Services/OTPService.js`:

```javascript
const DEFAULT_EXPIRE_MINUTES = 5;   // OTP validity
const MAX_ATTEMPTS = 5;             // Lock after N failed tries
```

Custom digits and expiry:

```javascript
const { otpPlain } = await OTPService.generateAndSave(email, {
    digits: 4,          // 4-digit OTP
    expireMinutes: 10   // 10 min expiry
});
```
