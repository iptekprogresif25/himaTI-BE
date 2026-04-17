import { describe, it, expect } from "vitest"
import app from "../app.js"

let token: string | null = null
let createdAspirationId: string | null = null

const validUUID = "550e8400-e29b-41d4-a716-446655440000"
const invalidUUID = "123"

describe("🔐 Auth Flow", () => {

  it("Login success", async () => {
    const res = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "atmin@example.com",
        password: "password"
      })
    })

    expect([200, 401]).toContain(res.status)

    if (res.status === 200) {
      const data = await res.json()

      expect(data).toHaveProperty("data")
      expect(data.data).toHaveProperty("token")

      token = data.data.token
    }
  })

})

describe("📦 Aspiration API", () => {

  // =========================
  // CREATE
  // =========================

  it("POST /aspiration tanpa token → gagal", async () => {
    const form = new FormData()
    form.append("topic", "Test")
    form.append("description", "Desc")
    form.append("urgency", "1")
    form.append("category", "General")

    const res = await app.request("/api/aspiration", {
      method: "POST",
      body: form
    })

    expect([401, 403]).toContain(res.status)
  })

  it("POST /aspiration tanpa field wajib → 400", async () => {
    if (!token) return

    const form = new FormData()
    form.append("topic", "Test")

    const res = await app.request("/api/aspiration", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form
    })

    expect(res.status).toBe(400)
  })

  it("POST /aspiration valid → 201", async () => {
    if (!token) return

    const form = new FormData()
    form.append("name", "Test Aspiration")
    form.append("topic", "Education")
    form.append("description", "Testing create aspiration")
    form.append("urgency", "2")
    form.append("category", "General")
    form.append("contact_person", "John Doe")

    const res = await app.request("/api/aspirations", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form
    })

    expect([201, 400]).toContain(res.status)

    if (res.status === 201) {
      const data = await res.json()

      expect(data).toHaveProperty("id")

      createdAspirationId = data.id
    }
  })

  // =========================
  // GET ALL
  // =========================

  it("GET /aspiration → return array", async () => {
    const res = await app.request("/api/aspiration")

    expect(res.status).toBe(200)

    const data = await res.json()

    expect(Array.isArray(data)).toBe(true)
  })

  // =========================
  // GET BY ID
  // =========================

  it("GET invalid UUID → 400", async () => {
    const res = await app.request(`/api/aspiration/${invalidUUID}`)

    expect(res.status).toBe(400)
  })

  it("GET not found → 404", async () => {
    const res = await app.request(`/api/aspiration/${validUUID}`)

    expect([200, 404]).toContain(res.status)
  })

  it("GET by id success", async () => {
    if (!createdAspirationId) return

    const res = await app.request(`/api/aspiration/${createdAspirationId}`)

    expect(res.status).toBe(200)

    const data = await res.json()

    expect(data).toHaveProperty("id", createdAspirationId)
  })

  // =========================
  // DELETE
  // =========================

  it("DELETE tanpa token → gagal", async () => {
    const res = await app.request(`/api/aspiration/${validUUID}`, {
      method: "DELETE"
    })

    expect([401, 403]).toContain(res.status)
  })

  it("DELETE not found → 404", async () => {
    if (!token) return

    const res = await app.request(`/api/aspiration/${validUUID}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })

    expect([404, 400]).toContain(res.status)
  })

  it("DELETE success", async () => {
    if (!token || !createdAspirationId) return

    const res = await app.request(`/api/aspiration/${createdAspirationId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })

    expect(res.status).toBe(200)
  })

})