export interface SkillGroup {
  key: string;
  label: string;
  version: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    key: "languages",
    label: "languages",
    version: "^4.0.0",
    items: ["JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    key: "backend",
    label: "backend-and-frameworks",
    version: "^4.2.0",
    items: [
      "Node.js",
      "Express.js",
      "Knex",
      "AWS-SDK",
      "JWT",
      "Axios",
      "SendGrid",
      "Stripe",
      "RabbitMQ",
      "Socket.IO",
    ],
  },
  {
    key: "data",
    label: "databases-and-cloud",
    version: "^3.1.0",
    items: ["PostgreSQL", "SQL", "MongoDB", "AWS", "GCP", "S3"],
  },
  {
    key: "ai",
    label: "ai-tools-and-models",
    version: "^0.9.0",
    items: [
      "OpenAI API",
      "GPT-4o-mini",
      "text-embedding-3-small",
      "DALL-E 3",
      "Pinecone",
      "Weaviate",
      "FAISS",
      "Prompt Engineering",
    ],
  },
  {
    key: "tools",
    label: "tools-and-other",
    version: "^2.0.0",
    items: [
      "VS Code",
      "Git",
      "GitHub",
      "Docker",
      "Postman",
      "DBeaver",
      "Swagger UI",
      "Data Structures & Algorithms",
    ],
  },
  {
    key: "soft-skills",
    label: "soft-skills",
    version: "^1.0.0",
    items: ["Communication", "Teamwork", "Problem-solving", "Fast adaptability"],
  },
];
