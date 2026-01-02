# NestJS RBAC POC

A minimal proof-of-concept demonstrating Role-Based Access Control (RBAC) with JWT authentication in NestJS.

## Features

- **JWT Authentication** - Login/Logout with token-based auth
- **RBAC** - Role-based access control with guards and decorators
- **3 Roles**: `sales`, `customer`, `financer`

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |
| POST | `/auth/logout` | Logout (requires auth) |

### Dashboard (Protected)
| Method | Endpoint | Allowed Roles |
|--------|----------|---------------|
| GET | `/dashboard` | All authenticated |
| GET | `/dashboard/sales` | `sales` only |
| GET | `/dashboard/customer` | `customer` only |
| GET | `/dashboard/financer` | `financer` only |
| GET | `/dashboard/reports` | `sales`, `financer` |

## Test with cURL

### 1. Register Users

```bash
# Register a sales user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"sales@test.com","password":"pass123","name":"Sales User","role":"sales"}'

# Register a customer
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@test.com","password":"pass123","name":"Customer User","role":"customer"}'

# Register a financer
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"finance@test.com","password":"pass123","name":"Finance User","role":"financer"}'
```

### 2. Login

```bash
# Login as sales user
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sales@test.com","password":"pass123"}'
```

### 3. Access Protected Endpoints

```bash
# Replace YOUR_TOKEN with the access_token from login response

# General dashboard (works for all roles)
curl http://localhost:3000/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sales dashboard (only works with sales role)
curl http://localhost:3000/dashboard/sales \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Key Concepts Demonstrated

1. **JWT Strategy** (`src/auth/strategies/jwt.strategy.ts`) - Validates JWT tokens
2. **Roles Guard** (`src/auth/guards/roles.guard.ts`) - Checks user role against required roles
3. **Roles Decorator** (`src/auth/decorators/roles.decorator.ts`) - Marks endpoints with required roles
4. **Current User Decorator** (`src/auth/decorators/current-user.decorator.ts`) - Extracts user from request

## Project Structure

```
src/
├── auth/
│   ├── decorators/       # @Roles(), @CurrentUser()
│   ├── guards/           # JwtAuthGuard, RolesGuard
│   ├── strategies/       # JWT Passport strategy
│   ├── dto/              # Login/Register DTOs
│   ├── enums/            # Role enum
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── user.entity.ts
│   ├── users.service.ts
│   └── users.module.ts
├── dashboard/
│   ├── dashboard.controller.ts
│   └── dashboard.module.ts
├── app.module.ts
└── main.ts
```

## Notes

- This is a **POC only** - uses in-memory storage
- JWT secret is hardcoded - use environment variables in production
- Token blacklist for logout is basic - use Redis in production
