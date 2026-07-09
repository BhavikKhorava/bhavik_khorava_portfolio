export type ExperienceStatus = "RUNNING" | "EXITED";

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  status: ExperienceStatus;
  pid: string;
  bullets: string[];
}

// NOTE: Veloc is the current/active role (not on the original resume).
// Bullets below are generic-but-credible placeholders — refine once finalized.
export const experience: ExperienceEntry[] = [
  {
    company: "Veloc",
    role: "Backend Developer",
    period: "May 2026 -- Present",
    status: "RUNNING",
    pid: "1001",
    bullets: [
      "Building and maintaining backend services using Node.js and TypeScript", // placeholder — refine with real detail
      "Collaborating cross-functionally to design and ship scalable APIs", // placeholder — refine with real detail
      "Contributing to system architecture and code quality standards", // placeholder — refine with real detail
    ],
  },
  {
    company: "Rockers Technology",
    role: "Backend Developer Engineer",
    period: "Jun 2023 -- Apr 2026",
    status: "EXITED",
    pid: "0842",
    bullets: [
      "Built and maintained backend systems using Node.js, Express, and MongoDB",
      "Collaborated on AI-powered and fintech projects, ensuring performance, scalability, and clean code",
      "Focused on API development, third-party integrations, and implementing secure payment workflows",
    ],
  },
  {
    company: "WayRabbit, India",
    role: "Software Developer Engineer",
    period: "Mar 2022 -- Apr 2023",
    status: "EXITED",
    pid: "0531",
    bullets: [
      "Built backend systems from scratch using Node.js, Express, and TypeScript with PostgreSQL",
      "Focused on API design, third-party integrations, and scalable architecture implementation",
      "Collaborated on marketplace platforms, improving performance, code quality, and feature delivery",
    ],
  },
  {
    company: "Acute Informatics Pvt. Ltd.",
    role: "Digix Support Engineer",
    period: "Aug 2021 -- Feb 2022",
    status: "EXITED",
    pid: "0219",
    bullets: [
      "Resolved database problems for multiple bank customers through chat, video, and audio calls",
      "Collaborated with cross-functional teams to ensure timely resolution of issues, escalated complex problems",
      "Communicated technical issues clearly to non-technical customers, provided preventive guidance",
      "Maintained detailed records of customer interactions to track issues and follow-ups",
    ],
  },
];
