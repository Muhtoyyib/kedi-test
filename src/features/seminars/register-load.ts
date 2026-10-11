// Cross-section signal: the hero's "Register free" starts the Luma embed in
// the registration section without a shared React position (custom event).
export const LOAD_REGISTRATION_EVENT = "kedi:load-seminar-registration";

export function requestRegistrationLoad(): void {
  window.dispatchEvent(new CustomEvent(LOAD_REGISTRATION_EVENT));
}

export function onRegistrationLoad(listener: () => void): () => void {
  window.addEventListener(LOAD_REGISTRATION_EVENT, listener);
  return () => window.removeEventListener(LOAD_REGISTRATION_EVENT, listener);
}
