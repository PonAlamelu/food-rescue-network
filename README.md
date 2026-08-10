# 🍽️ Food Rescue Network

A full-stack MERN application designed to bridge the gap between food donors (restaurants, supermarkets) and food recipients (NGOs, charities) to reduce food waste and combat hunger.

## ✨ Features

### For Donors
- Create and manage food donations with photos and descriptions
- Real-time location tracking with interactive maps
- Track donation status and impact
- View donation history and generate reports
- Email and SMS notifications for donation updates

### For NGOs/Recipients
- Browse available donations on an interactive map
- Request donations based on their needs
- Manage donation requests and track fulfillment
- Communicate with donors through the platform
- Access leaderboard and view impact statistics

### Admin Features
- Comprehensive admin dashboard
- User and donation management
- Request approval system
- Activity logging and audit trails
- System-wide reporting and analytics

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2
- **Database**: MongoDB with Mongoose 9.1
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io
- **Email Service**: Nodemailer
- **SMS Service**: Twilio
- **Security**: bcryptjs for password hashing
- **Development**: Nodemon

### Frontend
- **Framework**: React 19
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Maps**: Leaflet & React-Leaflet
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)
- Git

### Recommended Tools
- VS Code
- MongoDB Compass
- Postman API Tester

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FoodRescue
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (backend and frontend)
npm run install-all
```

### 3. Backend Configuration

Navigate to the backend directory:

```bash
cd backend
```

Create a `.env` file with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/foodrescue
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
SMTP_SERVICE=gmail
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### 4. Frontend Configuration

Navigate to the frontend directory:

```bash
cd frontend
```

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📦 Running the Application

### Development Mode

From the root directory, run both backend and frontend concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

### Production Build

```bash
npm run build
```

## 📁 Project Structure

```
FoodRescue/
├── backend/
│   ├── config/           # Database and configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Authentication and error middleware
│   ├── models/            # MongoDB schemas (User, Donation, Request, etc.)
│   ├── routes/            # API route definitions
│   ├── utils/             # Helper functions (email, SMS, tokens)
│   ├── tests/             # Test files
│   └── server.js          # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Application pages
│   │   ├── context/       # React Context for state management
│   │   ├── api/           # API integration (Axios)
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main App component
│   └── public/            # Static assets
│
└── package.json           # Root package configuration
```

## 🔌 API Endpoints

### User Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Donation Routes
- `POST /api/donations` - Create new donation (protected)
- `GET /api/donations` - Get all donations
- `GET /api/donations/:id` - Get donation details
- `PUT /api/donations/:id` - Update donation (protected)
- `DELETE /api/donations/:id` - Delete donation (protected)

### Request Routes
- `POST /api/requests` - Create donation request (protected)
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get request details
- `PUT /api/requests/:id` - Update request status (protected)

### Notification Routes
- `GET /api/notifications` - Get user notifications (protected)
- `PUT /api/notifications/:id/read` - Mark notification as read (protected)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Protected routes require:

```
Authorization: Bearer <jwt_token>
```

Tokens are generated on login and stored in the frontend for subsequent requests.

## 🗺️ Real-time Features

Socket.io enables real-time communication for:
- Live donation updates
- Instant notifications
- Real-time status changes
- Location tracking updates

## 📊 Database Models

- **User**: Donor, NGO, and Admin accounts
- **Donation**: Food donation listings
- **Request**: Donation requests from NGOs
- **Notification**: User notifications
- **Delivery**: Donation delivery tracking
- **AdminLog**: System activity logging

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Authors

**Ponalamelu** - Final Year Project

## 📞 Support

For support, email ponalamelusoff1@gmail.com or open an issue in the repository.

## 🙏 Acknowledgments

- Food donors and NGOs participating in the platform
- Contributors and community members
- Open-source libraries and frameworks used

---

**Help fight food waste and hunger with Food Rescue Network! 🌱**
