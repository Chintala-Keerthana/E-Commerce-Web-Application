# ThiranShop Systems Architecture

This document describes the design patterns, codebase directory organization, data models, and sequence flows used to build the ThiranShop E-Commerce application.

---

## 🏗️ Architectural Overview
ThiranShop utilizes a classic **Client-Server-Database** 3-tier architecture:
1. **Presentation Tier (Frontend)**: React.js (Vite) styled with a responsive Vanilla HSL color CSS system. State is managed via specialized React Context Providers.
2. **Application Tier (Backend)**: Express.js (Node.js) acting as a REST API. Employs middleware for authentication token intercepts and error loggers.
3. **Data Tier (Database)**: MySQL database. Relies on a connection pool for scaling and atomic transactions to preserve catalog and inventory consistency.

---

## 📂 Codebase Directory Organization

```
E-Commerce-Web-Application/
├── client/
│   ├── public/
│   └── src/
│       ├── components/        # Reusable visual items (ProductCard, SearchBar, FilterComponent)
│       ├── context/           # State providers (AuthContext, CartContext, WishlistContext)
│       ├── pages/             # Route screens (Home, Shop, Details, Cart, Wishlist, Dashboard)
│       ├── services/          # API utility client (api.js instance configuration)
│       ├── styles/            # Vanilla HSL variables, components, and layout CSS files
│       ├── App.jsx            # Routing endpoints and ProtectedRoute wrapper declarations
│       └── main.jsx           # Client bundle entry point
└── server/
    ├── config/
    │   ├── db.js              # Database connection pool setup
    │   └── initDb.js          # Automation migration script
    ├── controllers/           # API request processing controllers (auth, products, orders, admin)
    ├── middleware/            # Security validation middlewares (auth, admin)
    ├── models/                # SQL queries models (user, product, cart, wishlist, order)
    ├── routes/                # Express endpoint router mappings (auth, products, cart, wishlist, orders)
    ├── utils/
    │   └── seed.js            # SQL database seeding script
    ├── app.js                 # Server configurations and mounting entry point
    └── schema.sql             # SQL table definitions
```

---

## 🗄️ Database Relationships (ER Diagram)

The following Mermaid entity-relationship diagram shows the tables structure and their foreign key constraints:

```mermaid
erDiagram
    users {
        int id PK
        varchar username
        varchar email UK
        varchar password
        varchar role
        timestamp created_at
    }
    products {
        int id PK
        varchar name
        text description
        decimal price
        varchar image_url
        varchar category
        int stock
        timestamp created_at
    }
    cart_items {
        int id PK
        int user_id FK
        int product_id FK
        int quantity
        timestamp created_at
    }
    wishlist {
        int id PK
        int user_id FK
        int product_id FK
        timestamp created_at
    }
    orders {
        int id PK
        int user_id FK
        decimal total_price
        varchar status
        text shipping_address
        varchar payment_method
        timestamp created_at
    }
    order_items {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
    }

    users ||--o{ cart_items : "adds"
    users ||--o{ wishlist : "saves"
    users ||--o{ orders : "places"
    products ||--o{ cart_items : "in"
    products ||--o{ wishlist : "in"
    orders ||--o{ order_items : "contains"
    products ||--o{ order_items : "ordered_in"
```

---

## 🔄 Sequence Flow: Order Checkout Transaction

This sequence diagram illustrates the transaction flow that occurs when a user checks out their cart:

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant CheckoutPage as Client Checkout
    participant OrderController as Express Controller
    participant OrderModel as SQL Transaction Model
    participant MySQL as MySQL Server

    Customer->>CheckoutPage: Click "Place Order"
    Note over CheckoutPage: Simulates payment processing (2s)
    CheckoutPage->>OrderController: POST /api/orders (totalPrice, address, items)
    Note over OrderController: Authenticate JWT (req.user)
    OrderController->>OrderModel: placeOrder(userId, total, address, items)
    OrderModel->>MySQL: START TRANSACTION
    OrderModel->>MySQL: INSERT INTO orders
    MySQL-->>OrderModel: Return orderId
    loop For each purchased item
        OrderModel->>MySQL: INSERT INTO order_items (orderId, product_id, quantity, price)
        OrderModel->>MySQL: UPDATE products SET stock = stock - quantity WHERE id
    end
    OrderModel->>MySQL: DELETE FROM cart_items WHERE user_id
    alt All queries successful
        OrderModel->>MySQL: COMMIT
        MySQL-->>OrderModel: Success
        OrderModel-->>OrderController: Return orderId
        OrderController-->>CheckoutPage: Respond 201 Created (orderId)
        CheckoutPage-->>Customer: Show "Order Confirmed!" Screen
    else Any query fails (e.g. out of stock)
        OrderModel->>MySQL: ROLLBACK
        MySQL-->>OrderModel: Rolled Back
        OrderModel-->>OrderController: Return Error
        OrderController-->>CheckoutPage: Respond 500 Error
        CheckoutPage-->>Customer: Show Transaction Failed Error
    end
```
