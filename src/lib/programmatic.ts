import {
  getBuildIdeas,
  getReportTopics,
  getTopic,
  getTopics,
  plainMarkdown,
} from "./content";
import type {
  BuildIdeaSummary,
  Lang,
  PersonaDefinition,
  PersonaPage,
} from "./types";

export const PERSONAS: PersonaDefinition[] = [
  {
    slug: "indie-hackers",
    label: { en: "Indie Hackers", zh: "独立开发者" },
    targetKeyword: {
      en: "AI startup ideas for indie hackers",
      zh: "独立开发者 AI 创业点子",
    },
    description: {
      en: "Signal-backed build ideas for solo builders who need small, testable products with a clear first buyer.",
      zh: "给独立开发者的信号驱动 build ideas，重点是小、可验证、有清晰第一批买家的产品方向。",
    },
    directAnswer: {
      en: "The best AI startup ideas for indie hackers are narrow products with visible buyer urgency, a small first deliverable, and evidence from current public signals. BuilderPulse tracks those signals daily and organizes them into build ideas solo founders can validate quickly.",
      zh: "适合独立开发者的 AI 创业点子通常很窄，有明确买家、有第一份可交付物，并且能从当前公共信号中看到紧迫性。BuilderPulse 每天追踪这些信号，并整理成可快速验证的 build ideas。",
    },
    searchIntent: {
      en: "Find practical AI product ideas that a solo founder can validate without a large team.",
      zh: "寻找不需要大团队、可以由独立开发者快速验证的 AI 产品点子。",
    },
    useCases: {
      en: [
        "Pick a two-hour validation project",
        "Find a buyer before building a full SaaS",
        "Turn a noisy AI trend into a small paid report or tool",
      ],
      zh: [
        "选择一个两小时验证项目",
        "在做完整 SaaS 前先找到买家",
        "把嘈杂 AI 趋势压缩成小型付费报告或工具",
      ],
    },
    topicSlugs: ["ai-agents", "microsaas-ideas", "local-ai"],
    keywords: ["indie", "solo", "builder", "build idea", "paid", "buyer"],
  },
  {
    slug: "microsaas-founders",
    label: { en: "MicroSaaS Founders", zh: "MicroSaaS 创始人" },
    targetKeyword: {
      en: "MicroSaaS ideas for developers",
      zh: "开发者 MicroSaaS 点子",
    },
    description: {
      en: "Small software opportunities where a developer can package a report, checklist, monitor, or workflow into a paid product.",
      zh: "适合开发者包装成付费产品的小型软件机会，包括报告、清单、监控和工作流工具。",
    },
    directAnswer: {
      en: "Strong MicroSaaS ideas for developers usually come from operational pain: costs, compliance, migrations, support gaps, or repeated manual checks. BuilderPulse highlights those moments when a narrow product can be sold before it becomes a large platform.",
      zh: "适合开发者的 MicroSaaS 点子通常来自运营痛点：成本、合规、迁移、支持缺口或重复人工检查。BuilderPulse 会标出这些能先卖窄产品、再考虑平台化的机会。",
    },
    searchIntent: {
      en: "Find narrow SaaS ideas that can be built by one technical founder and sold to a specific team.",
      zh: "寻找一个技术创始人能做、且能卖给具体团队的窄 SaaS 点子。",
    },
    useCases: {
      en: [
        "Package a repeatable audit into a paid report",
        "Find compliance or infrastructure pain with a deadline",
        "Turn developer complaints into a small workflow product",
      ],
      zh: [
        "把重复审计包装成付费报告",
        "寻找带截止日期的合规或基础设施痛点",
        "把开发者抱怨翻译成小型工作流产品",
      ],
    },
    topicSlugs: ["microsaas-ideas", "developer-tools", "ai-cost-risk"],
    keywords: ["microsaas", "micro saas", "report", "checklist", "receipt"],
  },
  {
    slug: "developer-tool-founders",
    label: { en: "Developer Tool Founders", zh: "开发者工具创始人" },
    targetKeyword: {
      en: "developer tool startup ideas",
      zh: "开发者工具创业点子",
    },
    description: {
      en: "Build ideas for founders watching developer workflows, open-source adoption, security gaps, local machines, and AI coding behavior.",
      zh: "面向开发者工具创始人的 build ideas，关注开发工作流、开源采用、安全缺口、本地机器和 AI 编码行为。",
    },
    directAnswer: {
      en: "Developer tool startup ideas are strongest when they remove hidden work from engineering teams: setup, security review, cost control, migration planning, or trust checks. BuilderPulse surfaces these gaps from developer discussions and open-source adoption signals.",
      zh: "好的开发者工具创业点子通常能移除工程团队的隐藏工作：配置、安全审查、成本控制、迁移规划或可信检查。BuilderPulse 从开发者讨论和开源采用信号中寻找这些缺口。",
    },
    searchIntent: {
      en: "Find developer-facing product ideas backed by workflow pain and open-source signals.",
      zh: "寻找由工作流痛点和开源信号支撑的开发者工具产品方向。",
    },
    useCases: {
      en: [
        "Spot workflow gaps around AI coding",
        "Find adoption services around fast-growing repositories",
        "Prioritize trust, security, and cost visibility products",
      ],
      zh: [
        "发现 AI 编码周围的工作流缺口",
        "围绕快速增长仓库寻找采用服务",
        "优先判断可信、安全和成本可见性产品",
      ],
    },
    topicSlugs: ["developer-tools", "open-source", "ai-cost-risk"],
    keywords: ["developer tool", "devtool", "github", "repo", "security"],
  },
  {
    slug: "ai-agent-builders",
    label: { en: "AI Agent Builders", zh: "AI Agent 构建者" },
    targetKeyword: {
      en: "AI agent product ideas",
      zh: "AI Agent 产品点子",
    },
    description: {
      en: "Opportunities around agents that execute actions, spend money, touch private data, or need proof and permission boundaries.",
      zh: "围绕能执行动作、花钱、接触私有数据、需要证明和权限边界的 AI agent 机会。",
    },
    directAnswer: {
      en: "AI agent product ideas become more sellable when they focus on control: permissions, spending limits, audit trails, execution proof, and handoff to humans. BuilderPulse tracks agent failures and adoption signals that reveal where teams need safeguards.",
      zh: "AI agent 产品点子在聚焦控制权时更容易卖：权限、花费上限、审计记录、执行证明和人工交接。BuilderPulse 追踪 agent 失败案例和采用信号，找出团队需要护栏的位置。",
    },
    searchIntent: {
      en: "Find AI agent ideas that solve trust, permission, execution, and operational risk problems.",
      zh: "寻找解决信任、权限、执行和运营风险问题的 AI agent 点子。",
    },
    useCases: {
      en: [
        "Design agent safety and approval products",
        "Find proof-of-execution opportunities",
        "Monitor AI spend and permission drift",
      ],
      zh: [
        "设计 agent 安全和审批产品",
        "寻找执行证明类机会",
        "监控 AI 花费和权限漂移",
      ],
    },
    topicSlugs: ["ai-agents", "ai-cost-risk", "developer-tools"],
    keywords: ["agent", "permission", "spend", "execution", "workflow"],
  },
  {
    slug: "open-source-founders",
    label: { en: "Open Source Founders", zh: "开源商业化创始人" },
    targetKeyword: {
      en: "open source commercial opportunities",
      zh: "开源商业化机会",
    },
    description: {
      en: "Commercial opportunities created by fast-growing repositories, maintainer limits, adoption risks, and enterprise support gaps.",
      zh: "由快速增长仓库、维护者边界、采用风险和企业支持缺口带来的商业化机会。",
    },
    directAnswer: {
      en: "Open-source commercial opportunities often come from adoption friction rather than the repository itself: approval, security review, support coverage, upgrade timing, and migration work. BuilderPulse tracks when those frictions become visible enough to package.",
      zh: "开源商业化机会往往不来自仓库本身，而来自采用摩擦：审批、安全审查、支持覆盖、升级时机和迁移工作。BuilderPulse 会追踪这些摩擦何时变得足够可包装。",
    },
    searchIntent: {
      en: "Find commercial products and services around open-source adoption signals.",
      zh: "寻找围绕开源采用信号的商业产品和服务机会。",
    },
    useCases: {
      en: [
        "Turn maintainer constraints into support products",
        "Package adoption risk reviews",
        "Find commercial gaps around trending repositories",
      ],
      zh: [
        "把维护者限制转成支持产品",
        "包装采用风险审查",
        "围绕热门仓库寻找商业缺口",
      ],
    },
    topicSlugs: ["open-source", "developer-tools", "ai-cost-risk"],
    keywords: ["open source", "maintainer", "repo", "github", "support"],
  },
  {
    slug: "local-ai-builders",
    label: { en: "Local AI Builders", zh: "本地 AI 构建者" },
    targetKeyword: {
      en: "local AI product ideas",
      zh: "本地 AI 产品点子",
    },
    description: {
      en: "Product ideas around private models, offline workflows, on-device processing, cloud exits, and predictable AI costs.",
      zh: "围绕私有模型、离线工作流、端侧处理、云服务退出和可预测 AI 成本的产品点子。",
    },
    directAnswer: {
      en: "Local AI product ideas are strongest when privacy, offline access, latency, or predictable costs matter more than frontier model quality. BuilderPulse tracks when builders discuss replacing cloud AI with local workflows that can become products.",
      zh: "本地 AI 产品点子在隐私、离线访问、延迟或可预测成本比前沿模型质量更重要时最强。BuilderPulse 追踪构建者何时讨论用本地工作流替代云端 AI，并把它转成产品机会。",
    },
    searchIntent: {
      en: "Find product opportunities around local models, privacy, offline access, and cloud replacement.",
      zh: "寻找围绕本地模型、隐私、离线访问和云端替代的产品机会。",
    },
    useCases: {
      en: [
        "Find privacy-sensitive AI workflows",
        "Package local-model readiness checks",
        "Build offline or on-device alternatives",
      ],
      zh: [
        "发现隐私敏感的 AI 工作流",
        "包装本地模型就绪度检查",
        "构建离线或端侧替代方案",
      ],
    },
    topicSlugs: ["local-ai", "developer-tools", "ai-cost-risk"],
    keywords: ["local", "offline", "privacy", "model", "on-device"],
  },
];

