import jwt from "jsonwebtoken";
import volunteerModel from "../models/volunteerModel.js";

/**
 * Volunteer Authentication Middleware
 * 1. Verifies JWT token
 * 2. Attaches volunteer data to request object
 * 3. Handles various error scenarios appropriately
 */
const authVolunteer = async (req, res, next) => {
  try {
    // 1. Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required: No valid token provided" 
      });
    }

    // 2. Extract and verify token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required: Malformed token" 
      });
    }

    // 3. Verify token and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required: Invalid token payload" 
      });
    }

    // 4. Fetch volunteer (excluding password)
    const volunteer = await volunteerModel.findById(decoded.id)
      .select('-password -__v') // Exclude sensitive/unecessary fields
      .lean(); // Convert to plain JS object

    if (!volunteer) {
      return res.status(404).json({ 
        success: false, 
        message: "Account not found: Volunteer may have been deleted" 
      });
    }

    // 5. Attach volunteer to request
    req.volunteer = volunteer;
    
    // Optional: Add token expiration check if needed
    // const now = Date.now().valueOf() / 1000;
    // if (decoded.exp < now) {
    //   return res.status(401).json({ 
    //     success: false, 
    //     message: "Session expired: Please login again" 
    //   });
    // }

    next();
  } catch (error) {
    console.error("Authentication Error:", error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required: Invalid token" 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Session expired: Please login again" 
      });
    }

    // Generic error response
    res.status(500).json({ 
      success: false, 
      message: "Authentication failed: Internal server error" 
    });
  }
};

export default authVolunteer;