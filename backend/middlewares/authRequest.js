import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js'; 

const authRequest = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure your .env has JWT_SECRET
    const user = await UserModel.findById(decoded.id); // token must have .id

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    req.user = user; // ✅ This line is critical
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

export default authRequest;
