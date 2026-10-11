import {useState} from "react";
import type {Seminar} from "@/lib/catalog/types";
import {StepList} from "@/components/marketing/step-list";
import {SiteSection} from "@/components/marketing/site-section";
import {LumaEmbed} from "./luma-embed";
import {SeminarInterestForm} from "./interest-form";

const NEXT_STEPS = [
  {title: "Register here. It's free."},
  {title: "Save our WhatsApp number when we message you, so you get the link and reminders."},
  {title: "Get a reminder the day before and an hour before."},
  {title: "Join us, ask anything, and take home practical tips."},
];

// #register — click-to-load Luma embed (or the interest form when Luma is
// unavailable) beside "What happens next".
export function Registration({seminar}: {seminar?: Seminar}) {
  const [embedFailed, setEmbedFailed] = useState(false);
  const showForm = !seminar?.lumaEventId || embedFailed;

  return (
    <SiteSection tone="canvas" id="register" className="scroll-mt-24" aria-labelledby="register-heading">
      <h2 id="register-heading" className="sr-only">
        Register
      </h2>
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          {showForm ? (
            <SeminarInterestForm seminarId={seminar?.id ?? null} />
          ) : (
            <LumaEmbed eventId={seminar.lumaEventId} topic={seminar.topic} lumaUrl={seminar.lumaUrl} onError={() => setEmbedFailed(true)} />
          )}
          {seminar ? (
            <p className="mt-3 text-sm text-text-muted">
              <a
                href={seminar.lumaUrl}
                target="_blank"
                rel="noopener"
                className="font-semibold text-brand-strong underline underline-offset-2"
              >
                Or open the registration page
              </a>
            </p>
          ) : null}
          <p className="mt-4 text-sm text-text-muted">
            By registering you agree to receive WhatsApp messages about this seminar. Reply STOP anytime.{" "}
            <a href="/privacy" className="font-semibold underline underline-offset-2">
              Privacy policy
            </a>
          </p>
        </div>
        <div className="md:col-span-5">
          <h3 className="text-h3 text-text-heading">What happens next</h3>
          <StepList steps={NEXT_STEPS} className="mt-5" />
        </div>
      </div>
    </SiteSection>
  );
}
