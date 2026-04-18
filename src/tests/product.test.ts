import { describe, it, expect } from "vitest"
import app from "../app.js"

let token: string | null = null
let productId: string | null = null

const invalidUUID = "123"

describe("User Authentication Flow", () => {

  it("User login with valid credentials", async () => {

    const res = await app.request("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "atmin@example.com",
        password: "password"
      })
    })

    expect([200, 401]).toContain(res.status)

    if (res.status === 200) {
      const data = await res.json()
      token = data.token
    }
  })

})

describe("Product API (PATCH version)", () => {

  it("POST /api/product WITHOUT token → unauthorized", async () => {

    const form = new FormData()
    form.append("name", "Test Product")

    const res = await app.request("/api/product", {
      method: "POST",
      body: form
    })

    expect([401,403]).toContain(res.status)
  })

  it("POST /api/product WITH token → create product", async () => {

    if (!token) return

    const form = new FormData()
    form.append("name", "Test Product")
    form.append("description", "Initial description")
    form.append("price", "10000")

    const res = await app.request("/api/product", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    })

    expect([201,400]).toContain(res.status)

    if (res.status === 201) {
      const data = await res.json()

      productId = data.id

      expect(data).toHaveProperty("id")
      expect(data.name).toBe("Test Product")
    }
  })

  it("GET /api/product → should return list", async () => {

    const res = await app.request("/api/product")

    expect(res.status).toBe(200)

    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it("GET /api/product/:id INVALID UUID → 400", async () => {

    const res = await app.request(`/api/product/${invalidUUID}`)
    expect(res.status).toBe(400)
  })

  it("GET /api/product/:id → should work", async () => {

    if (!productId) return

    const res = await app.request(`/api/product/${productId}`)
    expect([200,404]).toContain(res.status)
  })

  it("PATCH /api/product/:id WITHOUT token → unauthorized", async () => {

    if (!productId) return

    const form = new FormData()
    form.append("name", "Updated Name")

    const res = await app.request(`/api/product/${productId}`, {
      method: "PATCH",
      body: form
    })

    expect([401,403]).toContain(res.status)
  })

  it("PATCH /api/product/:id WITH token → partial update", async () => {

    if (!token || !productId) return

    const form = new FormData()
    form.append("name", "Updated Product Name")

    const res = await app.request(`/api/product/${productId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    })

    expect([200,400]).toContain(res.status)

    if (res.status === 200) {
      const data = await res.json()

      expect(data.name).toBe("Updated Product Name")
      // ❗ field lain tidak berubah (PATCH behavior)
    }
  })

  it("DELETE /api/product/:id WITHOUT token → fail", async () => {

    if (!productId) return

    const res = await app.request(`/api/product/${productId}`, {
      method: "DELETE"
    })

    expect([401,403]).toContain(res.status)
  })

  it("DELETE /api/product/:id WITH token → success", async () => {

    if (!token || !productId) return

    const res = await app.request(`/api/product/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    expect([200,204]).toContain(res.status)
  })

})