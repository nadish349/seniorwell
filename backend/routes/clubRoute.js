import express from 'express';
import { registerClub, loginClub ,registerPatientForClub ,requestVolunteer ,createCampaign ,getClubDetails } from '../controllers/clubsController.js';

const clubRouter = express.Router();

clubRouter.post('/register', registerClub);
clubRouter.post('/login', loginClub);
clubRouter.post('/register-patient/:id', registerPatientForClub);
clubRouter.post('/request-volunteer/:clubId', requestVolunteer);
clubRouter.post('/create-campaign/:clubId', createCampaign);
clubRouter.get('/details/:clubId', getClubDetails);
export default clubRouter;
