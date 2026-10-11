// Shared form submitter — POSTs {type, payload} to the Apps Script as
// text/plain JSON (a "simple request", so no CORS preflight), with a 10 s
// timeout. The Script answers {ok:true} or {ok:false, code}
// (03-add-apps-script-backend); anything else maps to a code the UI can show.

export interface FormSubmitResult {
  ok: boolean;
  code?: string;
}

interface SubmitDeps {
  url?: string;
  post?: (url: string, body: string) => Promise<Response>;
  timeoutMs?: number;
}

const endpoint = (): string => (import.meta.env?.VITE_APPS_SCRIPT_URL as string | undefined) ?? "";

const TIMEOUT_MS = 10_000;

function defaultPost(timeoutMs: number): (url: string, body: string) => Promise<Response> {
  return (url, body) =>
    fetch(url, {
      method: "POST",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body,
      signal: AbortSignal.timeout(timeoutMs),
    });
}

async function readResult(res: Response): Promise<FormSubmitResult> {
  const data = (await res.json().catch(() => null)) as {ok?: boolean; code?: string} | null;
  if (res.ok && data?.ok !== false) return {ok: true};
  return {ok: false, code: data?.code ?? `http_${res.status}`};
}

export async function submitForm(
  type: string,
  payload: Record<string, string | number | boolean | null>,
  deps: SubmitDeps = {}
): Promise<FormSubmitResult> {
  const url = deps.url ?? endpoint();
  if (!url) return {ok: false, code: "no_endpoint"};
  try {
    return await readResult(await (deps.post ?? defaultPost(deps.timeoutMs ?? TIMEOUT_MS))(url, JSON.stringify({type, payload})));
  } catch {
    return {ok: false, code: "network"};
  }
}
