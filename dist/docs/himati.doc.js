import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
// controllers
import * as activityController from "../controllers/activity.controller.js";
import * as authController from "../controllers/auth.controller.js";
// controllers
import * as productController from "../controllers/product.controller.js";
// validators
import { createProductSchema, updateProductSchema, idSchema as productIdSchema } from "../validators/product.validator.js";
// validators
import { createActivitySchema, updateActivitySchema, idSchema } from "../validators/activity.validator.js";
const docApp = new OpenAPIHono();
docApp.openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
    type: "http",
    scheme: "bearer"
});
/**
 * =========================
 * 🔐 AUTH ROUTES
 * =========================
 */
const loginRoute = createRoute({
    method: "post",
    path: "/api/auth/login",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: z.object({
                        email: z.string().email(),
                        password: z.string()
                    })
                }
            }
        }
    },
    responses: {
        200: {
            description: "Login success"
        },
        401: {
            description: "Invalid credentials"
        }
    }
});
docApp.openapi(loginRoute, authController.loginHandler);
/**
 * =========================
 * 📦 ACTIVITY ROUTES
 * =========================
 */
// GET ALL
const getAllActivity = createRoute({
    method: "get",
    path: "/api/activity",
    tags: ["Activity"],
    responses: {
        200: {
            description: "Get all activities"
        }
    }
});
docApp.openapi(getAllActivity, activityController.getAll);
// GET BY ID
const getActivityById = createRoute({
    method: "get",
    path: "/api/activity/{id}",
    tags: ["Activity"],
    request: {
        params: idSchema
    },
    responses: {
        200: { description: "Activity found" },
        404: { description: "Activity not found" }
    }
});
docApp.openapi(getActivityById, activityController.getOne);
// CREATE
const createActivity = createRoute({
    method: "post",
    path: "/api/activity",
    tags: ["Activity"],
    security: [{ BearerAuth: [] }],
    request: {
        body: {
            content: {
                "multipart/form-data": {
                    schema: createActivitySchema
                }
            }
        }
    },
    responses: {
        201: { description: "Activity created" },
        401: { description: "Unauthorized" }
    }
});
docApp.openapi(createActivity, activityController.create);
// UPDATE
const updateActivity = createRoute({
    method: "patch",
    path: "/api/activity/{id}",
    tags: ["Activity"],
    security: [{ BearerAuth: [] }],
    request: {
        params: idSchema,
        body: {
            content: {
                "multipart/form-data": {
                    schema: updateActivitySchema
                }
            }
        }
    },
    responses: {
        200: { description: "Activity updated" },
        404: { description: "Not found" }
    }
});
docApp.openapi(updateActivity, activityController.update);
// DELETE
const deleteActivity = createRoute({
    method: "delete",
    path: "/api/activity/{id}",
    tags: ["Activity"],
    security: [{ BearerAuth: [] }],
    request: {
        params: idSchema
    },
    responses: {
        200: { description: "Deleted" },
        404: { description: "Not found" }
    }
});
docApp.openapi(deleteActivity, activityController.remove);
const getAllProduct = createRoute({
    method: "get",
    path: "/api/product",
    tags: ["Product"],
    responses: {
        200: {
            description: "Get all products"
        }
    }
});
docApp.openapi(getAllProduct, productController.getAll);
const getProductById = createRoute({
    method: "get",
    path: "/api/product/{id}",
    tags: ["Product"],
    request: {
        params: productIdSchema
    },
    responses: {
        200: { description: "Product found" },
        404: { description: "Product not found" }
    }
});
docApp.openapi(getProductById, productController.getOne);
const createProduct = createRoute({
    method: "post",
    path: "/api/product",
    tags: ["Product"],
    security: [{ BearerAuth: [] }],
    request: {
        body: {
            content: {
                "multipart/form-data": {
                    schema: createProductSchema.extend({
                        image: z.any()
                    })
                }
            }
        }
    },
    responses: {
        201: { description: "Product created" },
        401: { description: "Unauthorized" }
    }
});
docApp.openapi(createProduct, productController.create);
const updateProduct = createRoute({
    method: "patch",
    path: "/api/product/{id}",
    tags: ["Product"],
    security: [{ BearerAuth: [] }],
    request: {
        params: productIdSchema,
        body: {
            content: {
                "multipart/form-data": {
                    schema: updateProductSchema.extend({
                        image: z.any().optional()
                    })
                }
            }
        }
    },
    responses: {
        200: { description: "Product updated" },
        404: { description: "Product not found" }
    }
});
docApp.openapi(updateProduct, productController.update);
const deleteProduct = createRoute({
    method: "delete",
    path: "/api/product/{id}",
    tags: ["Product"],
    security: [{ BearerAuth: [] }],
    request: {
        params: productIdSchema
    },
    responses: {
        200: { description: "Product deleted" },
        404: { description: "Product not found" }
    }
});
docApp.openapi(deleteProduct, productController.remove);
/**
 * =========================
 * 📘 OPENAPI CONFIG
 * =========================
 */
docApp.doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
        title: "HIMA TI API",
        version: "1.0.0",
        description: "Dokumentasi API HIMA TI Backend"
    }
});
/**
 * =========================
 * 🌐 SWAGGER UI
 * =========================
 */
docApp.get("/swagger", swaggerUI({
    url: "/openapi.json"
}));
export default docApp;
