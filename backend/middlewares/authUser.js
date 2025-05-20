import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const token = req.header("token");  // ✅ Ensure the token is correctly extracted

        if (!token) {
            return res.status(403).json({ success: false, message: "Access Denied: No Token Provided" });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;  // ✅ Attach user data to request object
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

export default authUser;
