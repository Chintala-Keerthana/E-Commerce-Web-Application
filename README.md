# 🛒 ThiranShop - Full-Stack E-Commerce Web Application

ThiranShop is a professional, responsive, and secure full-stack E-Commerce web application built with modern web technologies. It provides a complete online shopping experience with user authentication, product browsing, cart management, wishlist functionality, checkout flow, order management, and an admin dashboard.

The application includes JWT-based authentication, role-based access control, dynamic product filtering, and a fully integrated backend with a MySQL database.

---

## 🌐 Live Demo

**Frontend:**
https://thiran-shop.vercel.app/shop

**Backend API:**
https://e-commerce-web-application-kyc5.onrender.com

---

# 🚀 Key Features

## 👤 User Authentication

* Secure user registration and login.
* Password hashing using `bcryptjs`.
* JWT-based authentication.
* Protected routes using authentication middleware.
* Role-based access control for customers and administrators.

---

## 🛍️ Product Management

* Dynamic product listing.
* Search products by name and description.
* Filter products by category.
* Sort products by price and latest products.
* Product details page with:

  * Product information
  * Price details
  * Stock availability
  * Quantity selection

---

## 🛒 Shopping Cart & Wishlist

### Cart Features

* Add products to cart.
* Update product quantities.
* Remove items from cart.
* Automatic price calculation.
* Tax and shipping calculation.
* Database-synchronized cart.

### Wishlist Features

* Add and remove favorite products.
* Save products for later.
* Move wishlist items to cart.

---

## 💳 Checkout & Orders

* Shipping details collection.
* Order summary generation.
* Simulated payment workflow.
* Order creation and transaction tracking.
* Inventory updates after successful orders.

---

## 🛠️ Admin Dashboard

* Secure admin panel.
* Dashboard analytics.
* Product CRUD operations:

  * Add products
  * Edit products
  * Delete products
* Order management.
* Update order status:

  * Pending
  * Shipped
  * Delivered
* User management with role details.

---

# 🛠️ Technology Stack

## Frontend

* React.js (Vite)
* React Router
* Axios
* Lucide React Icons
* CSS

## Backend

* Node.js
* Express.js

## Database

* MySQL
* TiDB Cloud

## Authentication & Security

* JSON Web Token (JWT)
* bcryptjs
* CORS
* dotenv

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: TiDB Cloud

---

# 📂 Project Structure

```text
E-Commerce-Web-Application
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   └── contexts
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── config
│
└── README.md
```

---

# 🔐 Security Features

* Encrypted user passwords.
* JWT authentication.
* Protected API endpoints.
* Role-based authorization.
* Secure environment variable configuration.

---

# 📈 Future Enhancements

* Real payment gateway integration.
* Product reviews and ratings.
* Order history.
* Email notifications.
* Advanced analytics.

---

# 👩‍💻 Author

**Keerthana Chintala**

Computer Science Engineering Student

---

# ⭐ Project Highlights

* Complete full-stack E-Commerce solution.
* Secure authentication and authorization.
* Database-driven cart and order management.
* Production deployment using Vercel, Render, and TiDB Cloud.
* Responsive and user-friendly shopping experience.

```
```
