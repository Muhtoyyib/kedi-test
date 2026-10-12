import {ContactForm} from "./components/contact-form";
import {ContactMethods} from "./components/contact-methods";
import {LocationMap} from "./components/location-map";
import {PaymentSafety} from "./components/payment-safety";

// /contact — methods (WhatsApp first), location + map, form, payment safety.
export function ContactView() {
  return (
    <>
      <ContactMethods />
      <LocationMap />
      <ContactForm />
      <PaymentSafety />
    </>
  );
}
