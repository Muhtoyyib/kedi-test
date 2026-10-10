import {useRef} from "react";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {PhoneInput} from "@/components/ui/phone-input";
import {Select} from "@/components/ui/select";
import {track} from "@/lib/analytics/track";
import {getDeliveryAreas} from "@/lib/catalog/settings";
import {formatNaira} from "@/lib/format/naira";
import {OTHER_AREA, type DetailsField} from "@/lib/order/details";
import type {OrderDetailsState} from "./use-order-details";

export const fieldId = (f: DetailsField) => `order-${f}`;
const FIELDS: DetailsField[] = ["name", "phone", "area", "areaOther", "referralCode"];

export function firstInvalidField(errors: Partial<Record<DetailsField, string>>): DetailsField | null {
  return FIELDS.find((f) => errors[f]) ?? null;
}

interface FieldProps {
  state: OrderDetailsState;
  onFirstFocus: () => void;
}

// "Your details" inside the cart drawer — name, WhatsApp number, delivery
// area (Sheet areas with fees), optional referral code and follow-up consent.
export function OrderDetailsForm({state, checkout}: {state: OrderDetailsState; checkout: {itemCount: number; value: number}}) {
  const tracked = useRef(false);
  const onFirstFocus = () => {
    if (tracked.current) return;
    tracked.current = true;
    track({event: "begin_checkout", item_count: checkout.itemCount, value: checkout.value});
  };
  const field = {state, onFirstFocus};

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="sr-only">Your details</legend>
      <div>
        <h3 className="text-h3 font-bold text-text-heading">Your details</h3>
        <p className="text-sm text-text-muted">We use these to confirm your order on WhatsApp.</p>
      </div>
      <NameField {...field} />
      <PhoneField {...field} />
      <AreaField {...field} />
      <ReferralField {...field} />
      <ConsentField {...field} />
      <HoneypotField {...field} />

      {state.remembered ? (
        <button
          type="button"
          className="self-start text-sm font-medium text-brand-strong underline underline-offset-4"
          onClick={state.clearRemembered}
        >
          Not you? Clear details
        </button>
      ) : null}
    </fieldset>
  );
}

function NameField({state, onFirstFocus}: FieldProps) {
  const {details, update, fieldError, markTouched} = state;
  return (
    <Field id={fieldId("name")} label="Full name" required error={fieldError("name")}>
      <Input
        autoComplete="name"
        value={details.name}
        onChange={(e) => update({name: e.target.value})}
        onFocus={onFirstFocus}
        onBlur={() => markTouched("name")}
      />
    </Field>
  );
}

function PhoneField({state, onFirstFocus}: FieldProps) {
  const {details, update, fieldError, markTouched} = state;
  return (
    <Field id={fieldId("phone")} label="WhatsApp number" required error={fieldError("phone")}>
      <PhoneInput
        autoComplete="tel"
        inputMode="tel"
        value={details.phone}
        onChange={(e) => update({phone: e.target.value})}
        onFocus={onFirstFocus}
        onBlur={() => markTouched("phone")}
      />
    </Field>
  );
}

function AreaField({state, onFirstFocus}: FieldProps) {
  const {details, update, fieldError, markTouched} = state;
  const areas = getDeliveryAreas();
  const group = (zone: "local" | "interstate" | "pickup") => areas.filter((a) => a.zone === zone);
  const option = (area: (typeof areas)[number]) => (
    <option key={area.area} value={area.area}>
      {area.feeNgn === 0 ? `${area.area} — Free` : `${area.area} — ${formatNaira(area.feeNgn)} · ${area.timelineText}`}
    </option>
  );

  return (
    <>
      <Field id={fieldId("area")} label="Delivery area" required error={fieldError("area")}>
        <Select
          value={details.area}
          onChange={(e) => update({area: e.target.value, areaOther: e.target.value === OTHER_AREA ? details.areaOther : ""})}
          onFocus={onFirstFocus}
          onBlur={() => markTouched("area")}
        >
          <option value="">Choose an area…</option>
          <optgroup label="Local areas">{group("local").map(option)}</optgroup>
          <optgroup label="Interstate">{group("interstate").map(option)}</optgroup>
          <optgroup label="Pickup">
            {group("pickup").length > 0 ? group("pickup").map(option) : <option value="Pickup">Pick up from our shop — Free</option>}
          </optgroup>
          <option value={OTHER_AREA}>Other (we'll confirm)</option>
        </Select>
      </Field>
      {details.area === OTHER_AREA ? (
        <Field id={fieldId("areaOther")} label="Your area" required error={fieldError("areaOther")}>
          <Input
            value={details.areaOther}
            onChange={(e) => update({areaOther: e.target.value})}
            onFocus={onFirstFocus}
            onBlur={() => markTouched("areaOther")}
          />
        </Field>
      ) : null}
    </>
  );
}

function ReferralField({state, onFirstFocus}: FieldProps) {
  const {details, update, fieldError, markTouched} = state;
  return (
    <div className="flex items-start gap-2">
      <Field id={fieldId("referralCode")} label="Referral code (optional)" error={fieldError("referralCode")} className="flex-1">
        <Input
          value={details.referralCode}
          onChange={(e) => update({referralCode: e.target.value.toUpperCase()})}
          onFocus={onFirstFocus}
          onBlur={() => markTouched("referralCode")}
          autoCapitalize="characters"
          className="uppercase"
        />
      </Field>
      {state.referralApplied ? (
        <Badge variant="stock" className="mt-8">
          Applied ✓
        </Badge>
      ) : null}
    </div>
  );
}

function ConsentField({state}: {state: OrderDetailsState}) {
  return (
    <Checkbox
      id="order-consent"
      label={
        <>
          Send me usage tips and a reminder on WhatsApp when my pack is running low. Reply STOP anytime.{" "}
          <a href="/privacy" className="underline underline-offset-4">
            Privacy policy
          </a>
        </>
      }
      checked={state.details.followupConsent}
      onChange={(e) => state.update({followupConsent: e.target.checked})}
    />
  );
}

function HoneypotField({state}: {state: OrderDetailsState}) {
  return (
    <div aria-hidden="true" className="sr-only">
      <label htmlFor="order-company">Company</label>
      <Input
        id="order-company"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={state.details.company}
        onChange={(e) => state.update({company: e.target.value})}
      />
    </div>
  );
}
