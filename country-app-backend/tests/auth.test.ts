import { describe, it } from "node:test";
import request from "supertest";
const app = require("../src/server"); 

describe("Auth API Tests", () => {
  it("should register a user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should not register with missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
    toHaveProperty(property: string) {
      if (!Object.prototype.hasOwnProperty.call(actual, property)) {
        throw new Error(`Expected object to have property '${property}'`);
      }
    },
  };
}

function expectStatus(status: number) {
  throw new Error("Function not implemented.");
}
