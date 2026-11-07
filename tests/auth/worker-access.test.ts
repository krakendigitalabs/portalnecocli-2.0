import { describe, expect, it } from "vitest";
import { isWorkerSuperAdminEmail } from "@/lib/auth/worker-access";

describe("worker super administrator access", () => {
  it("accepts the configured worker super administrator email", () => {
    expect(isWorkerSuperAdminEmail("krakendigitalabs@gmail.com")).toBe(true);
    expect(isWorkerSuperAdminEmail(" KRAKENDIGITALABS@GMAIL.COM ")).toBe(true);
  });

  it("rejects other or missing emails", () => {
    expect(isWorkerSuperAdminEmail("other@portalnecocli.com")).toBe(false);
    expect(isWorkerSuperAdminEmail(null)).toBe(false);
  });
});
