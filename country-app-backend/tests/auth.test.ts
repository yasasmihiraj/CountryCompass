// tests/auth.test.ts
import request from "supertest";
import app from "../src/app";

// Add this line to include Jest's global types
import "jest";

describe("Auth API Tests", () => {
  it("should register a user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail registration with missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should not allow duplicate registration", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Duplicate",
      email: "duplicate@example.com",
      password: "pass123",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Duplicate Again",
      email: "duplicate@example.com",
      password: "pass123",
    });

    expect(res.status).toBe(409); // adjust based on your error handling
    expect(res.body).toHaveProperty("message");
  });

  it("should login user with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login Test",
      email: "login@test.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@test.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@test.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
