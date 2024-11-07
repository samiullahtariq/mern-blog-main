import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token; // Get the token from cookies

    // If no token is found, send an unauthorized error
    if (!token) {
        return next(errorHandler(401, "Unauthorized"));
    }

    // Verify the token using the JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        // If there's an error verifying the token, send an unauthorized error
        if (err) {
            return next(errorHandler(401, "Unauthorized"));
        }

        // If the token is valid, attach the decoded user information to the request object
        req.user = decodedToken;

        // Continue to the next middleware or route handler
        next();
    });
};
