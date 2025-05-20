import AppointmentModel from '../models/AppointmentModel.js';
import requestModel from '../models/VolunteerRequestModel.js';
import UserModel from '../models/userModel.js'


// POST: /api/request/create
const createVolunteerRequest = async (req, res) => {
  console.log('✅ Hit createVolunteerRequest');
  try {
    const { appointmentId } = req.body;

    const appointment = await AppointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const userId = appointment.userId; // ✅ Get userId from appointment

    const existingRequest = await requestModel.findOne({
      user: userId,
      appointment: appointmentId,
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'Request already exists' });
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
            model: 'Doctor', // update if your doctor model has a different name
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
    const requests = await requestModel.find({ status: 'pending' })
      .populate({
        path: 'appointment',
        populate: {
          path: 'docId',
          select: 'name speciality hospital image',
        }
      });

    // ✅ Manually fetch user data
    const populatedRequests = await Promise.all(requests.map(async (request) => {
      const user = await UserModel.findById(request.user).select('name email');
      return {
        ...request.toObject(),
        user,
      };
    }));

    res.status(200).json({
      success: true,
      requests: populatedRequests,
    });

  } catch (error) {
    console.error('Error fetching requests for volunteers:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export {
  createVolunteerRequest,
  getAllVolunteerRequests,
  getVolunteerRequestsForVolunteers
};
