// Referral code registration — fire-and-forget POST to the Apps Script so the
// Sheet knows which phone owns which code. The page never blocks on it; one
// retry after 3 s on failure. Duplicate registration is harmless server-side.

export interface ReferralRegistration {
  firstName: string;
  phone: string; // normalised (E.164)
  code: string;
}

interface RegisterDeps {
  url?: string;
  post?: (url: string, body: string) => Promise<void>;
  retryMs?: number;
  /** Called when the POST and its retry both fail (refer/get-your-code). */
  onGiveUp?: () => void;
}

const endpoint = (): string => (import.meta.env?.VITE_APPS_SCRIPT_URL as string | undefined) ?? "";

const RETRY_MS = 3000;

function defaultPost(url: string, body: string): Promise<void> {
  return fetch(url, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body}).then(() => undefined);
}

export function registerReferralCode(input: ReferralRegistration, deps: RegisterDeps = {}): void {
  const url = deps.url ?? endpoint();
  if (!url) return;
  const post = deps.post ?? defaultPost;
  const body = JSON.stringify({type: "referral_code", payload: {firstName: input.firstName, phone: input.phone, code: input.code}});
  void post(url, body).catch(() => {
    setTimeout(() => void post(url, body).catch(() => deps.onGiveUp?.()), deps.retryMs ?? RETRY_MS);
  });
}
