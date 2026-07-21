import jwt from "jsonwebtoken";
import User from "../models/User.js";

 export const protect = async (req, res, next)=> {
    const token = req.headers.authorization;
    if(!token){
        return res.json({success:false, message: "not authorized"})
    }
    try {
        const userId = jwt.verify(token, process.env.JWT_SECRET)

        if(!userId){
            return res.json({success:false, message: "not authorized"})
        }
        req.user = await User.findById(userId).select("-password")
        next();
    } catch (error) {
        return res.json({success:false, message: "not authorized"})
    }
}

export const verifyOwner = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.json({ success: false, message: "not authorized" });
        }
        if (req.user.role !== "owner") {
            return res.json({ success: false, message: "Access denied. Owners only." });
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}