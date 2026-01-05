# NestJS RBAC API Endpoints

Base URL: `http://localhost:3000`

---

## Auth Endpoints

### Register
**POST** `/auth/register`
```json
{
  "email": "customer@test.com",
  "password": "password123",
  "name": "Test Customer",
  "role": "customer"
}
```
> Roles: `customer` | `sales` | `financer`

### Login
**POST** `/auth/login`
```json
{
  "email": "customer@test.com",
  "password": "password123"
}
```

### Logout
**POST** `/auth/logout`

*No body - requires authentication*

---

## Dashboard Endpoints

| Endpoint | Method | Access |
|----------|--------|--------|
| `/dashboard` | GET | All authenticated users |
| `/dashboard/sales` | GET | Sales only |
| `/dashboard/customer` | GET | Customer only |
| `/dashboard/financer` | GET | Financer only |
| `/dashboard/reports` | GET | Sales & Financer |

---

## Loan Endpoints

### Customer - Request Loan
**POST** `/loans/request`
```json
{
  "amount": 50000,
  "purpose": "Home renovation",
  "customerId": 1
}
```

### Sales - Request Loan for Customer
**POST** `/loans/request-for-customer`
```json
{
  "amount": 100000,
  "purpose": "Business expansion",
  "customerId": 1
}
```

### Financer - Approve Loan
**POST** `/loans/:id/approve`
```json
{
  "remarks": "Approved based on credit score"
}
```

### Financer - Reject Loan
**POST** `/loans/:id/reject`
```json
{
  "remarks": "Insufficient credit history"
}
```

### View Loans

| Endpoint | Method | Access |
|----------|--------|--------|
| `/loans/all` | GET | Financer only |
| `/loans/pending` | GET | Financer only |
| `/loans/my-loans` | GET | Customer only |
| `/loans/my-requests` | GET | Sales only |

---

## Notes

- Authentication uses cookie-session (JWT stored in session cookie)
- Login first, then session cookie is automatically sent with subsequent requests
- Make sure cookies are enabled in your API client
