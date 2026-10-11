import {describe, expect, it, vi} from "vite-plus/test";
import {submitForm} from "../forms/submit";

const okResponse = () => new Response(JSON.stringify({ok: true}), {status: 200});

describe("submitForm", () => {
  it("posts {type, payload} as JSON text and maps ok responses", async () => {
    const post = vi.fn().mockResolvedValue(okResponse());
    const result = await submitForm("seminar_interest", {name: "Ada", seminarId: "SEM-1"}, {url: "https://x.test", post});
    expect(post).toHaveBeenCalledWith(
      "https://x.test",
      JSON.stringify({type: "seminar_interest", payload: {name: "Ada", seminarId: "SEM-1"}})
    );
    expect(result).toEqual({ok: true});
  });

  it("maps {ok:false, code} responses to the code", async () => {
    const post = vi.fn().mockResolvedValue(new Response(JSON.stringify({ok: false, code: "rate_limited"}), {status: 200}));
    expect(await submitForm("t", {}, {url: "https://x.test", post})).toEqual({ok: false, code: "rate_limited"});
  });

  it("maps non-ok HTTP and network failures", async () => {
    const post = vi.fn().mockResolvedValue(new Response("bad", {status: 500}));
    expect(await submitForm("t", {}, {url: "https://x.test", post})).toEqual({ok: false, code: "http_500"});
    post.mockRejectedValue(new Error("offline"));
    expect(await submitForm("t", {}, {url: "https://x.test", post})).toEqual({ok: false, code: "network"});
  });

  it("returns no_endpoint when the Apps Script URL is not configured", async () => {
    const post = vi.fn();
    expect(await submitForm("t", {}, {url: "", post})).toEqual({ok: false, code: "no_endpoint"});
    expect(post).not.toHaveBeenCalled();
  });
});
