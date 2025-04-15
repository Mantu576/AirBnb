# Airbnb Clone Project

## Overview
A full-stack Airbnb clone built with Node.js, Express.js, MongoDB, and Tailwind CSS. The application allows users to browse properties, make bookings, and manage their listings.

## Features
- 🏠 **Property Listings** with detailed information
- 🔍 **Search and filter properties**
- 📅 **Booking system** with date selection
- 💳 **Payment processing**
- 📄 **Invoice generation** for bookings
- ⭐ **Rating system**
- ❤️ **Favorites functionality**
- 👤 **User authentication and authorization**
- 🏡 **Host dashboard** for property management

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templates, Tailwind CSS
- **Authentication**: Express-session
- **File Upload**: Multer
- **PDF Generation**: PDFKit
- **Other Tools**: Connect-flash for notifications

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mantu576/Airbnb.git
   cd AirBnb
2.**Install dependencies**
  ``
    npm install
    ``
3. **Environment Setup Create a .env file in the root directory:**
  ``
  MONGODB_URI=your_mongodb_connection_string
  SESSION_SECRET=your_session_secret
  PORT=3000``
4.**Start the development server**
  ``npm run dev``

## 📁 Project Structure

## File Structure

```plaintext
airbnb-clone/
├── controllers/
│   ├── authController.js
│   └── storeController.js
├── models/
│   ├── booking.js
│   ├── home.js
│   └── user.js
├── public/
│   ├── css/
│   └── js/
├── routes/
│   ├── authRoutes.js
│   └── storeRoutes.js
├── views/
│   ├── partials/
│   └── store/
├── utils/
├── uploads/
├── invoices/
└── app.js
```
## Features Implementation

### 🔐 Authentication
- User registration and login
- Session management
- Protected routes

### 🏡 Property Management
- Create, read, update, and delete properties
- Image upload for properties
- Property details and pricing

### 📅 Booking System
- Date selection for check-in and check-out
- Guest count
- Availability checking
- Booking confirmation
- Invoice generation

### 🎨 User Interface
- Responsive design with Tailwind CSS
- Flash messages for user feedback
- Dynamic content loading

---

## 🛠️ API Routes

### 🔐 Authentication Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout

### 🏡 Property Routes
- `GET /homes` - List all properties
- `GET /homes/:id` - Get property details
- `POST /homes` - Create new property (protected)
- `PUT /homes/:id` - Update property (protected)
- `DELETE /homes/:id` - Delete property (protected)

### 📦 Booking Routes
- `POST /checkout` - Process booking
- `GET /bookings` - Get user's bookings
- `GET /bookings/:id/invoice` - Download booking invoice

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch:**
   ```bash
   git checkout -b feature/AmazingFeature
3. **Commit your changes:**
  ```plaintext
  git commit -m 'Add some AmazingFeature
```
4.**Push to the branch:**
```
git push origin feature/AmazingFeature
```
5. **Open a Pull Request**

## 📄 License ##
This project is licensed under the MIT License - see the LICENSE file for details.

🙌 Acknowledgments
Airbnb for inspiration

Tailwind CSS for the UI framework

Express.js for the backend framework

MongoDB for the database

