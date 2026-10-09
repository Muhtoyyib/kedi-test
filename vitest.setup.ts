import "@testing-library/jest-dom/vitest";
import {cleanup} from "@testing-library/react";
import {afterEach, vi} from "vite-plus/test";

const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: function (key: string) {
      return store[key] || null;
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem: function (key: string) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

class MockIntersectionObserver {
  root = null;
  rootMargin = "";
  thresholds = [0];

  disconnect() {
    return undefined;
  }

  observe() {
    return undefined;
  }

  takeRecords() {
    return [];
  }

  unobserve() {
    return undefined;
  }
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.clearAllMocks();
});
