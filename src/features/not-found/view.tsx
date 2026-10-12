import {useState, type FormEvent} from "react";
import {useNavigate} from "@tanstack/react-router";
import {SearchX} from "lucide-react";
import {SiteLayout} from "@/components/layout/site/layout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {track} from "@/lib/analytics/track";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";

// Friendly 404 (system-pages/not-found design): search-the-shop box, key
// links and WhatsApp so a broken or outdated link doesn't lose the visitor.
export function NotFoundView() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    void navigate({to: "/shop", search: {q: term || undefined, sort: undefined}});
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto flex size-18 items-center justify-center rounded-full bg-brand-soft">
          <SearchX className="size-9 text-brand-strong" aria-hidden="true" />
        </div>
        <h1 className="text-h1 mt-6 text-text-heading">We can't find that page</h1>
        <p className="text-lead mt-3 text-text-body">
          It may have moved, or the product may no longer be available. Try searching the shop or ask us on WhatsApp.
        </p>
        <form onSubmit={handleSearch} className="mt-8 flex gap-2" role="search">
          <label htmlFor="not-found-search" className="sr-only">
            Search the shop
          </label>
          <Input id="not-found-search" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search products" />
          <Button type="submit" className="shrink-0">
            Search
          </Button>
        </form>
        <NotFoundActions />
      </section>
    </SiteLayout>
  );
}

function NotFoundActions() {
  return (
    <>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button href="/shop" variant="secondary">
          Go to the shop
        </Button>
        <Button href="/seminars" variant="secondary">
          Seminar dates
        </Button>
        <Button href="/" variant="link">
          Home
        </Button>
      </div>
      <div className="mt-6">
        <Button
          variant="whatsapp"
          href={buildWhatsAppLink(generalChatMessage())}
          target="_blank"
          onClick={() => track({event: "whatsapp_chat_click", location: "not_found"})}
        >
          Ask on WhatsApp
        </Button>
      </div>
    </>
  );
}
