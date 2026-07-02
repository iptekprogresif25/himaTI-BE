import { verifyToken } from '../utils/jwt.js';
export const authMiddleware = async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
        return c.json({ message: "Unauthorized: Missing Authorization header" }, 401);
    }
    const token = authHeader.split(" ")[1];
    if (!token || token === "null" || token === "undefined") {
        return c.json({ message: "Unauthorized: Invalid token format or empty token" }, 401);
    }
    try {
        const payload = verifyToken(token);
        c.set("user", payload);
    }
    catch (error) {
        return c.json({ message: `Unauthorized: ${error.message}` }, 401);
    }
    await next();
};
