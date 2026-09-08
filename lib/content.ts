/**
 * Single source of truth for on-site copy.
 * Facts are taken from Muhammad Ahmed's CV, including hyperlinks embedded in the PDF.
 * Empty strings are intentional placeholders where the CV did not provide a URL.
 */

export const profile = {
  name: "Muhammad Ahmed",
  firstName: "Muhammad",
  lastName: "Ahmed",
  initials: "MA",
  place: "Lahore",
  role: "LLM Engineer / Software Developer",
  email: "iahmedzahooor@gmail.com",
  phoneDisplay: "+92 306 3398566",
  phoneE164: "+923063398566",

  cvHref: "/Muhammad_Ahmed_CV.pdf",
  social: {
    github: "https://github.com/hitrocker/",
    linkedin: "https://www.linkedin.com/in/muhammad-ahmed-4500012b1/",
  },
} as const;

export const navItems = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Work" },
  { href: "#contact", label: "Contact" },
] as const;

export const hero = {
  availability: "Open to LLM evaluation & product work",
  role: "LLM Engineer / Software Developer",
  lead: "I train, evaluate, and benchmark large language models through RLHF workflows - then independently design and ship the software I build.",
  primaryCta: { href: "#projects", label: "See work" },
};

export const marquee = [
  "RLHF",
  "Model benchmarking",
  "Instruction following",
  "Reasoning analysis",
  "Hallucination analysis",
  "Multimodal annotation",
  "AI-generated code review",
  "Kotlin",
  "Jetpack Compose",
  "Unity",
  "Python",
  "PyTorch",
];

export const about = {
  kicker: "About",
  heading: "Measure the model.",
  headingAccent: "Then ship the product.",
  paragraphs: [
    "I work at the intersection of AI, LLM evaluation, and software engineering - the place where model behavior gets measured carefully, and products actually ship.",
    "With Turing and Revelo I have lived inside evaluation loops: RLHF workflows, head-to-head benchmarking, reasoning analysis, instruction following, hallucination reduction, multimodal annotation, and review of AI-generated code.",
    "Independently, I design and publish native mobile games. Evaluating systems is one craft. Building something people can install is another. I do both.",
  ],
};

export type ExperienceItem = {
  id: string;
  organization: string;
  role: string;
  dates: string;
  current?: boolean;
  summary: string;
  points: string[];
  areas: string[];
};

export const experience: ExperienceItem[] = [
  {
    id: "revelo",
    organization: "Revelo",
    role: "LLM Engineer (AI Evaluation)",
    dates: "Feb 2026 – Present",
    current: true,
    summary:
      "Evaluating how Anthropic’s frontier models handle complex logic, follow strict instructions, and write code that can survive a real review.",
    points: [
      "Analyze frontier-model behavior on complex logic and tight instruction-following constraints.",
      "Review AI-generated code changes in PR Writer workflows for safety, readability, and exception handling.",
      "Run head-to-head model comparisons and write targeted feedback aimed at reducing hallucinations.",
    ],
    areas: [
      "Frontier evaluation",
      "Instruction following",
      "AI-generated code",
      "Hallucination analysis",
    ],
  },
  {
    id: "turing",
    organization: "Turing",
    role: "LLM Projects",
    dates: "Nov 2024 – Jan 2026",
    summary:
      "Trained and benchmarked large language models across major labs, while keeping evaluation standards strict and daily operations on schedule.",
    points: [
      "Trained and benchmarked models across OpenAI, Anthropic, and Google families using RLHF.",
      "Tested output quality on multi-step reasoning, truthfulness, and instruction following.",
      "Contributed to SEW Bench evaluations, video captioning tasks, and offline workflow improvements.",
      "Streamlined data collection pipelines so large datasets could move quickly without lowering the bar.",
      "Coordinated daily operations with international teammates to hit model accuracy targets on time.",
    ],
    areas: [
      "RLHF",
      "Model benchmarking",
      "Reasoning analysis",
      "Multimodal tasks",
      "Pipeline design",
    ],
  },
];

