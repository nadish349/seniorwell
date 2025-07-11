# SeniorWell - Healthcare Management System

A comprehensive healthcare management system with volunteer request functionality, appointment booking, and medicine management.

## 🚀 Features

### Patient Features
- **Appointment Booking**: Book appointments with doctors
- **Volunteer Requests**: Request volunteer assistance for appointments
- **Medicine Purchase**: Browse and purchase medicines
- **Profile Management**: Update personal information
- **Request Tracking**: View volunteer request status

### Volunteer Features
- **Request Management**: View and respond to volunteer requests
- **Real-time Notifications**: Get notified of new requests
- **Availability Toggle**: Set availability status
- **Profile Management**: Update volunteer information

### Doctor Features
- **Appointment Management**: View and manage appointments
- **Profile Management**: Update doctor information
- **Availability Control**: Set availability status

### Admin Features
- **Doctor Management**: Add and manage doctors
- **Medicine Management**: Add and manage medicines
- **Appointment Overview**: View all appointments
- **Dashboard Analytics**: System statistics

## 🛠️ Tech Stack

### Frontend
- **React.js** - Frontend framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Routing
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Cloudinary** - Image storage
- **Razorpay** - Payment gateway

## 📁 Project Structure

```
seniorwell1/
├── backend/                 # Backend API
│   ├── config/             # Database and cloudinary config
│   ├── controllers/        # API controllers
│   ├── middlewares/        # Authentication middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── uploads/            # Uploaded files
├── seniorwell/             # Main frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   └── assets/         # Static assets
├── admin/                  # Admin frontend
│   └── src/
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd seniorwell1
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../seniorwell
   npm install
   ```

4. **Install admin dependencies**
   ```bash
   cd ../admin
   npm install
   ```

### Environment Setup

1. **Backend Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

2. **Frontend Environment Variables**
   Create a `.env` file in the `seniorwell` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Start the main frontend**
   ```bash
   cd seniorwell
   npm run dev
   ```

3. **Start the admin frontend**
   ```bash
   cd admin
   npm run dev
   ```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/volunteer/register` - Volunteer registration
- `POST /api/volunteer/login` - Volunteer login

### Appointment Endpoints
- `POST /api/user/book-appointment` - Book appointment
- `GET /api/user/appointments` - Get user appointments
- `POST /api/user/cancel-appointment` - Cancel appointment

### Volunteer Request Endpoints
- `POST /api/request/create` - Create volunteer request
- `GET /api/request/for-volunteers` - Get pending requests
- `PUT /api/request/accept/:requestId` - Accept request
- `PUT /api/request/reject/:requestId` - Reject request
- `GET /api/request/user/:userId` - Get user requests

### Notification Endpoints
- `GET /api/notifications/volunteer` - Get volunteer notifications
- `PUT /api/notifications/read/:notificationId` - Mark as read
- `GET /api/notifications/unread-count` - Get unread count

## 🔧 Key Features

### Volunteer Request System
- Patients can request volunteer assistance for appointments
- Volunteers receive real-time notifications
- Request status tracking (pending, accepted, rejected)
- Detailed request information with patient and doctor details

### Real-time Notifications
- Automatic notification to all available volunteers
- Unread count badges
- Mark as read functionality
- Priority-based notifications

### Payment Integration
- Razorpay payment gateway
- Secure payment processing
- Payment verification

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy the backend directory

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React.js community
- Tailwind CSS
- MongoDB
- Express.js 