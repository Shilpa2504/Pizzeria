# 🍕 Pizzeria

A full-stack pizza ordering web application built with Angular 16, Node.js/Express, and MongoDB.

## Features

- Browse and order from a menu of 25+ pizzas
- Build your own custom pizza with toppings
- User authentication (signup/login)
- Shopping cart with real-time updates
- Order placement with summary and confirmation
- Order history visible after login
- Admin panel to manage orders and view stats
- User profile management

## Tech Stack

**Frontend:** Angular 16, Bootstrap 5, FontAwesome  
**Backend:** Node.js, Express  
**Database:** MongoDB

## Getting Started

### Prerequisites
- Node.js
- MongoDB running locally

### Installation

```bash
# Install backend dependencies
cd shilpa_hon_/backend
npm install

# Seed the database
node seed.js

# Start the backend (runs on port 7000)
npm start
```

```bash
# Install frontend dependencies
cd shilpa_hon_/frontend/pizzeria
npm install

# Start the frontend (runs on port 4200)
ng serve
```

Open `http://localhost:4200` in your browser.

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

## License

MIT
