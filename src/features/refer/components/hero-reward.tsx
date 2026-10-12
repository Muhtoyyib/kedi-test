import {Gift} from "lucide-react";
import {getSettings} from "@/lib/catalog/settings";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";

// refer/hero-reward design: both rewards from the Sheet; when unset the
// headline falls back and the cards hide.
export function HeroReward() {
  const {referralRewardText, referralFriendRewardText} = getSettings();
  const rewardsSet = Boolean(referralRewardText && referralFriendRewardText);
  return (
    <SiteSection tone="brand-soft">
      <span className="flex size-14 items-center justify-center rounded-full bg-sun text-ink">
        <Gift className="size-7" aria-hidden="true" />
      </span>
      <SectionHeader
        as="h1"
        eyebrow="Refer a friend"
        title={rewardsSet ? "Share the care. You both get rewarded." : "Share the care with a friend"}
        className="mt-5"
      />
      {rewardsSet ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <p className="text-sm font-semibold tracking-wide text-text-muted uppercase">Your friend gets</p>
            <p className="mt-2 text-h3 text-ink">{referralFriendRewardText}</p>
            <p className="mt-1 text-base text-text-body">on their first order</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-semibold tracking-wide text-text-muted uppercase">You get</p>
            <p className="mt-2 text-h3 text-ink">{referralRewardText}</p>
            <p className="mt-1 text-base text-text-body">when their first order is paid</p>
          </Card>
        </div>
      ) : (
        <p className="mt-4 max-w-3xl text-lead text-text-body">Ask us about our current referral reward.</p>
      )}
      <Button variant="primary" size="lg" href="#get-your-code" className="mt-8">
        Get your link
      </Button>
    </SiteSection>
  );
}
