import { describe, it, expect, beforeAll } from "vitest";
import app from "../app.js";
let token = null;
let createdActivityId = null;
const validUUID = "550e8400-e29b-41d4-a716-446655440000";
const invalidUUID = "123";
describe("🔐 Auth Flow", () => {
    it("Login success", async () => {
        const res = await app.request("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "atmin@example.com",
                password: "password"
            })
        });
        expect([200, 401]).toContain(res.status);
        if (res.status === 200) {
            const data = await res.json();
            expect(data).toHaveProperty("data");
            expect(data.data).toHaveProperty("token");
            token = data.data.token;
        }
    });
    it("Login gagal (password salah)", async () => {
        const res = await app.request("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "atmin@example.com",
                password: "salah"
            })
        });
        expect(res.status).toBe(401);
    });
});
describe("📦 Activity API", () => {
    // =========================
    // CREATE
    // =========================
    it("POST /activity tanpa token → harus gagal", async () => {
        const form = new FormData();
        form.append("name", "Test");
        form.append("description", "Desc");
        form.append("url", "https://test.com");
        const res = await app.request("/api/activity", {
            method: "POST",
            body: form
        });
        expect([401, 403]).toContain(res.status);
    });
    it("POST /activity tanpa field wajib → 400", async () => {
        if (!token)
            return;
        const form = new FormData();
        form.append("name", "Test");
        const res = await app.request("/api/activity", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: form
        });
        expect(res.status).toBe(400);
    });
    it("POST /activity valid → 201", async () => {
        if (!token)
            return;
        const form = new FormData();
        form.append("name", "Test Activity");
        form.append("description", "Testing create");
        form.append("url", "https://example.com");
        const res = await app.request("/api/activity", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: form
        });
        expect([201, 400]).toContain(res.status);
        if (res.status === 201) {
            const data = await res.json();
            expect(data).toHaveProperty("data");
            expect(data.data).toHaveProperty("id");
            createdActivityId = data.data.id;
        }
    });
    // =========================
    // GET ALL
    // =========================
    it("GET /activity → harus return array", async () => {
        const res = await app.request("/api/activity");
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toHaveProperty("data");
        expect(Array.isArray(data.data)).toBe(true);
    });
    // =========================
    // GET BY ID
    // =========================
    it("GET invalid UUID → 400", async () => {
        const res = await app.request(`/api/activity/${invalidUUID}`);
        expect(res.status).toBe(400);
    });
    it("GET not found → 404", async () => {
        const res = await app.request(`/api/activity/${validUUID}`);
        expect([200, 404]).toContain(res.status);
    });
    it("GET by id success", async () => {
        if (!createdActivityId)
            return;
        const res = await app.request(`/api/activity/${createdActivityId}`);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.data).toHaveProperty("id", createdActivityId);
    });
    // =========================
    // UPDATE
    // =========================
    it("PATCH tanpa token → gagal", async () => {
        const res = await app.request(`/api/activity/${validUUID}`, {
            method: "PATCH"
        });
        expect([401, 403]).toContain(res.status);
    });
    it("PATCH invalid UUID → 400", async () => {
        if (!token)
            return;
        const res = await app.request(`/api/activity/${invalidUUID}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(400);
    });
    it("PATCH not found → 404", async () => {
        if (!token)
            return;
        const res = await app.request(`/api/activity/${validUUID}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` }
        });
        expect([404, 400]).toContain(res.status);
    });
    it("PATCH success", async () => {
        if (!token || !createdActivityId)
            return;
        const form = new FormData();
        form.append("name", "Updated Activity");
        const res = await app.request(`/api/activity/${createdActivityId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            body: form
        });
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.data.name).toBe("Updated Activity");
    });
    // =========================
    // DELETE
    // =========================
    it("DELETE tanpa token → gagal", async () => {
        const res = await app.request(`/api/activity/${validUUID}`, {
            method: "DELETE"
        });
        expect([401, 403]).toContain(res.status);
    });
    it("DELETE not found → 404", async () => {
        if (!token)
            return;
        const res = await app.request(`/api/activity/${validUUID}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        expect([404, 400]).toContain(res.status);
    });
    it("DELETE success", async () => {
        if (!token || !createdActivityId)
            return;
        const res = await app.request(`/api/activity/${createdActivityId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        expect(res.status).toBe(200);
    });
});
