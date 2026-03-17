// ─── Skills (categorized) ───────────────────────────────────────────────────

export interface SkillCategory {
  label: string
  items: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    label: "Languages",
    items: ["Python", "JavaScript/TypeScript", "Java", "Go", "Rust", "SQL"],
  },
  {
    label: "Frameworks",
    items: ["React", "FastAPI", "Flask", "Node.js", "Express.js", "Spring Boot"],
  },
  {
    label: "Cloud & Infra",
    items: [
      "AWS (Lambda, S3, DynamoDB, SQS, ECS, IAM, VPC)",
      "Docker",
      "Kubernetes",
      "Terraform",
    ],
  },
  {
    label: "Data & Messaging",
    items: ["Kafka", "MySQL", "MongoDB", "PostgreSQL", "NetworkX"],
  },
  {
    label: "Tools & Platforms",
    items: ["Git", "GitHub Actions", "TeamCity", "MCP", "Postman", "Figma", "SAML/SSO"],
  },
]

// ─── Experience ─────────────────────────────────────────────────────────────

export interface Experience {
  id: string
  title: string
  subtitle?: string
  company: string
  period: string
  location: string
  metrics: string[]
  bullets: string[]
  defaultExpanded?: boolean
}

export const experiences: Experience[] = [
  {
    id: "guidewire",
    title: "Software Engineer I",
    subtitle: "Intern: Jan–May 2024, FTE: Jun 2024–Present",
    company: "Guidewire Software",
    period: "Jan 2024 – Present",
    location: "Bengaluru, India",
    metrics: ["50+ engineers served", "60% effort reduction", ">80% test coverage"],
    bullets: [
      "Built React dashboards for infrastructure usage monitoring, serving 50+ internal engineers with real-time visibility into AWS resource allocation and cost metrics.",
      "Developed secure service APIs with role-based access control and audit logging, reducing unauthorized access incidents across staging and production environments.",
      "Automated weekly operational reporting using Python, MySQL, and Slack APIs, cutting manual tracking effort by 60% and eliminating reporting delays for stakeholder teams.",
      "Built Kafka-based event-driven integration for cloud infrastructure lifecycle tracking, including schema design, listener lifecycle management, and reconciliation APIs used for billing and compliance reporting.",
      "Maintained >80% unit test coverage through rigorous testing practices, code reviews, and CI enforcement.",
    ],
    defaultExpanded: false,
  },
  {
    id: "cvowl",
    title: "Full Stack Developer Intern",
    company: "CV Owl",
    period: "Oct 2022 – Oct 2023",
    location: "Remote",
    metrics: ["25% engagement boost", "40% faster load times"],
    bullets: [
      "Improved platform engagement by 25% through performance optimization and user flow redesigns across the resume-building workflow.",
      "Led a 3-member design team; integrated AWS S3 and CloudFront for static asset delivery, reducing page load times by 40%.",
    ],
    defaultExpanded: true,
  },
  {
    id: "hyperswitch",
    title: "Open Source Contributor",
    subtitle: "Production-grade Payment Orchestrator",
    company: "HyperSwitch – Juspay",
    period: "Oct 2023 – Nov 2023",
    location: "Remote",
    metrics: ["Rust", "Open Source"],
    bullets: [
      "Improved backend request routing in a production-grade open-source payment orchestrator (Rust); collaborated with core maintainers to implement a new identifier structure, increasing connector compatibility across payment providers.",
    ],
    defaultExpanded: true,
  },
]

// ─── Projects ───────────────────────────────────────────────────────────────

export interface Project {
  id: string
  title: string
  tagline: string
  date: string
  tech: string[]
  bullets: string[]
  github?: string
  external?: string
  badge?: string
}

export const projects: Project[] = [
  {
    id: "cloudwire",
    title: "Cloudwire",
    tagline: "AWS Infrastructure Visualizer",
    date: "Mar 2026",
    tech: ["Python", "FastAPI", "React", "Boto3", "NetworkX"],
    bullets: [
      "Built and open-sourced a full-stack AWS infrastructure visualization tool (PyPI-published) with 24 dedicated service scanners, relationship inference via IAM policy parsing, env var references, and event triggers.",
      "Engineered a custom SVG graph engine with VPC topology mapping, blast radius analysis, Terraform state import, and multiple layout modes — runs fully local with zero data leaving the user's machine.",
    ],
    github: "https://github.com/Himanshu-370",
    external: "https://pypi.org/project/cloudwire/",
    badge: "Open Source",
  },
  {
    id: "featureflow",
    title: "Feature Flow",
    tagline: "AI-Powered Jira Automation",
    date: "Sep 2025",
    tech: ["Flask", "React", "Docker", "MCP", "LLMs"],
    bullets: [
      "Built a full-stack tool that converts Aha! feature context into structured Jira stories using LLMs, reducing manual story writing by 90% with dry-run validation, board-aware field assignments, and Excel/Jira export.",
      "Architected an MCP server gateway (10 tools) enabling Claude Desktop/Cursor integration, with provider-based Aha! and Jira clients and customizable prompt system requiring no code changes.",
    ],
    github: "https://github.com/Himanshu-370",
  },
  {
    id: "vidvortex",
    title: "VidVortex",
    tagline: "Video Chat with Strangers",
    date: "2023",
    tech: ["Socket.io", "WebRTC", "JavaScript", "MongoDB", "Express.js"],
    bullets: [
      "Multi-stranger video chat application using WebRTC and Socket.IO for real-time communication with dynamic room allocation.",
      "Optimized user interface for enhanced user retention and built a scalable signaling server.",
    ],
    github: "https://github.com/Himanshu-370",
  },
]

// ─── Education ──────────────────────────────────────────────────────────────

export interface Education {
  institution: string
  degree: string
  cgpa: string
  period: string
  location: string
}

export const education: Education = {
  institution: "Shiv Nadar Institute of Eminence",
  degree: "B.Tech in Electronics and Communication Engineering",
  cgpa: "7.5 CGPA",
  period: "Aug 2020 – May 2024",
  location: "Greater Noida, India",
}

// ─── Achievements ───────────────────────────────────────────────────────────

export const achievements: string[] = [
  'Winner — "Best Beginner Hack", MLH Hackathon (200+ participants)',
  "2nd Place — Design-a-thon and Front-a-thon, Technical Fest at SNU",
]

// ─── Navigation ─────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  sectionId: string
}

export const navItems: NavItem[] = [
  { label: "About", sectionId: "about" },
  { label: "Skills", sectionId: "skills" },
  { label: "Experience", sectionId: "experience" },
  { label: "Projects", sectionId: "projects" },
  { label: "Contact", sectionId: "contact" },
]

// ─── Social Links ───────────────────────────────────────────────────────────

export const socialLinks = {
  github: "https://github.com/Himanshu-370",
  linkedin: "https://www.linkedin.com/in/himanshusingh20/",
  email: "himanshuich20@gmail.com",
  website: "https://himanshusingh.dev",
} as const
