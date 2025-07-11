import AppointmentModel from '../models/AppointmentModel.js';
import requestModel from '../models/VolunteerRequestModel.js';
import UserModel from '../models/userModel.js'
import { notifyVolunteers } from './notificationController.js';
import doctorModel from '../models/doctorModel.js';


// POST: /api/request/create
const createVolunteerRequest = async (req, res) => {
  console.log('✅ Hit createVolunteerRequest');
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required' });
    }

    const appointment = await AppointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check if appointment is cancelled
    if (appointment.cancelled) {
      return res.status(400).json({ success: false, message: 'Cannot request volunteer for cancelled appointment' });
    }

    const userId = appointment.userId; // ✅ Get userId from appointment

    const existingRequest = await requestModel.findOne({
      user: userId,
      appointment: appointmentId,
    });

    if (existingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: 'Volunteer request already exists for this appointment' 
      });
    }

    const newRequest = new requestModel({
      user: userId,
      appointment: appointmentId,
      location: appointment.location || 'Not provided',
      time: appointment.slotDate + ' ' + appointment.slotTime,
      assistanceType: appointment.assistanceType || 'General',
      status: 'pending',
    });

    await newRequest.save();
    console.log('✅ Saved to DB:', newRequest);

    // ✅ Notify all available volunteers about the new request
    const user = await UserModel.findById(userId).select('name');
    const doctor = await AppointmentModel.findById(appointmentId).populate('docId', 'name speciality hospital');
    
    await notifyVolunteers({
      type: 'volunteer_request',
      title: 'New Volunteer Request',
      message: `New volunteer request from ${user.name} for appointment with Dr. ${doctor.docId.name} (${doctor.docId.speciality}) at ${doctor.docId.hospital}`,
      data: {
        requestId: newRequest._id,
        appointmentId: appointmentId,
        userId: userId,
        userName: user.name,
        doctorName: doctor.docId.name,
        doctorSpeciality: doctor.docId.speciality,
        hospital: doctor.docId.hospital,
        location: newRequest.location,
        time: newRequest.time,
        assistanceType: newRequest.assistanceType,
      },
      priority: 'high',
    });

    res.status(201).json({
      success: true,
      message: 'Volunteer request created successfully',
      request: newRequest,
    });

  } catch (error) {
    console.error('❌ Error creating volunteer request:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// GET: /api/request/all
const getAllVolunteerRequests = async (req, res) => {
    try {
      const requests = await requestModel
        .find({ status: 'pending' })
        .populate('user', 'name email') // populate only name & email from User
        .populate({
          path: 'appointment',
          populate: {
            path: 'docId', // assumes docId is in Appointment schema
            model: 'doctor', // update if your doctor model has a different name
            select: 'name speciality hospital' // only grab relevant fields
          }
        });
  
      res.status(200).json({
        success: true,
        requests,
      });
    } catch (error) {
      console.error('Error fetching volunteer requests:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  

// GET: /api/request/for-volunteers
const getVolunteerRequestsForVolunteers = async (req, res) => {
  try {
    console.log('✅ Fetching volunteer requests for volunteers');
    
    const requests = await requestModel.find({ status: 'pending' })
      .populate({
        path: 'appointment',
        populate: {
          path: 'docId',
          select: 'name speciality hospital image',
        }
      });

    console.log('✅ Found', requests.length, 'pending requests');

    // ✅ Manually fetch user data
    const populatedRequests = await Promise.all(requests.map(async (request) => {
      const user = await UserModel.findById(request.user).select('name email');
      return {
        ...request.toObject(),
        user,
      };
    }));

    console.log('✅ Populated requests with user data');

    res.status(200).json({
      success: true,
      requests: populatedRequests,
    });

  } catch (error) {
    console.error('❌ Error fetching requests for volunteers:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// PUT: /api/request/accept/:requestId
const acceptVolunteerRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { volunteerId, volunteerName } = req.body;

    if (!volunteerId || !volunteerName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Volunteer ID and name are required' 
      });
    }

    const request = await requestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Request is no longer pending' 
      });
    }

    // Update request status to accepted and add volunteer info
    request.status = 'accepted';
    request.acceptedBy = volunteerId;
    request.acceptedByName = volunteerName;
    request.acceptedAt = new Date();
    await request.save();

    // Get user details for notification
    const user = await UserModel.findById(request.user).select('name email');
    
    res.status(200).json({
      success: true,
      message: 'Volunteer request accepted successfully',
      request,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error accepting volunteer request:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// PUT: /api/request/reject/:requestId
const rejectVolunteerRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { volunteerId, volunteerName, reason } = req.body;

    if (!volunteerId || !volunteerName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Volunteer ID and name are required' 
      });
    }

    const request = await requestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Request is no longer pending' 
      });
    }

    // Update request status to rejected
    request.status = 'rejected';
    request.rejectedBy = volunteerId;
    request.rejectedByName = volunteerName;
    request.rejectionReason = reason || 'No reason provided';
    request.rejectedAt = new Date();
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Volunteer request rejected successfully',
      request
    });

  } catch (error) {
    console.error('Error rejecting volunteer request:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// GET: /api/request/user/:userId
const getUserVolunteerRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('✅ Fetching volunteer requests for user:', userId);
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const requests = await requestModel.find({ user: userId })
      .populate({
        path: 'appointment',
        populate: {
          path: 'docId',
          select: 'name speciality hospital image',
        }
      })
      .sort({ createdAt: -1 });

    console.log('✅ Found', requests.length, 'requests for user');

    res.status(200).json({
      success: true,
      requests,
    });

  } catch (error) {
    console.error('❌ Error fetching user volunteer requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};

export {
  createVolunteerRequest,
  getAllVolunteerRequests,
  getVolunteerRequestsForVolunteers,
  acceptVolunteerRequest,
  rejectVolunteerRequest,
  getUserVolunteerRequests
};
