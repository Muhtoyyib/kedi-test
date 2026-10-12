import {useState} from "react";
import {Lightbulb} from "lucide-react";
import {track} from "@/lib/analytics/track";
import {referralShareMessage} from "@/lib/referral/link";
import {useToast} from "@/components/ui/toast";
import {Button} from "@/components/ui/button";

interface SharePanelProps {
  code: string;
  link: string;
  friendReward: string;
}

// refer/share-panel design: WhatsApp share, copy link, copy code, native
// share when supported, plus the tip and the message preview.
export function SharePanel({code, link, friendReward}: SharePanelProps) {
  const toast = useToast();
  const message = referralShareMessage(code, friendReward);

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.show({message: `${label} copied`});
      track({event: "referral_link_shared", method: "copy"});
    } catch {
      // clipboard unavailable — the text stays selectable
    }
  }

  return (
    <div className="mt-4 grid gap-3">
      <Button
        variant="whatsapp"
        size="lg"
        fullWidth
        href={`https://wa.me/?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener"
        onClick={() => track({event: "referral_link_shared", method: "whatsapp"})}
      >
        Share on WhatsApp
      </Button>
      <Button variant="secondary" fullWidth onClick={() => void copy(link, "Link")}>
        Copy link
      </Button>
      <Button variant="ghost" fullWidth onClick={() => void copy(code, "Code")}>
        Copy code
      </Button>
      <NativeShare message={message} />
      <p className="flex items-start gap-2 text-sm text-text-muted">
        <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Tip: post your link on your WhatsApp Status. Friends who are interested will tap it.
      </p>
      <details className="text-sm text-text-muted">
        <summary className="cursor-pointer font-semibold text-text-body">See the message</summary>
        <p className="mt-2 rounded-card bg-surface p-3 whitespace-pre-wrap">{message}</p>
      </details>
    </div>
  );
}

function NativeShare({message}: {message: string}) {
  const [supported] = useState(() => typeof navigator !== "undefined" && typeof navigator.share === "function");
  if (!supported) return null;
  return (
    <Button
      variant="ghost"
      fullWidth
      onClick={() => {
        void navigator
          .share({text: message})
          .then(() => track({event: "referral_link_shared", method: "native_share"}))
          .catch(() => undefined);
      }}
    >
      More ways to share
    </Button>
  );
}
