'use client';

import { useState, type FormEvent } from 'react';
import { contact } from '@/data/portfolioData';
import { sectionNumber } from '@/lib/sections';
import BentoTile, { TileLabel } from './BentoTile';
import EmailText from './EmailText';

type Status = { state: 'idle' | 'sending' | 'sent' } | { state: 'error'; message: string };

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', maxLength: 100 },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', maxLength: 254 },
  { name: 'subject', label: 'Subject', type: 'text', autoComplete: 'off', maxLength: 150 },
] as const;

const labelClass = 'text-xs tracking-[0.2em] text-muted uppercase';
const inputClass =
  'mt-2 w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 text-sm transition-colors duration-500 ease-spring placeholder:text-muted/60 focus:border-ink focus:outline-none';

export default function ContactSection() {
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ state: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Your message could not be sent.');
      form.reset();
      setStatus({ state: 'sent' });
    } catch (err) {
      setStatus({ state: 'error', message: err instanceof Error ? err.message : 'Your message could not be sent.' });
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-8 pb-[clamp(4rem,10vw,8rem)]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <BentoTile inverse className="lg:col-span-5">
          <TileLabel>{sectionNumber('contact')} — Contact</TileLabel>
          <div className="mt-10">
            <h2
              id="contact-title"
              className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-tight"
            >
              Have something in mind?
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-70">
              {contact.availability}. Based in {contact.location}.
            </p>
          </div>
          <a
            href={`mailto:${contact.email}`}
            className="mt-10 font-display text-lg font-semibold break-words underline-offset-4 hover:underline"
          >
            <EmailText email={contact.email} />
          </a>
        </BentoTile>

        <BentoTile className="lg:col-span-7">
          <form onSubmit={submit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {FIELDS.map(f => (
                <div key={f.name} className={f.name === 'subject' ? 'md:col-span-2' : ''}>
                  <label htmlFor={`contact-${f.name}`} className={labelClass}>
                    {f.label}
                  </label>
                  <input
                    id={`contact-${f.name}`}
                    name={f.name}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    maxLength={f.maxLength}
                    required
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="contact-message" className={labelClass}>
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                maxLength={5000}
                required
                className={`${inputClass} resize-y`}
              />
            </div>

            {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
            <div aria-hidden="true" className="hidden">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="submit"
                disabled={status.state === 'sending'}
                className="rounded-full bg-ink px-6 py-3 text-xs tracking-wider text-canvas uppercase transition-[scale,opacity] duration-300 ease-spring hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {status.state === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <p aria-live="polite" className="text-sm">
                {status.state === 'sent' && 'Thanks, your message is on its way.'}
                {status.state === 'error' && (
                  <>
                    {status.message} You can also email{' '}
                    <a href={`mailto:${contact.email}`} className="underline underline-offset-4">
                      {contact.email}
                    </a>
                    .
                  </>
                )}
              </p>
            </div>
          </form>
        </BentoTile>
      </div>
    </section>
  );
}
