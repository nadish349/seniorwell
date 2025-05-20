import express from 'express';
import { registerVolunteer, loginVolunteer, getVolunteerProfile, updateVolunteerProfile,updateAvailability } from '../controllers/volunteerController.js';
import authVolunteer from '../middlewares/authVolunteer.js';

const volunteerRouter = express.Router();

volunteerRouter.post('/register', registerVolunteer);
volunteerRouter.post('/login', loginVolunteer);
volunteerRouter.get('/get-volunteers-profile', authVolunteer, getVolunteerProfile);
volunteerRouter.post('/update-profile', authVolunteer, updateVolunteerProfile);
volunteerRouter.post('/toggle-availability', updateAvailability);
export default volunteerRouter;

