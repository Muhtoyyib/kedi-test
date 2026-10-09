## Layout

`rounded-panel bg-brand-soft p-6 md:p-8`, title `text-h3` "Want to go further?", then three options (stacked on mobile, 3 columns on md), each with an icon circle, a short line and an action:

| Icon           | Line                                                        | Action                                                                                                         |
| -------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `Presentation` | "Ask questions at our free seminar{: next date}"            | `Button primary sm` "Register free" → `/seminars#register` (`seminar_register_click {location:"article_cta"}`) |
| `ShoppingBag`  | "See products for {category name}" or "Browse our products" | `Button secondary sm` "View products" → `/shop/{relatedCategory}` or `/shop`                                   |
| `WhatsAppIcon` | "Not sure what fits your routine?"                          | `Button whatsapp sm` "Chat with us" (`location:"article_cta"`, context slug)                                   |

The next-seminar date is "on Saturday, 12 October" when a seminar is scheduled; otherwise the line has no date.
