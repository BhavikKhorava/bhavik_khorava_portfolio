// HTML templates for the contact-form emails. Email clients ignore
// stylesheets and CSS vars, so everything is inline-styled with hard-coded
// hex values mirroring the site's palette (globals.css :root).

const COLORS = {
  bg: "#08090b",
  panel: "#101318",
  elevated: "#0d0f12",
  border: "#1f242b",
  fg: "#e7e9ec",
  muted: "#8b929c",
  dim: "#565d67",
  accent: "#f2a93b",
  accentDark: "#0a0a0a",
};

const MONO = "'JetBrains Mono', 'Courier New', monospace";
const SANS = "Inter, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Shared dark shell: terminal-style header bar + content card + footer. */
function shell(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:${COLORS.bg};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
            <!-- terminal chrome header -->
            <tr>
              <td style="background-color:${COLORS.elevated};border:1px solid ${COLORS.border};border-bottom:none;border-radius:12px 12px 0 0;padding:12px 20px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#ff5c5c;margin-right:5px;"></span>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${COLORS.accent};margin-right:5px;"></span>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#3ddc84;"></span>
                <span style="font-family:${MONO};font-size:12px;color:${COLORS.dim};padding-left:10px;">${title}</span>
              </td>
            </tr>
            <!-- content card -->
            <tr>
              <td style="background-color:${COLORS.panel};border:1px solid ${COLORS.border};border-radius:0 0 12px 12px;padding:28px 24px;">
                ${bodyHtml}
              </td>
            </tr>
            <!-- footer -->
            <tr>
              <td style="padding:18px 8px 0;text-align:center;">
                <span style="font-family:${MONO};font-size:11px;color:${COLORS.dim};">
                  Bhavik Khorava &middot; Node.js Backend / AI Systems Engineer
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Notification delivered to Bhavik when someone submits the form. */
export function ownerNotificationEmail(data: ContactData) {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const message = escapeHtml(data.message).replaceAll("\n", "<br />");

  const body = `
    <p style="font-family:${MONO};font-size:12px;color:${COLORS.accent};margin:0 0 18px;">
      $ new_message --from portfolio
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
      <tr>
        <td style="font-family:${MONO};font-size:12px;color:${COLORS.dim};padding:6px 0;width:80px;">name</td>
        <td style="font-family:${SANS};font-size:14px;color:${COLORS.fg};padding:6px 0;">${name}</td>
      </tr>
      <tr>
        <td style="font-family:${MONO};font-size:12px;color:${COLORS.dim};padding:6px 0;">email</td>
        <td style="font-family:${SANS};font-size:14px;padding:6px 0;">
          <a href="mailto:${email}" style="color:${COLORS.accent};text-decoration:none;">${email}</a>
        </td>
      </tr>
    </table>
    <div style="background-color:${COLORS.elevated};border:1px solid ${COLORS.border};border-left:3px solid ${COLORS.accent};border-radius:8px;padding:16px 18px;">
      <p style="font-family:${MONO};font-size:11px;color:${COLORS.dim};margin:0 0 10px;">// message</p>
      <p style="font-family:${SANS};font-size:14px;line-height:1.65;color:${COLORS.fg};margin:0;">${message}</p>
    </div>
    <p style="font-family:${SANS};font-size:12px;color:${COLORS.muted};margin:20px 0 0;">
      Hit <strong style="color:${COLORS.fg};">Reply</strong> to answer ${name} directly.
    </p>`;

  return {
    subject: `Portfolio contact from ${data.name}`,
    html: shell("bhavik@portfolio:~$ inbox --new", body),
    text: `New portfolio contact\n\nName: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
  };
}

/** Auto-reply sent to the visitor confirming their message arrived. */
export function visitorAutoReplyEmail(data: ContactData) {
  const name = escapeHtml(data.name);

  const body = `
    <p style="font-family:${MONO};font-size:12px;color:#3ddc84;margin:0 0 18px;">
      &lt; 200 OK &middot; message_received
    </p>
    <h1 style="font-family:${SANS};font-size:20px;font-weight:600;color:${COLORS.fg};margin:0 0 14px;">
      Thanks for reaching out, ${name}!
    </h1>
    <p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${COLORS.muted};margin:0 0 12px;">
      Your message just landed in my inbox. I read every message personally
      and I'll get back to you as soon as I can &mdash; usually within
      <strong style="color:${COLORS.fg};">24 hours</strong>.
    </p>
    <p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${COLORS.muted};margin:0 0 24px;">
      In the meantime, feel free to connect with me on
      <a href="https://linkedin.com/in/bhavik-khorava" style="color:${COLORS.accent};text-decoration:none;">LinkedIn</a>.
    </p>
    <div style="background-color:${COLORS.elevated};border:1px solid ${COLORS.border};border-radius:8px;padding:14px 18px;margin-bottom:24px;">
      <p style="font-family:${MONO};font-size:12px;line-height:1.8;color:${COLORS.muted};margin:0;">
        <span style="color:${COLORS.accent};">$</span> status<br />
        queue_position: <span style="color:${COLORS.fg};">1</span><br />
        response_eta: <span style="color:${COLORS.fg};">~24h</span><br />
        state: <span style="color:#3ddc84;">PROCESSING</span>
      </p>
    </div>
    <p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${COLORS.fg};margin:0;">
      Talk soon,<br />
      <strong>Bhavik Khorava</strong><br />
      <span style="font-family:${MONO};font-size:12px;color:${COLORS.dim};">Node.js Backend / AI Systems Engineer</span>
    </p>`;

  return {
    subject: "Thanks for reaching out — Bhavik Khorava",
    html: shell("bhavik@portfolio:~$ auto_reply", body),
    text:
      `Hi ${data.name},\n\n` +
      "Thanks for reaching out! Your message just landed in my inbox. " +
      "I read every message personally and I'll get back to you as soon as I can — usually within 24 hours.\n\n" +
      "In the meantime, feel free to connect on LinkedIn: https://linkedin.com/in/bhavik-khorava\n\n" +
      "Talk soon,\nBhavik Khorava\nNode.js Backend / AI Systems Engineer",
  };
}