export const expertise = {
  kicker: "Capabilities",
  heading: "A stack for models,",
  headingAccent: "and the apps around them.",
  intro:
    "A working map of the evaluation and training work I do - tags, not scorebars. Depth shows up in the reviews, not in a percentage.",
  groups: [
    {
      title: "LLM Evaluation",
      items: [
        "RLHF",
        "Model Evaluation",
        "Model Benchmarking",
        "Reasoning Analysis",
        "Instruction Following",
        "Hallucination Analysis",
      ],
    },
    {
      title: "AI Training",
      items: [
        "RLHF workflows",
        "Multimodal Annotation",
        "Data collection pipelines",
        "Evaluation standards",
        "Video captioning tasks",
      ],
    },
    {
      title: "Engineering",
      items: [
        "Python",
        "AI-generated code evaluation",
        "Workflow optimization",
        "Testing",
        "Code review",
      ],
    },
  ],
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  name: string;
  kind: string;
  role: string;
  visual: "grid2048" | "maze";
  summary: string;
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    id: "2048",
    name: "2048",
    kind: "Android game",
    role: "Solo developer · shipped",
    visual: "grid2048",
    summary:
      "A complete 2048 built independently in Kotlin and Jetpack Compose - custom engine, multiple boards, and a signed release on Google Play.",
    highlights: [
      "Custom game engine with 8 grid sizes, covered by 24 JUnit tests.",
      "Gesture controls and stable animations; DataStore keeps settings and high scores on device.",
      "Firebase Auth wired to realtime Cloud Firestore leaderboards, with no ad frameworks.",
      "Published as a fully compliant, signed AAB on Google Play.",
    ],
    stack: [
      "Kotlin",
      "Jetpack Compose",
      "MVVM",
      "StateFlow",
      "DataStore",
      "Firebase Auth",
      "Cloud Firestore",
      "JUnit",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/hitrocker/Game2048" },
      { label: "Google Play", href: "" },
    ],
  },
  {
    id: "paintmaze",
    name: "PaintMaze",
    kind: "Unity mobile puzzle",
    role: "Solo developer · shipped",
    visual: "maze",
    summary:
      "A mobile puzzle game in Unity and C# - thousands of pre-baked levels, on-device generation, and a solver that keeps play honest offline.",
    highlights: [
      "6,500 pre-baked levels plus on-device generation for offline play.",
      "Custom board solver for hint generation and layout verification.",
      "Smart cache designed to remove loading screens during play.",
      "Firebase Auth for cloud saves and leaderboards, backed by Unity EditMode tests.",
    ],
    stack: [
      "Unity",
      "C#",
      "Firebase Auth",
      "Cloud saves",
      "Leaderboards",
      "EditMode tests",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/hitrocker/Gamepaintmaze" },
      {
        label: "Play Store",
        href: "https://play.google.com/store/apps/details?id=com.hitrocker.paintmaze&pcampaignid=web_share",
      },
    ],
  },
];

export const skillGroups = [
  {
    id: "llm",
    label: "LLM & AI",
    items: [
      "RLHF",
      "Model Benchmarking",
      "Multi Modal Annotation",
      "Prompt Engineering",
      "PyTorch",
      "CNNs",
      "Vision Transformers",
    ],
  },
  {
    id: "programming",
    label: "Programming",
    items: ["Python", "Kotlin", "C#", "JavaScript", "C++", "SQL"],
  },
  {
    id: "mobile",
    label: "Mobile Development",
    items: [
      "Jetpack Compose",
      "MVVM",
      "StateFlow",
      "DataStore",
      "Android Studio",
      "Unity",
    ],
  },
  {
    id: "backend",
    label: "Backend & Cloud",
    items: [
      "PostgreSQL",
      "SQL Server",
      "Firebase Authentication",
      "Cloud Firestore",
      "Docker",
    ],
  },
  {
    id: "tools",
    label: "Tools & Systems",
    items: ["Cursor", "VS Code", "Gradle", "Kaggle", "Graphviz", "Apache JMeter"],
  },
  {
    id: "other",
    label: "Other",
    items: ["JUnit", "Unity EditMode tests", "Google Play publishing"],
  },
] as const;

export const education = {
  degree: "BS Information Technology",
  school: "Bahria University, Lahore",
  dates: "2023 – 2027",
};

export const contact = {
  heading: "Have a problem worth solving?",
  headingAccent: "I’ll actually read it.",
  body: "I am easy to reach if you are hiring for LLM evaluation, building around frontier models, or want an engineer who can also ship a product. Recruiters, researchers, founders, and engineers - write.",
};
