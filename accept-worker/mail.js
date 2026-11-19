// The one email the acceptance Worker sends: "your quote was accepted", to the address the sender typed, once. Plain text, no
// tracking, through Forward Email with an alias's own credentials ("address:password"): the same method and the same sender code as
// the Pro link email of the Worker peak-pay (peak-tools, pay-worker/mail.js, copied here without change to the function).

// One more try after a slow or failed answer (peak-pay: 5 Nov 2026, a restore email failed once on a 10 s timeout).
export function forwardEmailSender({ token, from, fetchImpl = fetch, timeoutMs = 10000, tries = 2, pauseMs = 1500 }) {
  const auth = 'Basic ' + btoa(token.includes(':') ? token : `${token}:`);
  const once = async ({ to, subject, text }) => {
    try {
      const r = await fetchImpl('https://api.forwardemail.net/v1/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: auth },
        body: JSON.stringify({ from, to, subject, text }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (r.ok) return 'sent';
      return r.status === 429 || r.status >= 500 ? 'unreachable' : 'refused';
    } catch (e) {
      return 'unreachable';
    }
  };
  return {
    async send(m) {
      let out = 'unreachable';
      for (let i = 0; i < tries; i++) {
        if (i) await new Promise(r => setTimeout(r, pauseMs));
        out = await once(m);
        if (out !== 'unreachable') return out;
      }
      return out;
    },
  };
}

// The text is fixed. Only two things that someone typed can reach it, both cleaned first: the quote number (the sender's own, letters,
// digits and a few marks) and the status link (ours). The client's name and note are NOT in the email: a stranger's words never go
// out under our address. They are on the status page, one click away.
export const cleanNumber = s => String(s == null ? '' : s).replace(/[^A-Za-z0-9 ._#\/-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 30);

export function acceptedMail({ number, statusUrl }) {
  const n = cleanNumber(number);
  const label = n ? 'Quote ' + n : 'Your quote';
  const lines = [
    label + ' was accepted online.',
    '',
    'Open the status page to see who accepted it, when, and any note they left:',
    statusUrl,
    '',
    'Keep that link to yourself: anyone who has it can read the status.',
    '',
    'You get this email because you gave this address when you sent the quote for acceptance with GetQuotationMaker. We do not keep the address after this email.',
    '',
    'Questions: write to info@peakappsstudio.com.',
    '',
    'Peak Apps Studio',
  ];
  return { subject: label + ' was accepted', text: lines.join('\n') };
}
