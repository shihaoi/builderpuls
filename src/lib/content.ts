import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type {
  BuildIdeaSummary,
  Lang,
  Manifest,
  ReportMeta,
  ReportSection,
  ReportSectionKey,
  SearchEntry,
  TopicDefinition,
  TopicSummary,
  TocItem,
} from "./types";
import { formatDisplayDate } from "./format";

const CONTENT_DIR = path.join(process.cwd(), "content");
const MANIFEST_PATH = path.join(CONTENT_DIR, "manifest.json");

export const LANGS: Lang[] = [
  "en",
  "zh",
  "es",
  "pt",
  "fr",
  "de",
  "ar",
  "ru",
  "it",
  "ja",
  "ko",
];

export const TOPICS: TopicDefinition[] = [
  {
    slug: "ai-agents",
    label: {
      en: "AI Agents",
      zh: "AI Agent",
      es: "Agentes de IA",
      pt: "Agentes de IA",
      fr: "Agents IA",
      de: "KI-Agenten",
      ar: "وكلاء الذكاء الاصطناعي",
      ru: "ИИ-агенты",
      it: "Agenti IA",
      ja: "AIエージェント",
      ko: "AI 에이전트",
    },
    description: {
      en: "Execution, payments, proofs, workflow automation, and risk signals around agentic software.",
      zh: "围绕 AI agent 执行动作、支付、证明、工作流自动化和风险控制的机会信号。",
      es: "Ejecución, pagos, pruebas, automatización de flujos y señales de riesgo en software agéntico.",
      pt: "Execução, pagos, provas, automação de fluxos e sinais de risco em software agêntico.",
      fr: "Exécution, paiements, preuves, automatisation des flux et signaux de risque autour des logiciels agentiques.",
      de: "Ausführung, Zahlungen, Nachweise, Workflow-Automatisierung und Risikosignale rund um agentische Software.",
      ar: "التنفيذ والمدفوعات والأدلة وأتمتة سير العمل وإشارات المخاطر حول البرمجيات الوكيلية.",
      ru: "Выполнение, платежи, доказательства, автоматизация_workflow и сигналы рисков вокруг агентного ПО.",
      it: "Esecuzione, pagamenti, prove, automazione dei workflow e segnali di rischio nel software agentico.",
      ja: "エージェント型ソフトウェアにおける実行、支払、証明、ワークフロー自動化、リスクシグナル。",
      ko: "에이전트 소프트웨어의 실행, 결제, 증명, 워크플로우 자동화 및 위험 신호.",
    },
    keywords: [
      "agent",
      "agents",
      "ai agent",
      "execution proof",
      "代理",
      "工作流",
      "审批",
    ],
  },
  {
    slug: "developer-tools",
    label: {
      en: "Developer Tools",
      zh: "开发者工具",
      es: "Herramientas de desarrollo",
      pt: "Ferramentas de desenvolvimento",
      fr: "Outils de développement",
      de: "Entwickler-Tools",
      ar: "أدوات المطورين",
      ru: "Инструменты разработчика",
      it: "Strumenti per sviluppatori",
      ja: "開発者ツール",
      ko: "개발자 도구",
    },
    description: {
      en: "Signals for tools that help builders ship, debug, secure, measure, and operate software.",
      zh: "帮助构建者发布、调试、安全审查、计量和运营软件的工具机会。",
      es: "Señales para herramientas que ayudan a los builders a enviar, depurar, asegurar, medir y operar software.",
      pt: "Sinais para ferramentas que ajudam builders a enviar, depurar, proteger, medir e operar software.",
      fr: "Signaux pour des outils qui aident les builders à livrer, déboguer, sécuriser, mesurer et opérer des logiciels.",
      de: "Signale für Tools, die Buildern beim Shippen, Debuggen, Sichern, Messen und Betreiben von Software helfen.",
      ar: "إشارات لأدوات تساعد البنّائين على الشحن وتصحيح الأخطاء وتأمين وقياس وتشغيل البرمجيات.",
      ru: "Сигналы для инструментов, помогающих билдерам доставлять, отлаживать, защищать, измерять и эксплуатировать ПО.",
      it: "Segnali per strumenti che aiutano i builder a spedire, debuggare, proteggere, misurare e gestire il software.",
      ja: "ビルダーがソフトウェアを出荷、デバッグ、セキュリティ保護、測定、運用するためのツールのシグナル。",
      ko: "빌더가 소프트웨어를 배포, 디버그, 보안, 측정, 운영하는 데 도움이 되는 도구에 대한 신호.",
    },
    keywords: [
      "devtool",
      "coding",
      "cli",
      "developer tool",
      "dev machine",
      "开发者工具",
      "命令行",
    ],
  },
  {
    slug: "microsaas-ideas",
    label: {
      en: "MicroSaaS Ideas",
      zh: "MicroSaaS 点子",
      es: "Ideas MicroSaaS",
      pt: "Ideias MicroSaaS",
      fr: "Idées MicroSaaS",
      de: "MicroSaaS-Ideen",
      ar: "أفكار MicroSaaS",
      ru: "Идеи MicroSaaS",
      it: "Idee MicroSaaS",
      ja: "MicroSaaSアイデア",
      ko: "MicroSaaS 아이디어",
    },
    description: {
      en: "Small, sellable software ideas with a clear buyer, urgency, and first-package shape.",
      zh: "有清晰买家、紧迫性和第一份交付形态的小型可销售软件机会。",
      es: "Ideas de software pequeñas y vendibles con un comprador claro, urgencia y forma de primer paquete.",
      pt: "Ideias de software pequenas e vendáveis com um comprador claro, urgência e formato de primeiro pacote.",
      fr: "Petites idées logicielles vendables avec un acheteur clair, une urgence et une forme de premier package.",
      de: "Kleine, verkaufbare Software-Ideen mit klarem Käufer, Dringlichkeit und Erst-Paket-Form.",
      ar: "أفكار برمجية صغيرة وقابلة للبيع مع مشتري واضح وشكل الحزمة الأولى.",
      ru: "Небольшие, продаваемые идеи ПО с ясным покупателем, срочностью и формой первого пакета.",
      it: "Piccole idee software vendibili con un acquirente chiaro, urgenza e forma del primo pacchetto.",
      ja: "明確なバイヤー、緊急性、最初のパッケージの形を持つ小さく売れるソフトウェアアイデア。",
      ko: "명확한 구매자, 긴급성, 첫 번째 패키지 형태를 갖춘 작고 판매 가능한 소프트웨어 아이디어.",
    },
    keywords: [
      "microsaas",
      "micro saas",
      "solo founder",
      "indie hacker",
      "build idea",
      "sellable",
      "独立开发",
      "小型 saas",
      "独立创业",
    ],
  },
  {
    slug: "open-source",
    label: {
      en: "Open Source Signals",
      zh: "开源信号",
      es: "Señales de código abierto",
      pt: "Sinais de código aberto",
      fr: "Signaux open source",
      de: "Open-Source-Signale",
      ar: "إشارات المصادر المفتوحة",
      ru: "Сигналы открытого кода",
      it: "Segnali open source",
      ja: "オープンソースシグナル",
      ko: "오픈소스 신호",
    },
    description: {
      en: "Commercial opportunities created by fast-growing repositories, maintainer limits, and adoption gaps.",
      zh: "由快速增长仓库、维护者边界和团队采用缺口带来的商业机会。",
      es: "Oportunidades comerciales creadas por repositorios de rápido crecimiento, límites de mantenedores y brechas de adopción.",
      pt: "Oportunidades comerciais criadas por repositórios de rápido crescimento, limites de mantenedores e lacunas de adoção.",
      fr: "Opportunités commerciales créées par les dépôts à croissance rapide, les limites de mainteneurs et les écarts d'adoption.",
      de: "Kommerzielle Chancen durch schnell wachsende Repositories, Maintainer-Grenzen und Adoptionslücken.",
      ar: "فرص تجارية أنشأها المستودعات سريعة النمو وحدود المسؤولين وفجوات التبني.",
      ru: "Коммерческие возможности, созданные быстрорастущими репозиториями, ограничениями мейнтейнеров и пробелами во внедрении.",
      it: "Opportunità commerciali create da repository in rapida crescita, limiti dei maintainer e lacune nell'adozione.",
      ja: "急速に成長するリポジトリ、メンテナーの限界、採用のギャップが生む商業機会。",
      ko: "빠르게 성장하는 저장소, 유지관리자 한계, 채택 격차가 만드는 상업적 기회.",
    },
    keywords: [
      "open source",
      "repo",
      "repository",
      "maintainer",
      "stars",
      "license",
      "开源",
      "维护者",
      "仓库",
      "stars",
      "商业版本",
    ],
  },
  {
    slug: "local-ai",
    label: {
      en: "Local AI",
      zh: "本地 AI",
      es: "IA Local",
      pt: "IA Local",
      fr: "IA Locale",
      de: "Lokale KI",
      ar: "الذكاء الاصطناعي المحلي",
      ru: "Локальный ИИ",
      it: "IA Locale",
      ja: "ローカルAI",
      ko: "로컬 AI",
    },
    description: {
      en: "Local models, private workflows, on-device tools, and cloud replacement signals.",
      zh: "本地模型、私有工作流、端侧工具和替代云模型的机会信号。",
      es: "Modelos locales, flujos de trabajo privados, herramientas en dispositivo y señales de reemplazo de la nube.",
      pt: "Modelos locais, fluxos de trabalho privados, ferramentas no dispositivo e sinais de substituição de nuvem.",
      fr: "Modèles locaux, flux de travail privés, outils sur appareil et signaux de remplacement du cloud.",
      de: "Lokale Modelle, private Workflows, On-Device-Tools und Cloud-Ersetzungssignale.",
      ar: "النماذج المحلية وسير العمل الخاص والأدوات على الجهاز وإشارات استبدال السحابة.",
      ru: "Локальные модели, приватные_workflow, инструменты на устройстве и сигналы замены облака.",
      it: "Modelli locali, workflow privati, strumenti on-device e segnali di sostituzione del cloud.",
      ja: "ローカルモデル、プライベートワークフロー、オンデバイスツール、クラウド置換シグナル。",
      ko: "로컬 모델, 프라이빗 워크플로우, 온디바이스 도구, 클라우드 대체 신호.",
    },
    keywords: [
      "local model",
      "local ai",
      "on-device",
      "offline",
      "privacy",
      "qwen",
      "gemma",
      "本地模型",
      "本地 ai",
      "离线",
      "隐私",
      "端侧",
    ],
  },
  {
    slug: "ai-cost-risk",
    label: {
      en: "AI Cost & Risk",
      zh: "AI 成本与风险",
      es: "Costo y riesgo de IA",
      pt: "Custo e risco de IA",
      fr: "Coût et risque de l'IA",
      de: "KI-Kosten & Risiko",
      ar: "تكلفة ومخاطر الذكاء الاصطناعي",
      ru: "Стоимость и риски ИИ",
      it: "Costo e rischio IA",
      ja: "AIコストとリスク",
      ko: "AI 비용 및 위험",
    },
    description: {
      en: "Budget shocks, vendor lock-in, model exits, security receipts, and operational risk checklists.",
      zh: "预算冲击、供应商锁定、模型退出、安全凭证和运营风险清单。",
      es: "Sorpresas de presupuesto, dependencia de proveedores, salidas de modelos, recibos de seguridad y listas de riesgo operativo.",
      pt: "Choques de orçamento, dependência de fornecedores, saídas de modelos, recibos de segurança e listas de risco operacional.",
      fr: "Chocs budgétaires, dépendance fournisseur, sorties de modèles, reçus de sécurité et listes de risques opérationnels.",
      de: "Budgetschocks, Anbieterabhängigkeit, Model-Exits, Sicherheitsbelege und operative Risiko-Checklisten.",
      ar: "صدمات الميزانية والاعتماد على المزود وخروج النماذج وإيصالات الأمور قوائم المخاطر التشغيلية.",
      ru: "Бюджетные шоки, привязка к вендору, выход моделей, чеки безопасности и чек-листы операционных рисков.",
      it: "Shock di budget, lock-in dei fornitori, uscite dei modelli, ricevute di sicurezza e checklist dei rischi operativi.",
      ja: "予算ショック、ベンダーロックイン、モデル終了、セキュリティレシート、運用リスクチェックリスト。",
      ko: "예산 충격, 벤더 종속, 모델 종료, 영수증 보안, 운영 위험 체크리스트.",
    },
    keywords: [
      "cost",
      "bill",
      "invoice",
      "pricing",
      "security",
      "risk",
      "vendor",
      "dependency",
      "账单",
      "成本",
      "价格",
      "风险",
      "依赖",
      "供应商",
    ],
  },
];

function readManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {
      syncedAt: null,
      source: "https://github.com/BuilderPulse/BuilderPulse",
      latest: Object.fromEntries(LANGS.map((l) => [l, null])) as Record<
        Lang,
        string | null
      >,
      reports: [],
      files: {},
    };
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

export function getManifest(): Manifest {
  return readManifest();
}

export function getReports(lang: Lang): ReportMeta[] {
  const manifest = readManifest();
  return manifest.reports
    .filter((r) => r.lang === lang)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getLatestDate(lang: Lang): string | null {
  const manifest = readManifest();
  return manifest.latest[lang];
}

export function getReport(lang: Lang, date: string): ReportMeta | null {
  const reports = getReports(lang);
  return reports.find((r) => r.date === date) ?? null;
}

export function getReportContent(lang: Lang, date: string): string | null {
  const filePath = path.join(CONTENT_DIR, lang, "2026", `${date}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

export function getAllReportDates(lang: Lang): string[] {
  return getReports(lang).map((r) => r.date);
}

export function plainMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getSearchEntries(lang: Lang): SearchEntry[] {
  return getReports(lang).map((report) => {
    const content = getReportContent(lang, report.date);

    return {
      date: report.date,
      href: `/${lang}/${report.date}`,
      title: report.buildIdea || report.title || formatDisplayDate(report.date, lang),
      summary: report.summary,
      dateLabel: formatDisplayDate(report.date, lang),
      content: content ? plainMarkdown(content) : "",
    };
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function reportTopicHaystack(report: ReportMeta): string {
  return plainMarkdown(
    `${report.title}\n${report.buildIdea}\n${report.summary}`,
  ).toLowerCase();
}

export function getTopic(slug: string): TopicDefinition | null {
  return TOPICS.find((topic) => topic.slug === slug) ?? null;
}

export function getReportsForTopic(lang: Lang, slug: string): ReportMeta[] {
  const topic = getTopic(slug);
  if (!topic) return [];
  const keywords = topic.keywords.map((keyword) => keyword.toLowerCase());

  return getReports(lang).filter((report) => {
    const haystack = reportTopicHaystack(report);
    return keywords.some((keyword) => haystack.includes(keyword));
  });
}

export function getTopics(lang: Lang): TopicSummary[] {
  return TOPICS.map((topic) => ({
    ...topic,
    reports: getReportsForTopic(lang, topic.slug),
  }));
}

export function getReportTopics(report: ReportMeta): TopicDefinition[] {
  const haystack = reportTopicHaystack(report);
  return TOPICS.filter((topic) =>
    topic.keywords.some((keyword) => haystack.includes(keyword.toLowerCase())),
  );
}

export function getBuildIdeaSlug(report: ReportMeta): string {
  return slugify(report.buildIdea || report.title || report.date);
}

export function getBuildIdeas(lang: Lang): BuildIdeaSummary[] {
  const grouped = new Map<string, ReportMeta[]>();

  for (const report of getReports(lang)) {
    const slug = getBuildIdeaSlug(report);
    if (!grouped.has(slug)) grouped.set(slug, []);
    grouped.get(slug)!.push(report);
  }

  return Array.from(grouped.entries()).map(([slug, reports]) => {
    const primaryReport = reports[0];
    return {
      slug,
      title: primaryReport.buildIdea || primaryReport.title,
      summary: primaryReport.summary,
      reports,
      primaryReport,
    };
  });
}

export function getBuildIdea(lang: Lang, slug: string): BuildIdeaSummary | null {
  return getBuildIdeas(lang).find((idea) => idea.slug === slug) ?? null;
}

export function getArchivePeriods(lang: Lang): {
  key: string;
  label: string;
  reports: ReportMeta[];
}[] {
  return groupReportsByMonth(getReports(lang), lang).map((group) => {
    const first = group.reports[0];
    const key = first.date.slice(0, 7);
    return { key, label: group.label, reports: group.reports };
  });
}

export function getReportsByArchivePeriod(
  lang: Lang,
  period: string,
): ReportMeta[] {
  if (/^\d{4}$/.test(period)) {
    return getReports(lang).filter((report) => report.date.startsWith(period));
  }

  if (/^\d{4}-\d{2}$/.test(period)) {
    return getReports(lang).filter((report) => report.date.startsWith(period));
  }

  return [];
}

export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const slugger = new GithubSlugger();
  const lines = markdown.split("\n");

  for (const line of lines) {
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);

    if (h2) {
      const rawText = h2[1].trim();
      const text = normalizeHeading(rawText);
      items.push({ id: slugger.slug(rawText), text, level: 2 });
    } else if (h3) {
      const rawText = h3[1].trim();
      const text = normalizeHeading(rawText);
      items.push({ id: slugger.slug(rawText), text, level: 3 });
    }
  }

  return items;
}

const MAIN_SECTION_MARKERS: Record<
  Lang,
  Record<Exclude<ReportSectionKey, "signals">, string[]>
> = {
  zh: {
    discovery: ["发现机会"],
    tech: ["技术选型"],
    competitive: ["竞争情报"],
    trends: ["趋势判断"],
    action: ["行动触发"],
  },
  en: {
    discovery: ["Discovery"],
    tech: ["Tech Radar"],
    competitive: ["Competitive Intel"],
    trends: ["Trends"],
    action: ["Action"],
  },
  es: {
    discovery: ["Descubrimiento"],
    tech: ["Radar tecnológico"],
    competitive: ["Inteligencia competitiva"],
    trends: ["Tendencias"],
    action: ["Acción"],
  },
  pt: {
    discovery: ["Descoberta"],
    tech: ["Radar tecnológico"],
    competitive: ["Inteligência competitiva"],
    trends: ["Tendências"],
    action: ["Ação"],
  },
  fr: {
    discovery: ["Découverte"],
    tech: ["Veille techno"],
    competitive: ["Intelligence concurrentielle"],
    trends: ["Tendances"],
    action: ["Action"],
  },
  de: {
    discovery: ["Entdeckung"],
    tech: ["Tech-Radar"],
    competitive: ["Wettbewerbsanalyse"],
    trends: ["Trends"],
    action: ["Aktion"],
  },
  ar: {
    discovery: ["اكتشاف"],
    tech: ["رادار التقنية"],
    competitive: ["استخبارات المنافسة"],
    trends: ["الاتجاهات"],
    action: ["إجراء"],
  },
  ru: {
    discovery: ["Открытие"],
    tech: ["Тех-радар"],
    competitive: ["Конкурентная разведка"],
    trends: ["Тренды"],
    action: ["Действие"],
  },
  it: {
    discovery: ["Scoperta"],
    tech: ["Radar tecnologico"],
    competitive: ["Intelligence competitiva"],
    trends: ["Tendenze"],
    action: ["Azione"],
  },
  ja: {
    discovery: ["ディスカバリー"],
    tech: ["テックレーダー"],
    competitive: ["競合インテリジェンス"],
    trends: ["トレンド"],
    action: ["アクション"],
  },
  ko: {
    discovery: ["발견"],
    tech: ["기술 레이더"],
    competitive: ["경쟁 인텔리전스"],
    trends: ["트렌드"],
    action: ["액션"],
  },
};

const SECTION_ORDER: ReportSectionKey[] = [
  "signals",
  "discovery",
  "tech",
  "competitive",
  "trends",
  "action",
];

function normalizeHeading(text: string): string {
  return text.replace(/[🔗🔍📝🎯]/gu, "").trim();
}

function splitMarkdownByH2(content: string): { heading: string; body: string }[] {
  const chunks: { heading: string; body: string }[] = [];
  const lines = content.split("\n");
  let heading = "";
  let body: string[] = [];

  for (const line of lines) {
    if (/^# [^#]/.test(line)) continue;

    const h2 = line.match(/^## (.+)$/);
    if (h2) {
      if (heading || body.length > 0) {
        chunks.push({ heading, body: body.join("\n").trim() });
      }
      heading = h2[1];
      body = [];
      continue;
    }

    body.push(line);
  }

  if (heading || body.length > 0) {
    chunks.push({ heading, body: body.join("\n").trim() });
  }

  return chunks;
}

function classifyMainSection(
  heading: string,
  lang: Lang,
): Exclude<ReportSectionKey, "signals"> | null {
  const normalized = normalizeHeading(heading);
  for (const [key, names] of Object.entries(MAIN_SECTION_MARKERS[lang])) {
    if (names.includes(normalized)) {
      return key as Exclude<ReportSectionKey, "signals">;
    }
  }
  return null;
}

export function getSectionTitles(
  lang: Lang,
): Record<ReportSectionKey, string> {
  const titles: Record<Lang, Record<ReportSectionKey, string>> = {
    en: {
      signals: "Today's Signals",
      discovery: "Discovery",
      tech: "Tech Radar",
      competitive: "Competitive Intel",
      trends: "Trends",
      action: "Action",
    },
    zh: {
      signals: "今日信号",
      discovery: "发现机会",
      tech: "技术选型",
      competitive: "竞争情报",
      trends: "趋势判断",
      action: "行动触发",
    },
    es: {
      signals: "Señales de hoy",
      discovery: "Descubrimiento",
      tech: "Radar tecnológico",
      competitive: "Inteligencia competitiva",
      trends: "Tendencias",
      action: "Acción",
    },
    pt: {
      signals: "Sinais de hoje",
      discovery: "Descoberta",
      tech: "Radar tecnológico",
      competitive: "Inteligência competitiva",
      trends: "Tendências",
      action: "Ação",
    },
    fr: {
      signals: "Signaux du jour",
      discovery: "Découverte",
      tech: "Veille techno",
      competitive: "Intelligence concurrentielle",
      trends: "Tendances",
      action: "Action",
    },
    de: {
      signals: "Heutige Signale",
      discovery: "Entdeckung",
      tech: "Tech-Radar",
      competitive: "Wettbewerbsanalyse",
      trends: "Trends",
      action: "Aktion",
    },
    ar: {
      signals: "إشارات اليوم",
      discovery: "اكتشاف",
      tech: "رادار التقنية",
      competitive: "استخبارات المنافسة",
      trends: "الاتجاهات",
      action: "إجراء",
    },
    ru: {
      signals: "Сигналы дня",
      discovery: "Открытие",
      tech: "Тех-радар",
      competitive: "Конкурентная разведка",
      trends: "Тренды",
      action: "Действие",
    },
    it: {
      signals: "Segnali di oggi",
      discovery: "Scoperta",
      tech: "Radar tecnologico",
      competitive: "Intelligence competitiva",
      trends: "Tendenze",
      action: "Azione",
    },
    ja: {
      signals: "今日のシグナル",
      discovery: "ディスカバリー",
      tech: "テックレーダー",
      competitive: "競合インテリジェンス",
      trends: "トレンド",
      action: "アクション",
    },
    ko: {
      signals: "오늘의 신호",
      discovery: "발견",
      tech: "기술 레이더",
      competitive: "경쟁 인텔리전스",
      trends: "트렌드",
      action: "액션",
    },
  };
  return titles[lang];
}

export function parseReportSections(
  content: string,
  lang: Lang,
): ReportSection[] {
  const chunks = splitMarkdownByH2(content);
  const titles = getSectionTitles(lang);
  const grouped: Partial<Record<ReportSectionKey, string[]>> = {};
  const signalsParts: string[] = [];
  let reachedMainSections = false;

  for (const chunk of chunks) {
    const sectionKey = classifyMainSection(chunk.heading, lang);

    if (sectionKey) {
      reachedMainSections = true;
      if (!grouped[sectionKey]) grouped[sectionKey] = [];
      if (chunk.body) grouped[sectionKey]!.push(chunk.body);
      continue;
    }

    if (!reachedMainSections) {
      const heading = normalizeHeading(chunk.heading);
      signalsParts.push(
        chunk.body
          ? `## ${heading}\n\n${chunk.body}`
          : `## ${heading}`,
      );
    }
  }

  const sections: ReportSection[] = [];

  if (signalsParts.length > 0) {
    sections.push({
      key: "signals",
      id: "signals",
      title: titles.signals,
      content: signalsParts.join("\n\n"),
    });
  }

  for (const key of SECTION_ORDER.slice(1)) {
    const body = grouped[key]?.join("\n\n").trim();
    if (body) {
      sections.push({
        key,
        id: key,
        title: titles[key],
        content: body,
      });
    }
  }

  return sections;
}

export function sectionsToToc(sections: ReportSection[]): TocItem[] {
  return sections.flatMap((section) => [
    {
      id: section.id,
      text: section.title,
      level: 2 as const,
    },
    ...extractToc(section.content).map((item) => ({
      ...item,
      level: 3 as const,
    })),
  ]);
}

const LOCALE_MAP: Record<Lang, string> = {
  en: "en-US",
  zh: "zh-CN",
  es: "es-ES",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ar: "ar-SA",
  ru: "ru-RU",
  it: "it-IT",
  ja: "ja-JP",
  ko: "ko-KR",
};

export function groupReportsByMonth(
  reports: ReportMeta[],
  lang: Lang,
): { label: string; reports: ReportMeta[] }[] {
  const groups = new Map<string, ReportMeta[]>();

  for (const report of reports) {
    const [year, month] = report.date.split("-");
    const key = `${year}-${month}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(report);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, items]) => {
      const [, month] = key.split("-").map(Number);
      const locale = LOCALE_MAP[lang];
      const label = new Date(2026, month - 1, 1).toLocaleString(locale, {
        month: "long",
        year: "numeric",
      });
      return { label, reports: items };
    });
}
