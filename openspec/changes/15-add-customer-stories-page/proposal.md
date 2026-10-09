## Why

Testimonials about service and experience are strong social proof for new buyers (plan §3.3 page 6). They must be published only with written consent and must not make medical claims.

## What Changes

`/stories` → `src/features/stories/view.tsx`:

| #   | Folder                             | Section                                                             |
| --- | ---------------------------------- | ------------------------------------------------------------------- |
| 1   | `sections/01-intro`                | h1, intro, the consent/no-medical-claims note                       |
| 2   | `sections/02-written-stories`      | All written stories (`StoryCard`), with longer text where available |
| 3   | `sections/03-video-stories`        | Video testimonials (facades)                                        |
| 4   | `sections/04-share-your-story-cta` | Invite customers to share their experience on WhatsApp              |

## Capabilities

### New Capabilities

- `stories/page`, `stories/intro`, `stories/written-stories`, `stories/video-stories`, `stories/share-your-story`.

## Impact

- Depends on 01, 02, 03 (consent rules in the Sheet check), 04 (`getStories`), 08 (`RichText`), `StoryCard` (10/06).
- Client inputs: `Stories` rows in the Sheet with consent dates (and photo/video consent where used).
