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
      "sending fixes upstream when I find them.",
      "away from keyboard, probably playing football or cooking.",
      "opening a PR because it bothered me.",
      "building the tools I wish I had yesterday.",
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
        "I joined Guidewire as an intern in 2024 and now work as a Software Engineer II. I’ve worked on cloud data services, including how they provision resources, handle lifecycle events, and recover across regions. I’ve also worked on an enterprise AI assistant, building checks for the knowledge it uses and improving how it generates SQL and how engineers troubleshoot it.",
      roles: [
        {
          title: "Software Engineer II",
          start: "2026-10",
          end: null,
          writeups: [
            {
              title: "Checking the knowledge an agent relies on",
              paragraphs: [
                "A knowledge-base build can finish even when the output is missing descriptions, links between data, or useful query examples. I built ten checks to catch those gaps during ingestion and tested how they handle empty inputs and failed runs.",
                "I wired the checks into the ingestion workflow so engineers get a short summary and a detailed report. The checks flag what needs attention while the build keeps running. I’m now turning those checks into a reusable evaluation framework for knowledge-base ingestion.",
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
              title: "Getting a stuck SQL agent to finish the query",
              paragraphs: [
                "The same question could send the agent down two paths. It could keep looking up the schema until it timed out, or guess a field and return SQL that didn’t work. I traced both behaviors to ambiguous schema lookups and updated the guidance to steer the agent toward the right fields.",
                "I reran the question that had exposed the problem. The agent finished, chose the right field, and produced SQL that passed validation and the downstream query checks.",
              ],
            },
            {
              title: "Breaking up one large set of agent instructions",
              paragraphs: [
                "The agent used one file for everything from finding tables to checking SQL and recovering from errors. That made it harder to change the guidance for one task on its own. I split it into six skills the agent could load when it needed them.",
                "I wired the skills into the framework and tried representative queries across all six. The main file went from roughly 462 lines to 250, with each skill now maintained on its own.",
              ],
            },
            {
              title: "Following an agent request through the logs",
              paragraphs: [
                "When an API request was slow or failed, engineers needed to connect it to the right tenant, workspace, and conversation. I added those identifiers to structured logs and built dashboards with request-level views of performance and errors.",
                "The same dashboards could be used in development and production. Engineers could follow a request using the identifiers in the logs without pulling up the full conversation.",
              ],
            },
            {
              title: "Testing recovery in another region",
              paragraphs: [
                "Moving the service to another region meant coordinating three things at once. The database had to switch roles, the application had to scale in the right region, and event processing had to run in the right place.",
                "I helped exercise manual failover and failback in a proof of concept. Once the service was running in the recovery region, I checked that its APIs worked there.",
              ],
            },
            {
              title: "Finding why a deletion event pointed to an old run",
              paragraphs: [
                "A deletion event could carry an identifier from an earlier provisioning cycle. The mismatch showed up when the same workflow was run more than once, so I repeated the provision and deprovision sequence and compared what the API returned with the events the service sent.",
                "I documented the sequence that exposed the mismatch so the team could reproduce it and see exactly where the API state and the event disagreed.",
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
