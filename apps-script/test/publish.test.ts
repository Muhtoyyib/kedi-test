import {describe, expect, it} from "vitest";
import {deployErrorMessage, handlePublishResult, issuesDialogText, parsePublishResult} from "../src/publish.ts";
import {TABS} from "../src/schema.ts";
import {Issues} from "../src/validate.ts";
import {MemoryStore} from "./fakes.ts";

const NOW = new Date(2026, 9, 10, 12);

describe("deployErrorMessage", () => {
  it("translates GitHub status codes into plain messages", () => {
    expect(deployErrorMessage(401)).toBe("GitHub token expired — contact the developer to renew it.");
    expect(deployErrorMessage(404)).toContain("GITHUB_REPO");
    expect(deployErrorMessage(500)).toBe("GitHub returned 500.");
  });
});

describe("issuesDialogText", () => {
  it("lists errors and warnings for the client dialog", () => {
    const issues = new Issues();
    issues.error("Products", 3, "KD-P001", "missing price");
    issues.warn("Stories", 5, "ST-001", "no photo consent");
    const text = issuesDialogText(issues.list);
    expect(text).toContain("row 3");
    expect(text).toContain("missing price");
    expect(text).toContain("no photo consent");
  });

  it("says everything looks good when there are no issues", () => {
    expect(issuesDialogText([])).toContain("Everything looks good");
  });
});

describe("parsePublishResult", () => {
  it("accepts a valid result and rejects bad statuses", () => {
    expect(parsePublishResult({status: "success", runUrl: "https://github.com/x/runs/1", commit: "abc", message: ""})).toMatchObject({
      status: "success",
    });
    expect(parsePublishResult({status: "weird"})).toBeNull();
    expect(parsePublishResult("nope")).toBeNull();
  });
});

describe("handlePublishResult", () => {
  const logRow = {
    requested_at: "2026-10-10T11:00:00.000Z",
    requested_by: "menu",
    run_url: "",
    status: "Requested",
    finished_at: "",
    commit: "",
    message: "",
  };

  it("marks the open run Live on success", () => {
    const store = new MemoryStore({publishLog: [{...logRow}]});
    handlePublishResult(store, {status: "success", runUrl: "https://github.com/x/runs/1", commit: "abc123", message: "deployed"}, NOW);
    const row = store.table(TABS.publishLog).rows[0];
    expect(row.rec.status).toBe("Live");
    expect(row.rec.run_url).toContain("runs/1");
    expect(row.rec.finished_at).toBe(NOW.toISOString());
  });

  it("marks the open run Failed on failure", () => {
    const store = new MemoryStore({publishLog: [{...logRow}]});
    handlePublishResult(store, {status: "failure", runUrl: "", commit: "", message: "build error"}, NOW);
    expect(store.table(TABS.publishLog).rows[0].rec.status).toBe("Failed");
  });

  it("ignores results when no run is open", () => {
    const store = new MemoryStore({publishLog: [{...logRow, status: "Live"}]});
    handlePublishResult(store, {status: "success", runUrl: "x", commit: "", message: ""}, NOW);
    expect(store.table(TABS.publishLog).rows[0].rec.status).toBe("Live");
  });
});
