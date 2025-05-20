import jwt from "jsonwebtoken";

// Admin authentication middleware
const authAdmin = (req, res, next) => {
    try {
        // Fetch token correctly from headers (headers are case-insensitive)
        const token = req.headers["atoken"] || req.headers["Authorization"];

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized. Login again." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded email matches the admin email
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }

        next(); // Move to next middleware/controller function

    } catch (error) {
        console.log(error);
        res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authAdmin;
