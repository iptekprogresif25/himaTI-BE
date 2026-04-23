import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi"
import { swaggerUI } from "@hono/swagger-ui"

// controllers
import * as activityController from "../controllers/activity.controller.js"
import * as authController from "../controllers/auth.controller.js"
import * as productController from "../controllers/product.controller.js"
import * as aspirationController from "../controllers/aspiration.controller.js"

// validators
import {
  createProductSchema,
  updateProductSchema,
  idSchema as productIdSchema
} from "../validators/product.validator.js"

import {
  createActivitySchema,
  updateActivitySchema,
  idSchema
} from "../validators/activity.validator.js"

import {
  createAspirationSchema,
  idSchema as aspirationIdSchema
} from "../validators/aspiration.validator.js"

const docApp = new OpenAPIHono()

// 🔐 Auth Scheme
docApp.openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT"
})

// =====================
// 🔧 GLOBAL SCHEMA
// =====================

const paginationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional()
})

const metaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number()
})

const errorSchema = z.object({
  message: z.string()
})

// =====================
// 🔐 AUTH
// =====================

docApp.openapi(
  createRoute({
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
      200: { description: "Login success" },
      401: { description: "Invalid credentials", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  authController.loginHandler
)

// =====================
// 📦 ACTIVITY
// =====================

docApp.openapi(
  createRoute({
    method: "get",
    path: "/api/activity",
    tags: ["Activity"],
    request: { query: paginationQuerySchema },
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: z.object({
              data: z.array(z.any()),
              meta: metaSchema
            })
          }
        }
      },
      500: { description: "Server Error", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  activityController.getAll as any
)

docApp.openapi(
  createRoute({
    method: "get",
    path: "/api/activity/{id}",
    tags: ["Activity"],
    request: { params: idSchema },
    responses: {
      200: { description: "Found" },
      404: { description: "Not found", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  activityController.getOne
)

docApp.openapi(
  createRoute({
    method: "post",
    path: "/api/activity",
    tags: ["Activity"],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: createActivitySchema }
        }
      }
    },
    responses: {
      201: { description: "Created" },
      401: { description: "Unauthorized", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  activityController.create
)

docApp.openapi(
  createRoute({
    method: "patch",
    path: "/api/activity/{id}",
    tags: ["Activity"],
    security: [{ BearerAuth: [] }],
    request: {
      params: idSchema,
      body: {
        content: {
          "multipart/form-data": { schema: updateActivitySchema }
        }
      }
    },
    responses: {
      200: { description: "Updated" },
      404: { description: "Not found", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  activityController.update
)

docApp.openapi(
  createRoute({
    method: "delete",
    path: "/api/activity/{id}",
    tags: ["Activity"],
    security: [{ BearerAuth: [] }],
    request: { params: idSchema },
    responses: {
      200: { description: "Deleted" },
      404: { description: "Not found", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  activityController.remove
)

// =====================
// 📦 PRODUCT
// =====================

docApp.openapi(
  createRoute({
    method: "get",
    path: "/api/product",
    tags: ["Product"],
    request: { query: paginationQuerySchema },
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: z.object({
              data: z.array(z.any()),
              meta: metaSchema
            })
          }
        }
      },
      500: { description: "Server Error", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  productController.getAll as any
)

docApp.openapi(
  createRoute({
    method: "get",
    path: "/api/product/{id}",
    tags: ["Product"],
    request: { params: productIdSchema },
    responses: {
      200: { description: "Found" },
      404: { description: "Not found", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  productController.getOne
)

docApp.openapi(
  createRoute({
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
      201: { description: "Created" },
      401: { description: "Unauthorized", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  productController.create
)

docApp.openapi(
  createRoute({
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
      200: { description: "Updated" },
      404: { description: "Not found", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  productController.update
)

docApp.openapi(
  createRoute({
    method: "delete",
    path: "/api/product/{id}",
    tags: ["Product"],
    security: [{ BearerAuth: [] }],
    request: { params: productIdSchema },
    responses: {
      200: { description: "Deleted" },
      404: { description: "Not found", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  productController.remove
)

// =====================
// 📦 ASPIRATION
// =====================

docApp.openapi(
  createRoute({
    method: "get",
    path: "/api/aspiration",
    tags: ["Aspiration"],
    request: {
      query: paginationQuerySchema.extend({
        status: z.string().optional()
      })
    },
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: z.object({
              data: z.array(z.any()),
              meta: metaSchema
            })
          }
        }
      },
      500: { description: "Server Error", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  aspirationController.getAll as any
)

docApp.openapi(
  createRoute({
    method: "get",
    path: "/api/aspiration/{id}",
    tags: ["Aspiration"],
    request: { params: aspirationIdSchema },
    responses: {
      200: { description: "Found" },
      404: { description: "Not found", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  aspirationController.getOne
)

docApp.openapi(
  createRoute({
    method: "post",
    path: "/api/aspiration",
    tags: ["Aspiration"],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: createAspirationSchema.extend({
              file: z.any().optional()
            })
          }
        }
      }
    },
    responses: {
      201: { description: "Created" },
      401: { description: "Unauthorized", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  aspirationController.create
)

docApp.openapi(
  createRoute({
    method: "delete",
    path: "/api/aspiration/{id}",
    tags: ["Aspiration"],
    security: [{ BearerAuth: [] }],
    request: { params: aspirationIdSchema },
    responses: {
      200: { description: "Deleted" },
      404: { description: "Not found", content: { "application/json": { schema: errorSchema } } }
    }
  }),
  aspirationController.remove
)

// =====================
// 📘 OPENAPI CONFIG
// =====================

docApp.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "HIMA TI API",
    version: "1.0.0"
  }
})

// =====================
// 🌐 SWAGGER UI
// =====================

docApp.get("/swagger", swaggerUI({ url: "/openapi.json" }))

export default docApp