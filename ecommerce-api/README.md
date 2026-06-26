# E-Commerce Order Management API

REST API for managing products, customers, and orders with stock validation, auto-calculated totals, and order status tracking.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose

## Setup

```bash
npm install
npm start
```

Runs on `http://localhost:5000`. Requires MongoDB on `localhost:27017`.

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create product (name, price, stock, description) |
| GET | `/products` | List all products |
| GET | `/products/:id` | Get product by ID |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customers` | Create customer (name, email, phone) |
| GET | `/customers` | List all customers |
| GET | `/customers/:id` | Get customer by ID |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Place order — validates stock, auto-calculates total, deducts stock |
| GET | `/orders` | List all orders |
| GET | `/orders/:id` | Get order details with populated items |
| PUT | `/orders/:id/status` | Update order status |

### Order Statuses

`Pending` → `Processing` → `Shipped` → `Delivered`

## Business Logic

- Stock is validated before order creation
- Total amount is auto-calculated from product prices × quantities
- Stock is deducted when an order is placed
- Duplicate emails for customers are rejected
