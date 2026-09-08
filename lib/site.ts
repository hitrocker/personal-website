export const siteConfig = {
  name: "Muhammad Ahmed",
  role: "LLM Engineer & Software Developer",
  title: "Muhammad Ahmed - LLM Engineer & Software Developer",
  description:
    "Muhammad Ahmed is an LLM Engineer and Software Developer focused on AI model evaluation, RLHF, benchmarking, reasoning analysis, and software development.",
  locale: "en",
  keywords: [
    "Muhammad Ahmed",
    "LLM Engineer",
    "AI Engineer",
    "Software Developer",
    "RLHF",
    "LLM evaluation",
    "model benchmarking",
    "Turing",
    "Revelo",
  ],
};

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export function isHttpUrl(value?: string): value is string {
  return Boolean(value && /^https?:\/\//i.test(value));
}