function ideaHaystack(idea: BuildIdeaSummary): string {
  return plainMarkdown(
    `${idea.title}\n${idea.summary}\n${idea.primaryReport.title}`,
  ).toLowerCase();
}

function scoreIdea(idea: BuildIdeaSummary, persona: PersonaDefinition): number {
  const haystack = ideaHaystack(idea);
  const reportTopics = getReportTopics(idea.primaryReport).map(
    (topic) => topic.slug,
  );
  const topicScore = persona.topicSlugs.filter((slug) =>
    reportTopics.includes(slug),
  ).length;
  const keywordScore = persona.keywords.filter((keyword) =>
    haystack.includes(keyword.toLowerCase()),
  ).length;

  return topicScore * 4 + keywordScore;
}

export function getPersonaDefinition(slug: string): PersonaDefinition | null {
  return PERSONAS.find((persona) => persona.slug === slug) ?? null;
}

export function getPersonaPage(lang: Lang, slug: string): PersonaPage | null {
  const persona = getPersonaDefinition(slug);
  if (!persona) return null;

  const scoredIdeas = getBuildIdeas(lang)
    .map((idea) => ({ idea, score: scoreIdea(idea, persona) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.idea.primaryReport.date.localeCompare(a.idea.primaryReport.date);
    })
    .map(({ idea }) => idea);
  const fallbackIdeas = getBuildIdeas(lang).slice(0, 12);
  const topics = getTopics(lang).filter((topic) =>
    persona.topicSlugs.includes(topic.slug),
  );

  return {
    ...persona,
    ideas: (scoredIdeas.length > 0 ? scoredIdeas : fallbackIdeas).slice(0, 18),
    topics,
  };
}

export function getPersonaPages(lang: Lang): PersonaPage[] {
  return PERSONAS.map((persona) => getPersonaPage(lang, persona.slug)).filter(
    (page): page is PersonaPage => Boolean(page),
  );
}

export function getPersonaTopicLabels(lang: Lang, persona: PersonaDefinition) {
  return persona.topicSlugs
    .map((slug) => getTopic(slug)?.label[lang])
    .filter((label): label is string => Boolean(label));
}
