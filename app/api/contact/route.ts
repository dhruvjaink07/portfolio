import { getCloudflareContext } from '@opennextjs/cloudflare';

// Without a verified domain, Resend only delivers from resend.dev to the
// Resend account's own address, so CONTACT_TO_EMAIL must be that address.
const FROM = 'Portfolio contact <onboarding@resend.dev>';

const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 } as const;
type Field = keyof typeof LIMITS;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (data: unknown, status = 200) => Response.json(data, { status });
const singleLine = (s: string) => s.replace(/[\r\n]+/g, ' ');

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Honeypot: hidden from people, so only bots fill it. Pretend success.
  if (typeof body.website === 'string' && body.website !== '') return json({ ok: true });

  const fields = {} as Record<Field, string>;
  for (const key of Object.keys(LIMITS) as Field[]) {
    const raw = body[key];
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (!value || value.length > LIMITS[key]) {
      return json({ error: `Please check the ${key} field.` }, 400);
    }
    fields[key] = value;
  }
  if (!EMAIL_RE.test(fields.email)) return json({ error: 'Please enter a valid email address.' }, 400);

  const { env } = getCloudflareContext();
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    console.error('Contact form is not configured: RESEND_API_KEY or CONTACT_TO_EMAIL missing');
    return json({ error: 'The contact form is not configured yet.' }, 503);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: env.CONTACT_TO_EMAIL,
      reply_to: fields.email,
      subject: `[Portfolio] ${singleLine(fields.subject)}`,
      text: `From: ${singleLine(fields.name)} <${fields.email}>\n\n${fields.message}`,
    }),
  });

  if (!res.ok) {
    console.error('Resend rejected the message', res.status, await res.text());
    return json({ error: 'Your message could not be sent.' }, 502);
  }
  return json({ ok: true });
}
