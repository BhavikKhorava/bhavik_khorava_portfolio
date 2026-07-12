export interface ProjectEntry {
  slug: string;
  name: string;
  org: string;
  period: string;
  namespace: string;
  replicas: number;
  stack: string[];
  bullets: string[];
  /** Marks projects with real OpenAI/vector/RAG work — renders an AI/RAG badge. */
  ai?: boolean;
}

export const projects: ProjectEntry[] = [
  {
    slug: "equity-crowdfunding",
    name: "Equity Crowdfunding",
    org: "Rockers Technology",
    period: "Jun 2023 -- Apr 2026",
    namespace: "fintech",
    replicas: 3,
    ai: true,
    stack: [
      "Node.js",
      "MongoDB",
      "Mangopay",
      "ShuftiPro",
      "OpenAI API",
      "text-embedding-3-small",
      "DALL-E 3",
      "Socket.io",
      "Axios",
    ],
    bullets: [
      "Designed and developed a secure backend system for equity-based crowdfunding, including campaign management, investor onboarding, and transaction workflows",
      "Implemented KYC/AML verification using ShuftiPro; integrated Mangopay and Stripe (subscriptions) for secure payments, escrow handling, and fund distribution",
      "Automated investor communication and insights with GPT-4o-mini + text-embedding-3-small — embedding-based retrieval feeding LLM responses (early RAG-pipeline work: embeddings → retrieval → LLM response); used DALL-E 3 for dynamic campaign visual generation",
      "Enabled real-time notifications using Socket.io; applied end-to-end encryption at API and database levels",
    ],
  },
  {
    slug: "donation-platform",
    name: "Donation-Based Platform",
    org: "Rockers Technology",
    period: "Jun 2023 -- Apr 2026",
    namespace: "fintech",
    replicas: 3,
    ai: true,
    stack: ["Node.js", "MongoDB", "Firebase", "Stripe", "PayPal", "OpenAI API", "GPT-4o-mini", "Axios"],
    bullets: [
      "Developed a backend system to manage donation campaigns, contributor data, and real-time donation tracking with analytics support",
      "Integrated Firebase for live notifications/real-time updates; implemented Stripe, PayPal, and Plaid ACH for secure donation transactions and bank-based payments",
      "Integrated the OpenAI API (GPT-4o-mini) into the backend to generate personalized donor messages and campaign summaries from campaign/donor data, while optimizing performance for high-traffic donation events",
    ],
  },
  {
    slug: "partsclub",
    name: "Partsclub.us",
    org: "WayRabbit",
    period: "Sep 2022 -- Apr 2023",
    namespace: "marketplace",
    replicas: 2,
    stack: ["TypeScript", "Express.js", "Postgres", "Knex", "JWT", "S3", "Stripe", "RabbitMQ"],
    bullets: [
      "Developed the backend for Partsclub, a B2B marketplace for heavy-duty parts, using a clean three-layer architecture for scalability and maintainability",
      "Designed and implemented REST APIs and schema models for user, company, and product modules with secure authentication (JWT + Bcrypt)",
      "Integrated Stripe for subscription-based and one-time purchases; implemented SendGrid for automated transactional emails",
      "Utilized AWS S3 with CDN support for asset storage; implemented RabbitMQ for reliable message queuing and scalable data processing",
    ],
  },
  {
    slug: "heyarrow",
    name: "Heyarrow.com",
    org: "WayRabbit",
    period: "Mar 2022 -- Sep 2022",
    namespace: "marketplace",
    replicas: 2,
    stack: ["TypeScript", "Express.js", "Postgres", "Knex", "JWT", "GCP", "Stripe"],
    bullets: [
      "Developed the backend for HeyArrow, a CRM and inventory management platform supporting eCommerce, payments, and financing for heavy equipment businesses",
      "Designed and implemented REST APIs and schema models for user, product, and invoice modules using Knex and PostgreSQL",
      "Integrated Stripe for payment processing with webhook handling, enabling subscription and one-time payment workflows",
      "Implemented SendGrid for automated transactional/onboarding emails; used Google Cloud Storage with CDN support, following clean three-layer architecture",
    ],
  },
];
