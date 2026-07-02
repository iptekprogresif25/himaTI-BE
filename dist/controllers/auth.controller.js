import * as authService from '../services/auth.service.js';
export const loginHandler = async (c) => {
    try {
        const { email, password } = await c.req.json();
        const result = await authService.login(email, password);
        return c.json({
            message: result.message,
            data: result.data
        }, result.status);
    }
    catch (err) {
        return c.json({
            message: "Internal Server Error"
        }, 500);
    }
};
