// tests/auth.integration.test.ts
import request from "supertest";
import app from "../src/app";

describe("Auth Integration Tests", () => {
  let token: string;

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it("should login an existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should not login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "wrongpass",
      });

    expect(res.status).toBe(401);
  });
});
