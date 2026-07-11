# ThiranShop - Full-Stack E-Commerce Web Application

ThiranShop is a professional, responsive, and secure full-stack E-Commerce web application featuring a modern light/dark theme design, dynamic search filters, a secure checkout process, simulated payment flows, and an extensive Admin Panel.

---

## 🚀 Key Features

### 1. User Authentication
* **Secure Registration & Login**: User sessions backed by secure password hashing (`bcryptjs`).
* **JWT Authorization**: Session management using JSON Web Tokens (JWT) sent via Authorization Bearer headers.
* **Role-Based Guards**: Separate access controls for regular customers and shop administrators.

### 2. Product Management
* **Catalog Exploration**: Sort by price and recency, or filter products by dynamic category sidebars.
* **Smart Search**: Reusable search inputs checking keywords on product titles or descriptions.
* **Product Details**: Inventory status alerts (In Stock, Low Stock, Out of Stock), quantity selector limits, and assurance badges.

### 3. Shopping Cart & Wishlist
* **Database-Synced Cart**: Adds products, updates quantities in real-time, calculates shipping fees (free above $100) and taxes.
* **Wishlist Saves**: Heart icons to instantly save items and quick "Move to Cart" transfers.

### 4. Checkout & Payment Simulation
* **Secure Checkout**: Shipping details and card validation forms.
* **Dummy Payment Simulation**: 2-second payment processor loader verifying transactions.
* **Order Transaction Log**: Transaction queries saving orders list, purchased product prices at order time, and decrementing inventory stocks.

### 5. Admin Dashboard Panel
* **Analytics Cards**: Dashboard displaying total revenues, order counts, product type counts, and registered user counts.
* **Product CRUD**: Modal forms to Add, Edit (repopulate fields), and Delete products in the catalog.
* **Orders Control**: Status select dropdowns (Pending, Shipped, Delivered) updating delivery stages.
* **Accounts Roster**: Roster listing usernames, emails, roles, and creation dates.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Vanilla CSS, React Router, Lucide Icons, Axios.
* **Backend**: Node.js, Express.js.
* **Database**: MySQL.
* **Security**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Cors, Dotenv.

---

## 🔐 Administrative Test Credentials

To log in as the default administrator:
* **Email**: `admin@thiranshop.com`
* **Password**: `adminpassword123`

---

## 🏃 Local Installation & Setup Guide

### 1. Database Setup
1. Ensure your local MySQL server is running on port `3306`.
2. Configure credentials inside the server environment file [server/.env](file:///d:/THIRANEX/E-Commerce-Web-Application/server/.env):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YourPassword Here
   DB_NAME=ecommerce_db
   JWT_SECRET=mysecretkey123
   ```
3. Run the database initialization and seed scripts inside the `server/` directory:
   ```bash
   cd server
   npm run dev      # Server packages must be installed
   node config/initDb.js   # Drops old tables and builds clean schema
   node utils/seed.js      # Seeds 9 premium products and default admin account
   ```

### 2. Launch the Backend API
```bash
cd server
npm install
npm run dev
```
The server will boot and display:
```bash
✅ Server is running on port 5000
✅ MySQL Connection Pool Initialized Successfully
```

### 3. Launch the Frontend UI
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.
