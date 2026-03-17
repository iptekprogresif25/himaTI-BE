import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi"
import { swaggerUI } from "@hono/swagger-ui"

// controllers
import * as activityController from "../controllers/activity.controller.js"
import * as authController from "../controllers/auth.controller.js"

// validators
import {
  createActivitySchema,
  updateActivitySchema,
  idSchema
} from "../validators/activity.validator.js"

const docApp = new OpenAPIHono()

docApp.openAPIRegistry.registerComponent(
  "securitySchemes",
  "BearerAuth",
  {
    type: "http",
    scheme: "bearer"
  }
)

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
})

docApp.openapi(loginRoute, authController.loginHandler)

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
})

docApp.openapi(getAllActivity, activityController.getAll)


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
})

docApp.openapi(getActivityById, activityController.getOne)


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
})

docApp.openapi(createActivity, activityController.create)


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
})

docApp.openapi(updateActivity, activityController.update)


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
})

docApp.openapi(deleteActivity, activityController.remove)

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
})

/**
 * =========================
 * 🌐 SWAGGER UI
 * =========================
 */

docApp.get("/swagger", swaggerUI({
  url: "/openapi.json"
}))

export default docApp