import express from 'express';
import authRequest from '../middlewares/authRequest.js';
import authVolunteer from '../middlewares/authVolunteer.js';
import { createVolunteerRequest,getAllVolunteerRequests,getVolunteerRequestsForVolunteers, acceptVolunteerRequest, rejectVolunteerRequest, getUserVolunteerRequests}from '../controllers/requestController.js';


const RequestRouter = express.Router()
 RequestRouter.post('/create', authRequest, createVolunteerRequest);
 RequestRouter.get('/all', getAllVolunteerRequests);
 RequestRouter.get('/for-volunteers', getVolunteerRequestsForVolunteers);
 RequestRouter.put('/accept/:requestId', authVolunteer, acceptVolunteerRequest);
 RequestRouter.put('/reject/:requestId', authVolunteer, rejectVolunteerRequest);
 RequestRouter.get('/user/:userId', authRequest, getUserVolunteerRequests);

export default RequestRouter;
