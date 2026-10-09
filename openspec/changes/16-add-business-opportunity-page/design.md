## Decisions

- Route `src/routes/business-opportunity.tsx`. Meta: "Become a KEDI distributor | {Brand}"; description "Learn how KEDI's independent distributor programme works and the training and support we give new distributors in {City}. No income promises: just honest information."
- All programme facts come from `content/business.ts` (client-approved, KEDI-consistent). Components must not add income language.
- The content lint (change 08) covers `content/business.ts` with an extra banned list: "income", "earn", "₦" followed by digits, "per month", "financial freedom", "passive", "rich", "millionaire", "car", "travel", "be your own boss", "guarantee". Exceptions: the exact earnings disclaimer text. The list applies to `content/business.ts` only. Business FAQ items in `content/faq.ts` have to mention earnings in order to deny them, so they are checked by the manual copy review (task 3.2) instead.
- Imagery: training/seminar photos only. No cash, cars or luxury.
