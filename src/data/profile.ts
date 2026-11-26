export type YearMonth = `${number}-${string}`; // "2024-01"

export interface CareerSpan {
  id: string;
  label: string;
  role: string;
  org: string;
  start: YearMonth;
  end: YearMonth | null;
  location: string;
  kind: "education" | "work" | "oss";
  metrics: string[];
  bullets: string[];
}

export interface ProjectOverride {
  summary?: string;
  cover?: string;
  images?: string[];
  body?: string;
}

export interface ShowcaseRepo {
  repo: string;
  slug?: string;
  stack: string[];
  override?: ProjectOverride;
}

export interface ManualProject {
  slug: string;
  name: string;
  summary: string;
  stack: string[];
  year: string;
  archived: boolean;
  body: string;
  githubUrl?: string;
}

export interface Profile {
  name: string;
  githubUser: string;
  status: string;
  headline: { lead: string; tail: string };
  intro: string;
  careerStart: YearMonth;
  manualStats: { label: string; value: string }[];
  career: CareerSpan[];
  achievements: { spanId: string; text: string }[];
  skills: { label: string; items: string[] }[];
  interests: { label: string; icon: string }[];
  socials: { label: string; url: string }[];
  calLink: string | null;
  resumeUrl: string;
  showcaseRepos: ShowcaseRepo[];
  manualProjects: ManualProject[];
  hiddenPRs: string[];
}

export const profile: Profile = {
  name: "Himanshu Singh",
  githubUser: "Himanshu-370",
  status: "open to opportunities",
  headline: {
    lead: "Software engineer",
    tail: "keeping infra observable & agents honest.",
  },
  intro:
    "Software Engineer at Guidewire in Bengaluru. I build internal platforms, infrastructure visibility tools and AI-agent tooling, and send fixes upstream.",
  careerStart: "2024-01",
  manualStats: [{ label: "engineers using my dashboards", value: "50+" }],
  career: [
    {
      id: "snu",
      label: "SNU",
      role: "B.Tech in Electronics and Communication Engineering",
      org: "Shiv Nadar Institute of Eminence",
      start: "2020-08",
      end: "2024-05",
      location: "Greater Noida, India",
      kind: "education",
      metrics: ["7.5 CGPA"],
      bullets: [],
    },
    {
      id: "cvowl",
      label: "CV Owl",
      role: "Full Stack Developer Intern",
      org: "CV Owl",
      start: "2022-10",
      end: "2023-10",
      location: "Remote",
      kind: "work",
      metrics: ["25% engagement boost", "40% faster load times"],
      bullets: [
        "Improved platform engagement by 25% through performance optimization and user flow redesigns across the resume-building workflow.",
        "Led a 3-member design team; integrated AWS S3 and CloudFront for static asset delivery, reducing page load times by 40%.",
      ],
    },
    {
      id: "hyperswitch",
      label: "HyperSwitch",
      role: "Open Source Contributor",
      org: "HyperSwitch – Juspay",
      start: "2023-10",
      end: "2023-11",
      location: "Remote",
      kind: "oss",
      metrics: ["Rust", "Open Source"],
      bullets: [
        "Production-grade open-source payment orchestrator.",
        "Improved backend request routing in a production-grade open-source payment orchestrator (Rust); collaborated with core maintainers to implement a new identifier structure, increasing connector compatibility across payment providers.",
      ],
    },
    {
      id: "guidewire",
      label: "Guidewire",
      role: "Software Engineer I",
      org: "Guidewire Software",
      start: "2024-01",
      end: null,
      location: "Bengaluru, India",
      kind: "work",
      metrics: ["50+ engineers served", "60% effort reduction", ">80% test coverage"],
      bullets: [
        "Intern Jan–May 2024; full-time since Jun 2024.",
        "Built React dashboards for infrastructure usage monitoring, serving 50+ internal engineers with real-time visibility into AWS resource allocation and cost metrics.",
        "Developed secure service APIs with role-based access control and audit logging, reducing unauthorized access incidents across staging and production environments.",
        "Automated weekly operational reporting using Python, MySQL, and Slack APIs, cutting manual tracking effort by 60% and eliminating reporting delays for stakeholder teams.",
        "Built Kafka-based event-driven integration for cloud infrastructure lifecycle tracking, including schema design, listener lifecycle management, and reconciliation APIs used for billing and compliance reporting.",
        "Maintained >80% unit test coverage through rigorous testing practices, code reviews, and CI enforcement.",
      ],
    },
  ],
  achievements: [
    {
      spanId: "snu",
      text: 'Winner — "Best Beginner Hack", MLH Hackathon (200+ participants)',
    },
    {
      spanId: "snu",
      text: "2nd Place — Design-a-thon and Front-a-thon, Technical Fest at SNU",
    },
  ],
  skills: [
    { label: "Languages", items: ["Python", "JavaScript/TypeScript", "Java", "Go", "Rust", "SQL"] },
    { label: "Frameworks", items: ["React", "FastAPI", "Flask", "Node.js", "Express.js", "Spring Boot"] },
    {
      label: "Cloud & Infra",
      items: ["AWS (Lambda, S3, DynamoDB, SQS, ECS, IAM, VPC)", "Docker", "Kubernetes", "Terraform"],
    },
    { label: "Data & Messaging", items: ["Kafka", "MySQL", "MongoDB", "PostgreSQL", "NetworkX"] },
    {
      label: "Tools & Platforms",
      items: ["Git", "GitHub Actions", "TeamCity", "MCP", "Postman", "Figma", "SAML/SSO"],
    },
  ],
  interests: [
    { label: "cooking", icon: "🍳" },
    { label: "football", icon: "⚽" },
    { label: "cricket", icon: "🏏" },
    { label: "swimming", icon: "🏊" },
  ],
  socials: [
    { label: "GitHub", url: "https://github.com/Himanshu-370" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/himanshusingh20/" },
    { label: "X", url: "https://x.com/himlabs" },
  ],
  calLink: null,
  resumeUrl: "/Himanshu_Singh_Resume.pdf",
  showcaseRepos: [
    { repo: "son-of-anton", stack: ["TypeScript", "Docker", "Agents"] },
    {
      repo: "cloudwire",
      stack: ["Python", "FastAPI", "React"],
      override: {
        summary:
          "Open-source AWS infrastructure visualizer, published on PyPI, with 24 service scanners; runs fully local.",
      },
    },
  ],
  manualProjects: [
    {
      slug: "feature-flow",
      name: "Feature Flow",
      summary: "AI-powered Jira automation.",
      stack: ["Flask", "React", "Docker", "MCP", "LLMs"],
      year: "2025",
      archived: false,
      body: "- Built a full-stack tool that converts Aha! feature context into structured Jira stories using LLMs, reducing manual story writing by 90% with dry-run validation, board-aware field assignments, and Excel/Jira export.\n- Architected an MCP server gateway (10 tools) enabling Claude Desktop/Cursor integration, with provider-based Aha! and Jira clients and customizable prompt system requiring no code changes.",
    },
    {
      slug: "vidvortex",
      name: "VidVortex",
      summary: "Video chat with strangers.",
      stack: ["Socket.io", "WebRTC", "JavaScript", "MongoDB", "Express.js"],
      year: "2023",
      archived: true,
      body: "- Multi-stranger video chat application using WebRTC and Socket.IO for real-time communication with dynamic room allocation.\n- Optimized user interface for enhanced user retention and built a scalable signaling server.",
    },
  ],
  hiddenPRs: [],
};
