## Layout and copy

`SiteSection tone="brand-soft"`, `Gift` icon in a sun circle.

- Eyebrow: "Refer a friend"
- h1: "Share the care. You both get rewarded."
- Reward cards (two `Card`s side by side, md; stacked on mobile):
  - "Your friend gets" → `{referralFriendRewardText}` (`text-h3 text-ink`) + "on their first order"
  - "You get" → `{referralRewardText}` + "when their first order is paid"
- `Button primary lg` "Get your link" → `#get-your-code`.
- If reward texts are missing: h1 "Share the care with a friend" and the line "Ask us about our current referral reward." (reward cards hidden).
