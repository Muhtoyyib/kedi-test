// Order-details form state for the cart drawer. Remembers name/phone/area
// between orders (consent is never remembered); pre-fills the referral code
// captured from a ?ref= link.

import {useCallback, useMemo, useState} from "react";
import {clearDetails, emptyDetails, loadDetails, validateDetails, type DetailsField, type OrderDetails} from "@/lib/order/details";
import {getStoredReferralCode} from "@/lib/referral/capture";

export interface OrderDetailsState {
  details: OrderDetails;
  update: (patch: Partial<OrderDetails>) => void;
  fieldError: (f: DetailsField) => string | undefined;
  markTouched: (f: DetailsField) => void;
  /** Reveals all errors (send attempt); returns the field-error map. */
  showErrors: () => Record<string, string>;
  phoneE164: string | null;
  referralApplied: boolean;
  remembered: boolean;
  clearRemembered: () => void;
}

function initialDetails(): OrderDetails {
  const saved = loadDetails();
  const referral = getStoredReferralCode();
  return {
    ...emptyDetails,
    name: saved?.name ?? "",
    phone: saved?.phone ?? "",
    area: saved?.area ?? "",
    areaOther: saved?.areaOther ?? "",
    referralCode: referral ?? "",
  };
}

export function useOrderDetails(): OrderDetailsState {
  const [details, setDetails] = useState<OrderDetails>(initialDetails);
  const [touched, setTouched] = useState<ReadonlySet<DetailsField>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [remembered, setRemembered] = useState(() => loadDetails() !== null);
  const referralApplied = useMemo(
    () => details.referralCode !== "" && details.referralCode === getStoredReferralCode(),
    [details.referralCode]
  );

  const {errors, phoneE164} = validateDetails(details);

  const update = useCallback((patch: Partial<OrderDetails>) => {
    setDetails((d) => ({...d, ...patch}));
  }, []);

  const markTouched = useCallback((f: DetailsField) => {
    setTouched((t) => (t.has(f) ? t : new Set(t).add(f)));
  }, []);

  const fieldError = useCallback((f: DetailsField) => (showAll || touched.has(f) ? errors[f] : undefined), [showAll, touched, errors]);

  const showErrors = useCallback(() => {
    setShowAll(true);
    return errors;
  }, [errors]);

  const clearRemembered = useCallback(() => {
    clearDetails();
    setRemembered(false);
    setDetails((d) => ({...emptyDetails, referralCode: d.referralCode, company: ""}));
  }, []);

  return {details, update, fieldError, markTouched, showErrors, phoneE164, referralApplied, remembered, clearRemembered};
}
