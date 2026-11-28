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
  summary?: string;
  roles?: {
    title: string;
    start: YearMonth;
    end: YearMonth | null;
    writeups?: { title: string; paragraphs: string[] }[];
  }[];
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
  site: { title: string; twitterHandle: string };
  githubUser: string;
  status: string;
  /** tail is the static/first phrase; rotating phrases are retyped after it in the hero. */
  headline: { lead: string; tail: string; rotating: string[] };
  intro: string;
  careerStart: YearMonth;
  manualStats: { label: string; value: string }[];
  career: CareerSpan[];
  achievements: { spanId: string; text: string }[];
  skills: { label: string; items: string[] }[];
  interests: { label: string; icon: string; description: string }[];
  socials: { label: string; url: string }[];
  calLink: string | null;
  resumeUrl: string;
  showcaseRepos: ShowcaseRepo[];
  manualProjects: ManualProject[];
  hiddenPRs: string[];
}

export const profile: Profile = {
  name: "Himanshu Singh",
  site: { title: "Himanshu Singh — Software Engineer", twitterHandle: "@himlabs" },
  githubUser: "Himanshu-370",
  status: "open to opportunities",
  headline: {
    lead: "Software engineer",
    tail: "keeping infra observable & agents honest.",
    rotating: [
      "making AI agents easier to trust.",
      "turning “what depends on this?” into a map.",
      "sending fixes upstream when I find them.",
      "away from keyboard, probably cooking.",
    ],
  },
  intro:
    "Software Engineer II at Guidewire in Bengaluru. I build internal platforms, infrastructure visibility tools and AI-agent tooling, and send fixes upstream.",
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
      role: "Software Engineering",
      org: "Guidewire Software",
      start: "2024-01",
      end: null,
      location: "Bengaluru, India",
      kind: "work",
      metrics: ["50+ engineers served", "60% effort reduction", ">80% test coverage"],
      bullets: [
        "Built React dashboards for infrastructure usage monitoring, serving 50+ internal engineers with real-time visibility into AWS resource allocation and cost metrics.",
        "Developed secure service APIs with role-based access control and audit logging, reducing unauthorized access incidents across staging and production environments.",
        "Automated weekly operational reporting using Python, MySQL, and Slack APIs, cutting manual tracking effort by 60% and eliminating reporting delays for stakeholder teams.",
        "Built Kafka-based event-driven integration for cloud infrastructure lifecycle tracking, including schema design, listener lifecycle management, and reconciliation APIs used for billing and compliance reporting.",
        "Maintained >80% unit test coverage through rigorous testing practices, code reviews, and CI enforcement.",
      ],
      summary:
        "I worked on an enterprise knowledge assistant that retrieves information from structured and unstructured sources and turns natural-language questions into SQL. My work covered the quality of the knowledge it relied on, how the agent used that knowledge, and how engineers could troubleshoot it.",
      roles: [
        {
          title: "Software Engineer II",
          start: "2026-10",
          end: null,
          writeups: [
            {
              title: "Measuring knowledge-base quality during ingestion",
              paragraphs: [
                "I built an evaluation suite to check whether the knowledge generated during ingestion was complete enough to use. The suite started as a local tool and grew to ten deterministic checks covering description coverage, metadata fidelity, lineage resolution, query examples, and section completeness. I added tests for empty and failed inputs so the evaluator could report those cases clearly.",
                "I integrated it into the ingestion workflow as a report-only stage. Each evaluation writes a machine-readable report to object storage, publishes a short workflow summary, and emits structured logs. Engineers can see which checks failed while the knowledge-base build continues.",
              ],
            },
          ],
        },
        {
          title: "Software Engineer I",
          start: "2024-06",
          end: "2026-09",
          writeups: [
            {
              title: "Debugging a natural-language-to-SQL failure",
              paragraphs: [
                "An intermittent failure showed up in two ways. The agent sometimes got stuck repeating schema lookups until the request timed out. In other cases, it guessed a field and generated invalid SQL. I traced the failure to ambiguous schema discovery and updated the agent’s guidance to favor canonical fields, rule out unsuitable columns, and use schema-backed fields where available.",
                "I reran the previously failing query. The agent completed the request, selected the appropriate field, and produced SQL that passed both SQL validation and downstream query checks.",
              ],
            },
            {
              title: "Making agent instructions easier to maintain",
              paragraphs: [
                "The agent’s main instruction file combined guidance for several different tasks. I moved that guidance into six skills the agent could load on demand, covering SQL generation, SQL validation, schema discovery, lineage, business terminology, and error recovery.",
                "I connected the skills to the framework’s loading middleware and exercised representative queries across the skill set. The main instruction file went from roughly 462 lines to 250, and each skill could be maintained independently.",
              ],
            },
            {
              title: "Making agent API requests easier to troubleshoot",
              paragraphs: [
                "I built reusable dashboards for API performance and errors, with request-level views that could be used across development and production. I also added tenant, workspace, and conversation-thread identifiers to structured logs.",
                "Those identifiers gave engineers a way to correlate API activity with the relevant workspace and conversation during troubleshooting without relying on full conversation payloads.",
              ],
            },
          ],
        },
        {
          title: "Software Engineering Intern",
          start: "2024-01",
          end: "2024-05",
        },
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
    { label: "Cooking", icon: "🍳", description: "Trying a new recipe is as much fun as getting an old one right." },
    { label: "Football", icon: "⚽", description: "A good reminder of how much can happen in 90 minutes." },
    { label: "Cricket", icon: "🏏", description: "I like how one over can change the whole game." },
    { label: "Swimming", icon: "🏊", description: "A few laps and a little time away from screens." },
  ],
  socials: [
    { label: "GitHub", url: "https://github.com/Himanshu-370" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/himanshusingh20/" },
    { label: "X", url: "https://x.com/himlabs" },
  ],
  calLink: "himlabs/intro",
  resumeUrl: "/Himanshu_Singh_Resume.pdf",
  showcaseRepos: [
    { repo: "son-of-anton", stack: ["TypeScript", "Docker", "Agents"] },
    { repo: "localMind", slug: "localmind", stack: ["Python", "Ollama", "GraphRAG"] },
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
  hiddenPRs: [
    "https://github.com/acmsnu/2022/pull/8",
    "https://github.com/shreya024/MemoriesApp/pull/14",
    "https://github.com/shreya024/MemoriesApp/pull/15",
    "https://github.com/shreya024/MemoriesApp/pull/16",
    "https://github.com/shreya024/MemoriesApp/pull/24",
    "https://github.com/firstcontributions/first-contributions/pull/51482",
    "https://github.com/firstcontributions/first-contributions/pull/51483",
  ],
};
