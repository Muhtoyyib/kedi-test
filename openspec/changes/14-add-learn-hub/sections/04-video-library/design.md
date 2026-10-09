## Layout

- `SiteSection tone="surface"`, h2 "Watch and learn".
- Mobile: horizontal scroll of 9:16 (TikTok/Shorts) or 16:9 (YouTube) facades at 70% width; md: grid of 3 (16:9) or 4 (9:16).
- Each: facade, title (`font-semibold`), duration (`text-sm text-text-muted`).
- Link: "More videos on YouTube" → `socials.youtube`; "Follow us on TikTok" → `socials.tiktok`.
- Tapping a facade loads that single iframe only (tracks `video_play {provider, location:"learn_hub"}`).
