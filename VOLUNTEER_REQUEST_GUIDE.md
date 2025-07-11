# Volunteer Request System Guide

## Overview
The volunteer request system allows patients to request volunteer assistance for their medical appointments, and volunteers can accept or reject these requests. The system now includes real-time notifications for volunteers.

## Features Implemented

### 1. Patient Side (Frontend)
- **Request Volunteer**: Patients can request volunteer assistance from their appointment page
- **View Request Status**: Patients can view their volunteer request status in their profile page
- **Real-time Updates**: Request status updates are shown immediately

### 2. Volunteer Side (Frontend)
- **View Pending Requests**: Volunteers can see all pending volunteer requests
- **Accept/Reject Requests**: Volunteers can accept or reject requests with reasons
- **Real-time Notifications**: Success/error messages for all actions
- **Request Details**: Full information about each request including patient, doctor, and appointment details
- **Notification System**: Real-time notifications for new volunteer requests
- **Unread Count**: Shows number of unread notifications
- **Mark as Read**: Click notifications to mark them as read

### 3. Backend API Endpoints

#### Create Volunteer Request
- **POST** `/api/request/create`
- **Body**: `{ appointmentId: string }`
- **Auth**: User token required
- **Response**: Creates a new volunteer request for an appointment
- **Notification**: Automatically notifies all available volunteers

#### Get All Requests (Admin)
- **GET** `/api/request/all`
- **Response**: Returns all pending volunteer requests

#### Get Requests for Volunteers
- **GET** `/api/request/for-volunteers`
- **Auth**: Volunteer token required
- **Response**: Returns pending requests with patient and appointment details

#### Accept Request
- **PUT** `/api/request/accept/:requestId`
- **Body**: `{ volunteerId: string, volunteerName: string }`
- **Auth**: Volunteer token required
- **Response**: Accepts the request and notifies the patient

#### Reject Request
- **PUT** `/api/request/reject/:requestId`
- **Body**: `{ volunteerId: string, volunteerName: string, reason?: string }`
- **Auth**: Volunteer token required
- **Response**: Rejects the request with optional reason

#### Get User Requests
- **GET** `/api/request/user/:userId`
- **Auth**: User token required
- **Response**: Returns all volunteer requests for a specific user

#### Notification Endpoints
- **GET** `/api/notifications/volunteer` - Get volunteer notifications
- **PUT** `/api/notifications/read/:notificationId` - Mark notification as read
- **PUT** `/api/notifications/read-all` - Mark all notifications as read
- **GET** `/api/notifications/unread-count` - Get unread notification count

## Database Schema

### VolunteerRequest Model
```javascript
{
  user: ObjectId,           // Reference to User
  appointment: ObjectId,     // Reference to Appointment
  location: String,
  time: String,
  assistanceType: String,
  status: String,           // 'pending', 'accepted', 'rejected'
  acceptedBy: ObjectId,     // Reference to Volunteer (if accepted)
  acceptedByName: String,
  acceptedAt: Date,
  rejectedBy: ObjectId,     // Reference to Volunteer (if rejected)
  rejectedByName: String,
  rejectionReason: String,
  rejectedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  recipient: ObjectId,      // Reference to Volunteer
  type: String,             // 'volunteer_request', 'request_accepted', 'request_rejected', 'system'
  title: String,
  message: String,
  data: Object,             // Additional data (request details, etc.)
  read: Boolean,            // Default: false
  priority: String,         // 'low', 'medium', 'high'
  createdAt: Date,
  updatedAt: Date
}
```

## How to Use

### For Patients:
1. Book an appointment with a doctor
2. Go to "My Appointments" page
3. Click "🖐️ Request Volunteer" button for any unpaid appointment
4. Check your profile page to see request status updates

### For Volunteers:
1. Login to volunteer account
2. Go to volunteer dashboard
3. View pending requests
4. Click "Accept Request" or "Reject Request" with optional reason
5. Patient will be notified of the decision
6. **New**: Check notifications panel for real-time updates about new requests

## Notification System

### How Notifications Work:
1. When a patient creates a volunteer request, all available volunteers are automatically notified
2. Notifications appear in real-time on the volunteer dashboard
3. Unread notifications show a red badge with count
4. Click notifications to mark them as read
5. Use "Mark all as read" to clear all notifications

### Notification Types:
- **volunteer_request**: New volunteer request created
- **request_accepted**: Request was accepted by another volunteer
- **request_rejected**: Request was rejected by another volunteer
- **system**: System-wide notifications

## Error Handling
- Validates appointment exists and is not cancelled
- Prevents duplicate requests for same appointment
- Validates volunteer information when accepting/rejecting
- Provides clear error messages for all scenarios

## Notifications
- Toast notifications for all actions
- Success messages include patient name when accepted
- Error messages show specific reasons for failures
- Real-time notification system for volunteers

## Security
- All endpoints require appropriate authentication
- User can only see their own requests
- Volunteers can only see pending requests
- Input validation on all endpoints

## Testing
1. Start the backend server: `cd backend && npm start`
2. Start the frontend: `cd seniorwell && npm run dev`
3. Create test accounts for both patient and volunteer
4. Book an appointment and request volunteer assistance
5. Login as volunteer and check notifications
6. Accept/reject the request
7. Check patient profile for status updates 