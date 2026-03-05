# Services

Your project includes several built-in services. Here's how to use each one.

---

## Email Service

**File:** `Src/Services/EmailService.js`

### Required Env Variables

```env
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_MAIL=you@gmail.com
SMTP_PASS=your_app_password
```

> **Gmail:** Use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

### Usage

```javascript
import { EmailService } from "../Services";

await EmailService({
    to: "user@example.com",
    subject: "Welcome!",
    message: "Thanks for signing up."
});
```

---

## OTP Service

**File:** `Src/Services/OTPService.js`

Generates, stores (hashed), and verifies OTPs. No extra env variables needed.

### Usage

```javascript
import OTPService from "../Services/OTPService.js";

// Generate OTP
const { otpPlain } = await OTPService.generateAndSave("user@example.com");
// otpPlain = "482951" → send this to the user

// Verify OTP
const result = await OTPService.verify("user@example.com", "482951");
if (result.ok) {
    // verified
} else {
    // result.reason: "no_active_otp" | "otp_locked" | "otp_expired" | "invalid_otp"
}

// Invalidate all active OTPs
await OTPService.invalidate("user@example.com");
```

---

## S3 Service (AWS)

**File:** `Src/Services/S3Service.js`

### Required Env Variables

```env
IS_S3=true
AWS_CLIENT_ID=AKIA...
AWS_CLIENT_SECRET=wJalrX...
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=my-app-uploads
```

### Usage

```javascript
import { S3Service } from "../Services";

const result = await S3Service.uploadFile(file, "uploads/images/");
await S3Service.deleteFile("uploads/images/my-file.jpg");
```

---

## Cloudinary Service

**File:** `Src/Services/CloudinaryService.js`

### Required Env Variables

```env
CLOUDINARY_NAME=my-cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123xyz
```

### Usage

```javascript
import { CloudinaryService } from "../Services";

const result = await CloudinaryService.upload(filePath, "products");
await CloudinaryService.destroy(publicId);
```

---

## File Upload Service

**File:** `Src/Services/FileUploadService.js`

### Usage in Routes

```javascript
import { uploadMiddleware } from "../Middleware";

// Single file
router.post("/upload", uploadMiddleware.single("image"), Controller.uploadFile);

// Multiple files (max 5)
router.post("/upload-many", uploadMiddleware.array("images", 5), Controller.uploadFiles);
```

### Storage Switching

| `IS_S3` | Storage |
|---------|---------|
| `true` | AWS S3 |
| `false` / not set | Local (`Src/Uploads/`) |

For Cloudinary, use `CloudinaryService` directly.

---

## Creating Your Own Service

```bash
npx tas add-service Payment
```

Creates `Src/Services/PaymentService.js`:

```javascript
const PaymentService = {
    async execute(data) {
        // Your logic here
        return data;
    },
};

export default PaymentService;
```

Import anywhere: `import { PaymentService } from "../Services";`
