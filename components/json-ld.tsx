import { education, profile } from "@/lib/content";
import { getSiteUrl, siteConfig } from "@/lib/site";

export function JsonLd() {
  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: siteConfig.role,
    email: `mailto:${profile.email}`,
    telephone: profile.phoneE164,
    url,
    sameAs: [profile.social.linkedin, profile.social.github],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: education.school,
    },
    knowsAbout: [
      "Large language model evaluation",
      "RLHF",
      "Model benchmarking",
      "Reasoning analysis",
      "Software development",
      "Mobile applications",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
