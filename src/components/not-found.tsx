import {Link} from "@tanstack/react-router";

export function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>Sorry, this page doesn't exist. Try the shop or head back home.</p>
      <p>
        <Link to="/">Home</Link> · <a href="/shop">Shop</a>
        {/* /shop is a plain anchor until change 11 adds the route */}
      </p>
    </main>
  );
}
