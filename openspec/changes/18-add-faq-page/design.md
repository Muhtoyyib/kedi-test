## Decisions

- Route `src/routes/faq.tsx`. Meta: "Frequently asked questions | {Brand}"; description "How to order KEDI products on WhatsApp, payment, delivery in {City}, returns, seminars and more."
- JSON-LD: one `FAQPage` with all items on the page (answers as plain text, tokens resolved).
- Group order and labels: Ordering · Payment · Delivery · Returns · Products · Seminars · Referrals & rewards · Becoming a distributor.

### Seed items (in `content/faq.ts`, besides seminar and business items added by 13 and 16)

| Group     | Question                                        | Answer (tokens in braces)                                                                                                                                                                                              |
| --------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| products  | Are your products genuine?                      | Yes. We're an independent KEDI distributor and buy through KEDI's official distribution channel. Each product shows its NAFDAC number where applicable.                                                                |
| ordering  | How do I order?                                 | Add products to your cart and tap "Send order on WhatsApp". Your order arrives in our WhatsApp with an order number. We confirm stock and the delivery fee, then send payment details. You can also simply message us. |
| ordering  | Can I order without using the website?          | Yes. Message us on WhatsApp with what you need.                                                                                                                                                                        |
| payment   | How do I pay?                                   | By bank transfer to our business account: {bank}. We only send payment details from our official WhatsApp number. Card payment links are available on request.                                                         |
| payment   | When do I pay?                                  | After we confirm your order and delivery fee on WhatsApp. We dispatch once payment is received.                                                                                                                        |
| delivery  | Where do you deliver and how long does it take? | {deliveryNote} We deliver across [City] by dispatch rider and nationwide by courier. See [delivery fees and times](/delivery-and-returns).                                                                             |
| delivery  | Can I pick up my order?                         | Yes, from {pickupAddress} during our opening hours: {openingHours}.                                                                                                                                                    |
| returns   | Can I return a product?                         | See our [delivery and returns policy](/delivery-and-returns). If something is wrong with your order, message us within 48 hours of delivery.                                                                           |
| products  | Which product is right for me?                  | Tell us about your routine on WhatsApp or come to a free seminar. We'll explain the options. For medical conditions, please speak to a doctor first.                                                                   |
| products  | Can I take more than one product?               | Ask us on WhatsApp. We'll check the usage instructions with you. If you take medication, speak to your doctor first.                                                                                                   |
| referrals | How does Refer a Friend work?                   | Share your personal link. When your friend places their first paid order, you get {referralReward} and they get {referralFriendReward}. [Get your link](/refer).                                                       |
| referrals | Do you have a loyalty reward?                   | {loyaltyText}                                                                                                                                                                                                          |

An item whose required token is missing (e.g. no bank details) is **omitted** rather than shown with a gap; `getFaqs` handles this.
