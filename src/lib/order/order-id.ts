// Order IDs: KD-YYMMDD-XXXX in Africa/Lagos time, from an alphabet without
// look-alike characters (no 0 O 1 I L U). ~1.6% same-day collision odds at
// 10k orders/day; the Apps Script dedupe treats a collision as a duplicate
// and the distributor still sees the WhatsApp message.

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
const lagos = new Intl.DateTimeFormat("en-CA", {timeZone: "Africa/Lagos", year: "2-digit", month: "2-digit", day: "2-digit"});

export function createOrderId(now: Date = new Date(), random: () => Uint32Array = defaultRandom): string {
  const parts = lagos.formatToParts(now).reduce((acc, part) => ({...acc, [part.type]: part.value}), {} as Record<string, string>);
  const {year, month, day} = parts;
  const values = random();
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += ALPHABET[values[i] % ALPHABET.length];
  return `KD-${year}${month}${day}-${suffix}`;
}

function defaultRandom(): Uint32Array {
  const out = new Uint32Array(4);
  crypto.getRandomValues(out);
  return out;
}
