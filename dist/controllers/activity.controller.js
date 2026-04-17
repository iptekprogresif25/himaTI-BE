import * as activityService from "../services/activity.service.js";
export const getAll = async (c) => {
    try {
        const activities = await activityService.getActivities();
        return c.json({
            success: true,
            message: "Success get activities",
            data: activities
        });
    }
    catch (err) {
        console.error(err);
        return c.json({
            success: false,
            message: "Internal Server Error",
            data: null
        }, 500);
    }
};
export const getOne = async (c) => {
    try {
        const id = c.req.param("id");
        if (!id) {
            return c.json({
                success: false,
                message: "ID is required",
                data: null
            }, 400);
        }
        const activity = await activityService.getActivityById(id);
        if (!activity) {
            return c.json({
                success: false,
                message: "Activity not found",
                data: null
            }, 404);
        }
        return c.json({
            success: true,
            message: "Success get activity",
            data: activity
        });
    }
    catch (err) {
        console.error(err);
        return c.json({
            success: false,
            message: "Internal Server Error",
            data: null
        }, 500);
    }
};
export const create = async (c) => {
    try {
        const body = await c.req.parseBody();
        const activity = await activityService.createActivity(body.name, body.description, body.image, body.url);
        return c.json({
            success: true,
            message: "Activity created",
            data: activity
        }, 201);
    }
    catch (err) {
        console.error(err);
        return c.json({
            success: false,
            message: "Internal Server Error",
            data: null
        }, 500);
    }
};
export const update = async (c) => {
    try {
        const id = c.req.param("id");
        if (!id) {
            return c.json({
                success: false,
                message: "ID is required",
                data: null
            }, 400);
        }
        const body = await c.req.parseBody();
        const activity = await activityService.updateActivity(id, body);
        if (!activity) {
            return c.json({
                success: false,
                message: "Activity not found",
                data: null
            }, 404);
        }
        return c.json({
            success: true,
            message: "Activity updated",
            data: activity
        });
    }
    catch (err) {
        console.error(err);
        return c.json({
            success: false,
            message: "Internal Server Error",
            data: null
        }, 500);
    }
};
export const remove = async (c) => {
    try {
        const id = c.req.param("id");
        if (!id) {
            return c.json({
                success: false,
                message: "ID is required",
                data: null
            }, 400);
        }
        const activity = await activityService.deleteActivity(id);
        if (!activity) {
            return c.json({
                success: false,
                message: "Activity not found",
                data: null
            }, 404);
        }
        return c.json({
            success: true,
            message: "Activity deleted successfully",
            data: null
        });
    }
    catch (err) {
        console.error(err);
        return c.json({
            success: false,
            message: "Internal Server Error",
            data: null
        }, 500);
    }
};
