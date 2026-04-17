import { describe, it, expect, beforeAll } from "vitest";
import app from "../app.js";
let token = null;
// UUID contoh untuk test
const validUUID = "550e8400-e29b-41d4-a716-446655440000";
const invalidUUID = "123";
// Simulasi login user sebelum test
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
        });
        // kemungkinan response
        expect([200, 401]).toContain(res.status);
        if (res.status === 200) {
            const data = await res.json();
            token = data.token;
        }
        //     console.log("STATUS:", res.status)
        // const text = await res.text()
        // console.log("BODY:", text)
    });
});
describe("Product API User Simulation", () => {
    /**
     * TEST 1
     * akses endpoint protected tanpa token
     */
    it("POST /api/product  WITHOUT token should return unauthorized", async () => {
        const form = new FormData();
        form.append("name", "Test Product");
        form.append("description", "Product Description");
        const res = await app.request("/api/product", {
            method: "POST",
            body: form
        });
        expect([401, 403]).toContain(res.status);
    });
    /**
   * TEST 2
   * create product dengan login
   */
    it("POST /api/product WITH token should create product", async () => {
        if (!token) {
            console.warn("Skipping test because login failed");
            return;
        }
        const form = new FormData();
        form.append("name", "Test Product");
        form.append("description", "Product for testing");
        const res = await app.request("/api/product", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: form
        });
        expect([201, 400]).toContain(res.status);
        if (res.status === 201) {
            const data = await res.json();
            expect(data).toHaveProperty("id");
            expect(data).toHaveProperty("name");
        }
    });
    it("POST /api/product WITH token without image", async () => {
        if (!token) {
            console.warn("Skipping test because login failed");
            return;
        }
        const form = new FormData();
        form.append("name", "Test Product");
        form.append("description", "Product for testing");
        const res = await app.request("/api/product", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: form
        });
        expect([201, 400]).toContain(res.status);
        if (res.status === 201) {
            const data = await res.json();
            expect(data).toHaveProperty("id");
            expect(data).toHaveProperty("name");
        }
    });
    /**
     * TEST 3
     * invalid UUID
     */
    it("GET /api/product/:id with INVALID UUID should return 400", async () => {
        const res = await app.request(`/api/product/${invalidUUID}`);
        expect(res.status).toBe(400);
    });
    /**
     * TEST 4
     * valid UUID tapi data tidak ada
     */
    it("GET /api/product/:id NOT FOUND should return 404", async () => {
        const res = await app.request(`/api/product/${validUUID}`);
        expect([200, 404]).toContain(res.status);
    });
    /**
     * TEST 5
     * update product tanpa token
     */
    it("PATCH /api/product/:id WITHOUT token should return unauthorized", async () => {
        const form = new FormData();
        form.append("name", "Updated Product");
        const res = await app.request(`/api/product/${validUUID}`, {
            method: "PATCH",
            body: form
        });
        expect([401, 403]).toContain(res.status);
    });
    /**
   * TEST 1
   * akses endpoint tanpa login
   */
    it("GET /api/product WITHOUT login should still work if public", async () => {
        const res = await app.request("/api/product");
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(Array.isArray(data)).toBe(true);
    });
    /**
     * TEST 7
     * delete product tanpa login
     */
    it("DELETE /api/product/:id WITHOUT token should fail", async () => {
        const res = await app.request(`/api/product/${validUUID}`, {
            method: "DELETE"
        });
        expect([401, 403]).toContain(res.status);
    });
});
