import express from 'express';
import authRequest from '../middlewares/authUser.js';
import { createVolunteerRequest,getAllVolunteerRequests,getVolunteerRequestsForVolunteers}from '../controllers/requestController.js';


const RequestRouter = express.Router()
 RequestRouter.post('/create', authRequest, createVolunteerRequest);
 RequestRouter.get('/all', getAllVolunteerRequests);
 RequestRouter.get('/for-volunteers', getVolunteerRequestsForVolunteers);


 export default RequestRouter
