import {describe, expect, it} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  notFound,
  Outlet,
  RouterProvider,
  useParams,
} from "@tanstack/react-router";
import {siteConfig} from "@/lib/site-config";
import {ThankYouLayout} from "./thank-you-layout";
import {getThankYouVariant} from "./variants";

const fixture = {
  title: "Message received",
  message: "We'll reply soon.",
  steps: [{title: "Step one."}, {title: "Step two."}],
  primary: {label: "Browse products", href: "/shop", variant: "primary" as const},
};

describe("ThankYouLayout", () => {
  it("moves focus to the h1 on load and renders steps + actions", () => {
    render(<ThankYouLayout {...fixture} />);
    const h1 = screen.getByRole("heading", {level: 1, name: "Message received"});
    expect(document.activeElement).toBe(h1);
    expect(screen.getByText("Step one.")).toBeInTheDocument();
    expect(screen.getByText("Step two.")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Browse products"})).toHaveAttribute("href", "/shop");
    expect(screen.getByRole("link", {name: "Back to home"})).toHaveAttribute("href", "/");
  });
});

describe("thank-you variants", () => {
  it("contact: asks the visitor to save the number, primary → /shop", () => {
    const v = getThankYouVariant("contact")!;
    expect(v.title).toBe("Message received");
    expect(v.steps[0]!.title).toContain(siteConfig.whatsapp.display);
    expect(v.primary).toMatchObject({label: "Browse products", href: "/shop"});
  });

  it("business: sun seminar action with the no-pressure step", () => {
    const v = getThankYouVariant("business")!;
    expect(v.title).toBe("Thanks for your interest");
    expect(v.steps).toHaveLength(3);
    expect(v.steps[2]!.title).toContain("no pressure");
    expect(v.primary).toMatchObject({label: "See seminar dates", href: "/seminars", variant: "sun"});
  });

  it("referral and seminar variants have their exact titles and actions", () => {
    expect(getThankYouVariant("referral")!).toMatchObject({
      title: "Your link is ready",
      primary: {label: "Back to my link", href: "/refer"},
    });
    expect(getThankYouVariant("seminar")!).toMatchObject({
      title: "You're on the list",
      primary: {label: "Browse products", href: "/shop"},
    });
  });

  it("unknown kinds return null so the route can throw notFound", () => {
    expect(getThankYouVariant("nope")).toBeNull();
  });
});

// Mini router mirroring the real route's kind-validation semantics.
const rootRoute = createRootRoute({component: Outlet});
const thankYouRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/thank-you/$kind",
  loader: ({params}) => {
    if (!getThankYouVariant(params.kind)) throw notFound();
    return null;
  },
  component: function ThankYouPage() {
    const {kind} = useParams({from: "/thank-you/$kind"});
    const variant = getThankYouVariant(kind);
    if (!variant) throw notFound();
    return <ThankYouLayout {...variant} />;
  },
});

function renderRoute(path: string) {
  const router = createRouter({
    routeTree: rootRoute.addChildren([thankYouRoute]),
    history: createMemoryHistory({initialEntries: [path]}),
    defaultNotFoundComponent: () => <p>Page not found</p>,
  });
  return render(<RouterProvider router={router} />);
}

describe("/thank-you/$kind route", () => {
  it("renders each variant's title and primary action", async () => {
    for (const [kind, title, action] of [
      ["contact", "Message received", "Browse products"],
      ["business", "Thanks for your interest", "See seminar dates"],
      ["referral", "Your link is ready", "Back to my link"],
      ["seminar", "You're on the list", "Browse products"],
    ] as const) {
      const {unmount} = renderRoute(`/thank-you/${kind}`);
      expect(await screen.findByRole("heading", {level: 1, name: title})).toBeInTheDocument();
      expect(screen.getByRole("link", {name: action})).toBeInTheDocument();
      unmount();
    }
  });

  it("unknown kinds show the not-found page", async () => {
    renderRoute("/thank-you/nope");
    expect(await screen.findByText("Page not found")).toBeInTheDocument();
  });
});
