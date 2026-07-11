# ThiranShop API Specifications

All backend API routes are prefixed with `/api`. Protected routes require a valid JSON Web Token passed in the `Authorization` header.

## Headers Required for Protected Routes
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 🔐 1. Authentication Endpoints

### Register User
* **URL**: `/auth/register`
* **Method**: `POST`
* **Access**: Public
* **Payload**:
  ```json
  {
    "username": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "customer"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbG...",
    "user": {
      "id": 1,
      "username": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
  ```

### Login User
* **URL**: `/auth/login`
* **Method**: `POST`
* **Access**: Public
* **Payload**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbG...",
    "user": {
      "id": 1,
      "username": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
  ```

---

## 📦 2. Product Endpoints

### List Products
* **URL**: `/products`
* **Method**: `GET`
* **Access**: Public
* **Query Params**:
  * `search` (string) - Filters by title/description matching keyword.
  * `category` (string) - Filters by category.
  * `sort` (string) - Options: `price_asc`, `price_desc`, `newest`, `default`.
* **Response (200 OK)**: Array of product objects.

### Get Unique Categories
* **URL**: `/products/categories`
* **Method**: `GET`
* **Access**: Public
* **Response (200 OK)**: Array of strings e.g. `["Electronics", "Fashion"]`.

### Get Product Details
* **URL**: `/products/:id`
* **Method**: `GET`
* **Access**: Public
* **Response (200 OK)**: Product object or `404 Not Found`.

### Create Product
* **URL**: `/products`
* **Method**: `POST`
* **Access**: Admin-Only
* **Payload**:
  ```json
  {
    "name": "New Smartphone",
    "description": "Premium device description",
    "price": 699.99,
    "image_url": "https://image.url",
    "category": "Electronics",
    "stock": 10
  }
  ```
* **Response (201 Created)**: Created product details.

### Update Product
* **URL**: `/products/:id`
* **Method**: `PUT`
* **Access**: Admin-Only
* **Payload**: Same as Create Product.
* **Response (200 OK)**: Updated product details.

### Delete Product
* **URL**: `/products/:id`
* **Method**: `DELETE`
* **Access**: Admin-Only
* **Response (200 OK)**: Success message.

---

## 🛒 3. Shopping Cart Endpoints (Protected)

### Get Cart
* **URL**: `/cart`
* **Method**: `GET`
* **Response (200 OK)**: Array of items in the user's cart.

### Add to Cart
* **URL**: `/cart`
* **Method**: `POST`
* **Payload**:
  ```json
  {
    "productId": 2,
    "quantity": 1
  }
  ```
* **Response (201 Created / 200 OK)**: Confirmation message.

### Update Quantity
* **URL**: `/cart/:id`
* **Method**: `PUT`
* **Payload**:
  ```json
  {
    "quantity": 3
  }
  ```
* **Response (200 OK)**: Confirmation message.

### Remove Cart Item
* **URL**: `/cart/:id`
* **Method**: `DELETE`
* **Response (200 OK)**: Confirmation message.

---

## 💖 4. Wishlist Endpoints (Protected)

### Get Wishlist
* **URL**: `/wishlist`
* **Method**: `GET`
* **Response (200 OK)**: List of saved products.

### Toggle Wishlist Item
* **URL**: `/wishlist`
* **Method**: `POST`
* **Payload**:
  ```json
  {
    "productId": 3
  }
  ```
* **Response (200 OK / 201 Created)**: Indicates if added/removed.

---

## 🧾 5. Order Management Endpoints (Protected)

### Place Order
* **URL**: `/orders`
* **Method**: `POST`
* **Payload**:
  ```json
  {
    "shippingAddress": "123 Main St, New York NY 10001",
    "paymentMethod": "Simulated Credit Card",
    "items": [
      { "product_id": 2, "quantity": 1, "price": 299.99 }
    ]
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "message": "Order placed successfully",
    "orderId": 5,
    "totalPrice": 324.98
  }
  ```

### Get My Orders
* **URL**: `/orders/my-orders`
* **Method**: `GET`
* **Response (200 OK)**: List of user orders.

### Get Order Details
* **URL**: `/orders/:id`
* **Method**: `GET`
* **Response (200 OK)**: Order details with list of purchased items.

### List All Orders (Admin)
* **URL**: `/orders`
* **Method**: `GET`
* **Access**: Admin-Only
* **Response (200 OK)**: List of all store orders.

### Update Order Status (Admin)
* **URL**: `/orders/:id/status`
* **Method**: `PUT`
* **Access**: Admin-Only
* **Payload**:
  ```json
  {
    "status": "Shipped"
  }
  ```
* **Response (200 OK)**: Confirmation message.

---

## 📊 6. Admin Panel Endpoints (Admin-Only)

### Get Users
* **URL**: `/admin/users`
* **Method**: `GET`
* **Response (200 OK)**: List of registered users (excluding passwords).

### Get Dashboard Metrics
* **URL**: `/admin/stats`
* **Method**: `GET`
* **Response (200 OK)**: Total sales revenue, product count, order count, and user counts.
