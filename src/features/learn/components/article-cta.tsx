import {Presentation, ShoppingBag} from "lucide-react";
import type {ReactNode} from "react";
import type {Article, Category, Seminar} from "@/lib/catalog/types";
import {track} from "@/lib/analytics/track";
import {formatSeminarDate} from "@/lib/format/seminar-date";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {Button} from "@/components/ui/button";
import {WhatsAppIcon} from "@/components/ui/whatsapp-icon";

interface CtaOptionProps {
  icon: ReactNode;
  line: string;
  children: ReactNode;
}

function CtaOption({icon, line, children}: CtaOptionProps) {
  return (
    <div className="flex flex-col items-start gap-3">
      <span className="flex size-10 items-center justify-center rounded-full bg-brand text-canvas [&_svg]:size-5" aria-hidden="true">
        {icon}
      </span>
      <p className="text-base text-ink">{line}</p>
      {children}
    </div>
  );
}

interface ArticleCtaProps {
  article: Article;
  nextSeminar?: Seminar;
  category?: Category;
}

// The standard end-of-article CTA trio (learn/article-cta spec).
export function ArticleCta({article, nextSeminar, category}: ArticleCtaProps) {
  const seminarLine = `Ask questions at our free seminar${nextSeminar ? ` on ${formatSeminarDate(nextSeminar.startsAt)}` : ""}`;
  return (
    <div className="mt-10 rounded-panel bg-brand-soft p-6 md:p-8">
      <h2 className="text-h3 text-text-heading">Want to go further?</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <CtaOption icon={<Presentation />} line={seminarLine}>
          <Button
            size="sm"
            href="/seminars#register"
            onClick={() => nextSeminar && track({event: "seminar_register_click", seminar_id: nextSeminar.id, location: "article_cta"})}
          >
            Register free
          </Button>
        </CtaOption>
        <CtaOption icon={<ShoppingBag />} line={category ? `See products for ${category.name}` : "Browse our products"}>
          <Button variant="secondary" size="sm" href={category ? `/shop/${category.slug}` : "/shop"}>
            View products
          </Button>
        </CtaOption>
        <CtaOption icon={<WhatsAppIcon />} line="Not sure what fits your routine?">
          <Button
            variant="whatsapp"
            size="sm"
            href={buildWhatsAppLink(generalChatMessage())}
            target="_blank"
            rel="noopener"
            onClick={() => track({event: "whatsapp_chat_click", location: "article_cta", context: article.slug})}
          >
            Chat with us
          </Button>
        </CtaOption>
      </div>
    </div>
  );
}
