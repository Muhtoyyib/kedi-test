import type {ReactNode} from "react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider} from "@tanstack/react-router";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {NotFoundView} from "./view";

// NotFoundView uses useNavigate + router Links — needs a router.
function renderWithRouter(ui: ReactNode) {
  const root = createRootRoute({component: Outlet});
  const route = createRoute({getParentRoute: () => root, path: "/nope", component: () => ui});
  const shop = createRoute({getParentRoute: () => root, path: "/shop", component: () => null});
  const router = createRouter({
    routeTree: root.addChildren([route, shop]),
    history: createMemoryHistory({initialEntries: ["/nope"]}),
  });
  return {router, ...render(<RouterProvider router={router} />)};
}

beforeEach(() => {
  resetAnalytics();
  markAnalyticsReady();
  window.gtag = vi.fn();
});

describe("NotFoundView", () => {
  it("shows the design copy and all actions", async () => {
    renderWithRouter(<NotFoundView />);
    expect(await screen.findByRole("heading", {name: "We can't find that page"})).toBeInTheDocument();
    expect(screen.getByText(/may no longer be available/)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Go to the shop"})).toHaveAttribute("href", "/shop");
    expect(screen.getByRole("link", {name: "Seminar dates"})).toHaveAttribute("href", "/seminars");
    expect(screen.getByRole("link", {name: "Home"})).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", {name: "Ask on WhatsApp"})).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("search navigates to /shop?q={term}", async () => {
    const {router} = renderWithRouter(<NotFoundView />);
    await screen.findByRole("heading", {name: "We can't find that page"});
    await userEvent.type(screen.getByRole("searchbox", {name: "Search the shop"}), "tea");
    await userEvent.click(screen.getByRole("button", {name: "Search"}));
    expect(router.state.location.pathname).toBe("/shop");
    expect(router.state.location.search).toMatchObject({q: "tea"});
  });

  it("whatsApp action tracks the not_found location", async () => {
    renderWithRouter(<NotFoundView />);
    await screen.findByRole("link", {name: "Ask on WhatsApp"});
    await userEvent.click(screen.getByRole("link", {name: "Ask on WhatsApp"}));
    expect(window.gtag).toHaveBeenCalledWith("event", "whatsapp_chat_click", {location: "not_found"});
  });
});
