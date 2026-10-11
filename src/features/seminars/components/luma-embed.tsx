import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {onRegistrationLoad} from "../register-load";

const WATCHDOG_MS = 10_000;

interface LumaEmbedProps {
  eventId: string;
  topic: string;
  lumaUrl: string;
  onError: () => void;
}

// The Luma iframe is ~400 KB of third-party JS — it only mounts after the
// visitor taps "Register free" (here or via the hero's cross-section signal)
// or arrives at /seminars#register. A 10 s watchdog falls back to the
// interest form if the frame never loads.
export function LumaEmbed({eventId, topic, lumaUrl, onError}: LumaEmbedProps) {
  // Auto-loads when arriving at /seminars#register (prerender-safe).
  const [requested, setRequested] = useState(() => typeof window !== "undefined" && window.location.hash === "#register");
  const [loaded, setLoaded] = useState(false);
  const loadedRef = useRef(false);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => onRegistrationLoad(() => setRequested(true)), []);

  useEffect(() => {
    if (!requested || loaded) return;
    const timer = window.setTimeout(() => {
      if (!loadedRef.current) onErrorRef.current();
    }, WATCHDOG_MS);
    return () => window.clearTimeout(timer);
  }, [requested, loaded]);

  if (!requested) {
    return (
      <div className="flex min-h-130 flex-col items-start justify-center gap-4 rounded-panel border border-line bg-surface p-6">
        <h2 className="text-h2 text-text-heading">Register for {topic}</h2>
        <p className="text-base text-text-body">It takes about a minute. You'll get a confirmation email and a WhatsApp reminder.</p>
        <Button variant="primary" size="lg" onClick={() => setRequested(true)}>
          Register free
        </Button>
      </div>
    );
  }
  return (
    <iframe
      src={`https://lu.ma/embed/event/${eventId}/simple`}
      title={`Register for ${topic}`}
      width="100%"
      height="600"
      className="rounded-panel border border-line"
      allow="fullscreen; payment"
      loading="eager"
      onLoad={() => {
        loadedRef.current = true;
        setLoaded(true);
      }}
      data-luma-url={lumaUrl}
    />
  );
}
