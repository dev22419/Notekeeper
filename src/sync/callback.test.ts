import { describe, expect, it } from "vitest";
import { parseAuthCallback } from "./callback";

const at = (path: string) => parseAuthCallback(`https://notes.example${path}`);

describe("parseAuthCallback", () => {
  it("ignores URLs without sign-in parameters", () => {
    expect(at("/")).toBeNull();
    expect(at("/work/launch-plan?card=c-welcome")).toBeNull();
    expect(at("/#section")).toBeNull();
  });

  it("takes the PKCE code and keeps the page the link returned to", () => {
    expect(at("/work?code=abc123")).toEqual({ callback: { code: "abc123", error: undefined }, cleanUrl: "/work" });
  });

  it("keeps the app's own query parameters", () => {
    expect(at("/work?card=c-welcome&code=abc123")?.cleanUrl).toBe("/work?card=c-welcome");
  });

  it("reports an expired link from the query", () => {
    const parsed = at("/?error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid");
    expect(parsed).toEqual({ callback: { code: undefined, error: "otp_expired" }, cleanUrl: "/" });
  });

  it("reports an error that arrives in the hash, and clears the hash", () => {
    const parsed = at("/work#error=access_denied&error_code=otp_expired&error_description=expired");
    expect(parsed).toEqual({ callback: { code: undefined, error: "otp_expired" }, cleanUrl: "/work" });
  });

  it("leaves an ordinary hash alone", () => {
    expect(at("/work?code=abc#top")?.cleanUrl).toBe("/work#top");
  });
});
