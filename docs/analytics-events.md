# Analytics Events

All tracking goes through one module, `src/lib/analytics/track.ts`:

```ts
track(event: AnalyticsEvent): void
```

- It is a no-op until the visitor accepts cookies, and it sends nothing during prerender (SSR).
- It forwards to GA4 (`gtag('event', …)`) and, where mapped, to the Meta Pixel (`fbq('track', …)`). Clarity records sessions on its own.
- **Never include personal data** (name, phone, address, free text) in any event.
- Event names and params are a TypeScript discriminated union, so a mistyped event fails type-checking.

## Event catalogue

| Event (GA4)                | When                                                      | Params                                                                                          | Meta Pixel                                             |
| -------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `view_item_list`           | Shop or category grid renders (once per view)             | `item_list_id` (`shop` \| category slug \| `home_featured` \| `related`), `items` (ids, max 20) | —                                                      |
| `select_item`              | Product card link tapped                                  | `item_list_id`, `item_id`                                                                       | —                                                      |
| `view_item`                | Product page viewed                                       | `item_id`, `item_category`, `price` (or omitted)                                                | `ViewContent` (`content_ids`, `content_type: product`) |
| `add_to_cart`              | Add to cart                                               | `item_id`, `quantity`, `price`, `location` (`card` \| `pdp` \| `sticky_bar`)                    | `AddToCart`                                            |
| `remove_from_cart`         | Item removed or quantity set to 0                         | `item_id`                                                                                       | —                                                      |
| `view_cart`                | Cart drawer opened                                        | `item_count`, `value`                                                                           | —                                                      |
| `begin_checkout`           | First focus on the cart's details form                    | `item_count`, `value`                                                                           | `InitiateCheckout`                                     |
| `whatsapp_order_sent`      | "Send order on WhatsApp" tapped and the beacon was queued | `order_id`, `item_count`, `value`, `has_referral`                                               | `Lead` (`content_category: order`)                     |
| `whatsapp_chat_click`      | Any non-order WhatsApp link tapped                        | `location` (see the location list below), `context` (product id, search term or page path)      | `Contact`                                              |
| `seminar_register_click`   | Register button tapped or Luma embed opened               | `seminar_id`, `location` (see below)                                                            | `Lead` (`content_category: seminar`)                   |
| `calendar_subscribe_click` | "Get notified of every seminar" tapped                    | —                                                                                               | —                                                      |
| `form_submit`              | A form posted successfully                                | `form_id` (`contact` \| `business_interest` \| `referral_code` \| `seminar_interest`)           | `Lead` (`content_category: form_id`)                   |
| `form_error`               | A form failed (validation or network)                     | `form_id`, `reason` (`validation` \| `network` \| `rate_limited` \| `server`)                   | —                                                      |
| `referral_code_created`    | Refer page generated a code                               | —                                                                                               | —                                                      |
| `referral_link_shared`     | Share or copy tapped                                      | `method` (`whatsapp` \| `copy` \| `native_share`)                                               | —                                                      |
| `seminar_share`            | Seminar "Share with a friend" tapped                      | `method` (`native_share` \| `whatsapp`)                                                         | —                                                      |
| `referral_landing`         | Visitor arrived with `?ref=`                              | —                                                                                               | —                                                      |
| `search`                   | Shop search submitted (debounced 800 ms, min 2 chars)     | `search_term` (lower-cased, max 40 chars)                                                       | `Search`                                               |
| `filter_category`          | Category chip selected                                    | `category`                                                                                      | —                                                      |
| `video_play`               | Facade tapped on any video                                | `provider`, `location`                                                                          | —                                                      |
| `article_read`             | 75% of an article scrolled                                | `slug`, `topic`                                                                                 | —                                                      |
| `phone_click`              | `tel:` link tapped                                        | `location`                                                                                      | —                                                      |
| `outbound_social`          | Social profile link tapped                                | `network`                                                                                       | —                                                      |

## Location values

One union type, `AnalyticsLocation`, in `src/lib/analytics/events.ts`. Add a value here first, then use it.

| Event                    | Allowed `location` values                                                                                                                                                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `whatsapp_chat_click`    | `header`, `mobile_menu`, `floating`, `footer`, `hero`, `final_cta`, `pdp_ask`, `out_of_stock`, `shop_no_results`, `shop_help`, `article_cta`, `story_cta`, `business`, `seminar_faq`, `faq`, `contact`, `about_cta`, `not_found` |
| `seminar_register_click` | `home_hero`, `home_banner`, `seminar_hero`, `upcoming_list`, `article_cta`, `business_invite`                                                                                                                                    |
| `add_to_cart`            | `card`, `pdp`, `sticky_bar`                                                                                                                                                                                                      |
| `phone_click`            | `mobile_menu`, `faq`, `contact`, `footer`                                                                                                                                                                                        |
| `video_play`             | `learn_hub`, `stories`, `article`, `seminar_highlights`                                                                                                                                                                          |

## GA4 setup

- Key events (conversions): `whatsapp_order_sent`, `seminar_register_click`, `form_submit`, `whatsapp_chat_click`.
- Custom dimensions: `location`, `item_list_id`, `form_id`, `has_referral`.
- UTM parameters are captured on landing (change `07`) and attached to orders and forms in the Sheet. GA4 also reads them natively.

## Meta Pixel

- Standard events only (listed above), so Click-to-WhatsApp and seminar campaigns can optimise for `Lead`.
- Advanced matching **off** (no phone or email hashing).
