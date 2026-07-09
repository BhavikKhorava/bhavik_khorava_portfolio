"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/data/profile";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

type Status = "idle" | "sending" | "sent";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    setTimeout(() => {
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
    }, 900);
  };

  return (
    <section id="contact" className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <SectionLabel index="06" title="contact" command="curl -X POST /api/contact" />
        </Reveal>

        <Reveal delay={0.1}>
          <TerminalWindow title="bhavik@portfolio:~$ curl -X POST /api/contact">
            <div className="grid gap-10 sm:grid-cols-2">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Field label="name" value={name} onChange={setName} required />
                <Field
                  label="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                />
                <Field
                  label="message"
                  value={message}
                  onChange={setMessage}
                  textarea
                  required
                />

                <Magnetic className="inline-block">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-mono text-sm text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {status === "sending" ? "sending..." : "send_request()"}
                  </button>
                </Magnetic>
              </form>

              <div className="font-mono text-xs">
                <div className="mb-2 text-fg-dim">{"// response"}</div>
                <div className="rounded-lg border border-border bg-bg-elevated/60 p-4">
                  <AnimatePresence mode="wait">
                    {status === "idle" && (
                      <motion.pre
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-pre-wrap text-fg-muted"
                      >
{`{
  "status": "${profile.statusLabel.toLowerCase()}",
  "response_time": "~24h",
  "channels": ["email", "linkedin"]
}`}
                      </motion.pre>
                    )}
                    {status === "sending" && (
                      <motion.pre
                        key="sending"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-pre-wrap text-fg-muted"
                      >
{`> POST /api/contact
> connecting...`}
                      </motion.pre>
                    )}
                    {status === "sent" && (
                      <motion.pre
                        key="sent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-pre-wrap text-success"
                      >
{`< 200 OK
{
  "message": "opening mail client...",
  "to": "${profile.email}"
}`}
                      </motion.pre>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 space-y-2 text-fg-muted">
                  <Magnetic className="block">
                    <a
                      href={`mailto:${profile.email}`}
                      className="block transition-colors hover:text-accent"
                    >
                      → {profile.email}
                    </a>
                  </Magnetic>
                  <Magnetic className="block">
                    <a
                      href={profile.linkedin.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-colors hover:text-accent"
                    >
                      → linkedin/{profile.linkedin.label}
                    </a>
                  </Magnetic>
                  <Magnetic className="block">
                    <a
                      href={profile.github.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-colors hover:text-accent"
                    >
                      → {profile.github.label}
                    </a>
                  </Magnetic>
                </div>
              </div>
            </div>
          </TerminalWindow>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const baseClasses =
    "w-full rounded-md border border-border bg-bg-elevated/60 px-3 py-2.5 font-mono text-sm text-fg placeholder:text-fg-dim outline-none transition-colors focus:border-accent/60";

  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs text-fg-dim">
        --{label}
      </span>
      {textarea ? (
        <textarea
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={baseClasses}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
        />
      )}
    </label>
  );
}
