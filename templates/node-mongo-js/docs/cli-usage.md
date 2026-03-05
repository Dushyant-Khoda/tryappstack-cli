# CLI Usage

Use TryAppStack CLI commands to generate modules, routes, controllers, and more.

---

## Full Module (Recommended)

The fastest way to add a new feature:

```bash
npx tas add-module Product
```

**Creates:**

```
Src/Controller/ProductController.js    → CRUD handler methods
Src/Models/ProductModel.js             → Mongoose schema
Src/Routes/ProductRoutes.js            → Express routes
```

**Also updates:** `Controller/index.js`, `Models/index.js`, `Routes/index.js`, `ServerLoader.js`

**Generated API:**

```
POST   /api/v1.0/product       → addProductWorker
GET    /api/v1.0/product       → listProductWorker
GET    /api/v1.0/product/:id   → getProductWorker
PUT    /api/v1.0/product/:id   → updateProductWorker
DELETE /api/v1.0/product/:id   → deleteProductWorker
```

**Auto-docs:** A file is generated at `docs/modules/Product.md` with routes + curl examples.

```bash
# Skip doc generation
npx tas add-module Product --skip-doc
```

---

## Individual Components

### Controller

```bash
npx tas add-controller Product
```

Creates CRUD methods: `addProductWorker`, `listProductWorker`, `getProductWorker`, `updateProductWorker`, `deleteProductWorker`.

### Model

```bash
npx tas add-model Product
```

Creates a Mongoose schema with `name`, `isActive`, `deletedAt`, and timestamps.

### Router

```bash
npx tas add-router Product
```

Creates Express routes and automatically wires them into `ServerLoader.js`.

### Other

```bash
npx tas add-middleware RateLimit    # Middleware
npx tas add-service Payment        # Service
npx tas add-utils Pagination       # Utility
npx tas add-templates Invoice      # HTML template
```

---

## Naming Conventions

Names are automatically converted to **PascalCase**:

| Input | Generated |
|-------|-----------|
| `product` | `ProductController`, `ProductModel`, `ProductRoutes` |
| `user-profile` | `UserProfileController`, `UserProfileModel` |
| `order_item` | `OrderItemController`, `OrderItemModel` |

**Methods:** `<action><Name>Worker` → e.g., `addProductWorker`, `listProductWorker`

**Routes:** Mounted at `/api/v1.0/<lowercase-name>`

---

## Adding Validation to Routes

Create a validation file in `Src/Validations/`:

```javascript
// Src/Validations/ProductValidation.js
import Joi from "joi";

export const createProductSchema = Joi.object({
    name: Joi.string().required().trim(),
    price: Joi.number().required().min(0)
});
```

Use `ValidateRequest` middleware in your routes:

```javascript
import ValidateRequest from "../Middleware/ValidateRequest.js";
import { createProductSchema } from "../Validations/ProductValidation.js";

router.post("/", ValidateRequest(createProductSchema, "body"), ProductController.addProductWorker);
```

---

## Protecting Routes

```javascript
import { AuthenticationMiddleware, AuthorizationMiddleware } from "../Middleware";

// Require login
router.get("/", AuthenticationMiddleware, Controller.listProductWorker);

// Require login + specific role
router.delete("/:id",
    AuthenticationMiddleware,
    AuthorizationMiddleware("super_admin"),
    Controller.deleteProductWorker
);
```
