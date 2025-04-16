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
  ```
    npm install
  ```
3. **Environment Setup Create a .env file in the root directory:**

  ```
  MONGODB_URI=your_mongodb_connection_string
  SESSION_SECRET=your_session_secret
  PORT=3000
  ```
4.**Start the development server**
  ```
  npm run dev
  ```

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
![Screenshot 2025-04-15 211617](https://github.com/user-attachments/assets/1b82ee17-6bea-4edf-83b7-60b3b30764cc)
![Screenshot 2025-04-15 211542](https://github.com/user-attachments/assets/ec07b9c2-384a-482c-b395-5e886f3c254b)
![Screenshot 2025-04-15 211737](https://github.com/user-attachments/assets/f91cb585-7daf-4093-a3b4-3102b9a3147d)




### 🏡 Property Management
- Create, read, update, and delete properties
- Image upload for properties
- Property details and pricing
![Screenshot 2025-04-15 212447](https://github.com/user-attachments/assets/75b457b7-7f3f-4ff2-8cfd-854dd51ff77b)
![Screenshot 2025-04-15 212023](https://github.com/user-attachments/assets/d3b18665-f42e-4de5-9617-de963adb6d32)
![Screenshot 2025-04-15 211907](https://github.com/user-attachments/assets/317ad52f-502a-44cd-9098-49aa2f307665)


### 📅 Booking System
- Date selection for check-in and check-out
- Guest count
- Availability checking
- Booking confirmation
- Invoice generation
![Screenshot 2025-04-15 212152](https://github.com/user-attachments/assets/452d7a47-89d3-42f5-a487-68f808eddfbd)

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

