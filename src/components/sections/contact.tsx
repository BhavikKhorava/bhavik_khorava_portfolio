"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/data/profile";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // honeypot — hidden from humans; bots that fill it get silently dropped
  const [company, setCompany] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; error?: string }
        | null;

      if (res.ok && data?.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMessage(data?.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error — please try again.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section-glow relative px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <SectionLabel index="07" title="contact" command="curl -X POST /api/contact" />
        </Reveal>

        <Reveal delay={0.1}>
          <TerminalWindow title="bhavik@portfolio:~$ curl -X POST /api/contact">
            <div className="grid gap-10 sm:grid-cols-2">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* honeypot: invisible to humans, tabbed over, ignored by the API when empty */}
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />
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
                    className="accent-gradient inline-flex items-center gap-2 rounded-md px-6 py-3 font-mono text-sm text-accent-foreground transition-[filter] hover:brightness-110 disabled:opacity-60"
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
> sending via smtp...`}
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
  "message": "delivered — thanks for reaching out!",
  "response_eta": "~24h"
}`}
                      </motion.pre>
                    )}
                    {status === "error" && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <pre className="whitespace-pre-wrap text-danger">
{`< 5xx ERROR
{
  "error": "${errorMessage.replaceAll('"', "'")}"
}`}
                        </pre>
                        <p className="mt-3 text-fg-muted">
                          You can also email me directly at{" "}
                          <a
                            href={`mailto:${profile.email}`}
                            className="text-accent underline-offset-4 hover:underline"
                          >
                            {profile.email}
                          </a>
                        </p>
                      </motion.div>
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
  // text-base on mobile: iOS Safari auto-zooms the page when a focused
  // input's font-size is below 16px.
  const baseClasses =
    "w-full rounded-md border border-border bg-bg-elevated/60 px-3 py-2.5 font-mono text-base text-fg placeholder:text-fg-dim outline-none transition-colors focus:border-accent/60 sm:text-sm";

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
