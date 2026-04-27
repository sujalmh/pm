import { describe, it, expect } from "vitest";
import { isManagerOrAdmin } from "./permissions";

describe("isManagerOrAdmin", () => {
  it("allows ADMIN", () => {
    expect(isManagerOrAdmin("ADMIN")).toBe(true);
  });

  it("allows MANAGER", () => {
    expect(isManagerOrAdmin("MANAGER")).toBe(true);
  });

  it("denies MEMBER", () => {
    expect(isManagerOrAdmin("MEMBER")).toBe(false);
  });

  it("denies unknown roles", () => {
    expect(isManagerOrAdmin("GUEST")).toBe(false);
    expect(isManagerOrAdmin("")).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(isManagerOrAdmin("admin")).toBe(false);
    expect(isManagerOrAdmin("manager")).toBe(false);
    expect(isManagerOrAdmin("Admin")).toBe(false);
  });
});
