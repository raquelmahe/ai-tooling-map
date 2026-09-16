/*
  Data layer for the AI Tooling Landscape Map / Capability Register / Measurement Dashboard.

  Evidence rules (see prompt):
  - Do not invent Skyscanner tools, owners, approvals, usage figures, costs, or results.
  - Where information is unavailable, use clearly labelled placeholders.
  - All example records are clearly marked as EXAMPLE and must not be presented as real tools.
*/

// ---------------------------------------------------------------------------
// Lifecycle model
// ---------------------------------------------------------------------------

const LIFECYCLE_COLUMNS = ["Source", "Create", "Review", "Deliver", "Learn"];

const LIFECYCLE_DEFINITIONS = {
  Source: "Backpack tokens, components, patterns, standards, rules, customer insights, and other authoritative inputs.",
  Create: "Design, research, content, prototyping, code, and AI-assisted creation.",
  Review: "Human judgement and automated validation.",
  Deliver: "Pull requests, tickets, handoffs, experiments, and production gates.",
  Learn: "Usage, quality, customer impact, business impact, and iteration.",
};

const WORKFLOW_ROWS = [
  "Strategy and opportunity discovery",
  "Research and insight synthesis",
  "Ideation and concept development",
  "Content and interaction design",
  "UI creation and prototyping",
  "Design-system discovery and use",
  "Design-to-code",
  "Accessibility and quality validation",
  "Experiment definition and delivery",
  "Documentation and collaboration",
  "Measurement and learning",
];

const CROSS_CUTTING_LAYERS = [
  { label: "Backpack and authoritative inputs", note: "Confirmed connection required for any capability that touches the design system." },
  { label: "Ownership and decision rights", note: "Owner to confirm where not yet named." },
  { label: "Privacy and security", note: "Approval status unknown until reviewed." },
  { label: "Accessibility", note: "No evidence collected for most capabilities yet." },
  { label: "Provenance and traceability", note: "Baseline required to assess coverage." },
  { label: "Human-review requirements", note: "Assumption: human review is required unless confirmed otherwise." },
  { label: "Reversibility and rollback", note: "Data source to identify for rollback approach." },
  { label: "Measurement and evidence", note: "See Measurement Dashboard for current evidence state." },
];

// ---------------------------------------------------------------------------
// Connected workstreams
// Strategic/organisational classification (orthogonal to the workflow x
// lifecycle matrix). Sourced from the "Ten commitments, four connected
// workstreams" model - not invented here. Each capability record can carry a
// primary workstream and, optionally, a secondary connection.
// ---------------------------------------------------------------------------

const WORKSTREAMS = {
  systems: { id: "01", label: "System foundations", shortLabel: "Systems", colorClass: "workstream--systems" },
  capability: { id: "02", label: "Design capability", shortLabel: "Capability", colorClass: "workstream--capability" },
  delivery: { id: "03", label: "Governed delivery", shortLabel: "Delivery", colorClass: "workstream--delivery" },
  practice: { id: "04", label: "Practice and pipeline", shortLabel: "Practice", colorClass: "workstream--practice" },
};

// ---------------------------------------------------------------------------
// Capability type
// A separate, orthogonal classification from "connected workstream"
// (strategic ownership) and workflow/lifecycle position (where in the
// process). This answers "what kind of thing is this?" so that skills,
// training, automations, agents, and tools are not all lumped into one
// undifferentiated "tool" bucket.
//
// Decision guide:
// 1. Is it a human ability rather than a system? -> skill.
//    Is it the mechanism that builds that ability? -> training.
// 2. Otherwise, does it run/execute?
//    No -> reference/rule -> standard. Behaviour/ritual -> process.
//    Yes -> has its own name/UI -> aiTool. Bolted onto another tool -> aiFeature.
//    Invisible underlying asset -> infrastructure.
//    Fixed sequence -> automation. Dynamically decides its own steps -> agent.
// ---------------------------------------------------------------------------

const CAPABILITY_TYPES = {
  aiTool: { label: "AI tool / product", icon: "◆", description: "A distinct, separately named AI-assisted product with its own UI." },
  aiFeature: { label: "AI feature", icon: "◇", description: "An AI capability embedded inside a broader, otherwise non-AI tool." },
  automation: { label: "Automation / workflow", icon: "▤", description: "A defined, repeatable sequence of steps that executes the same way each time." },
  agent: { label: "Agent / assistant", icon: "▣", description: "A semi-autonomous system that decides its own next steps within a task." },
  skill: { label: "Skill / competency", icon: "★", description: "A human capability - something a person can do." },
  training: { label: "Training / enablement", icon: "☆", description: "The structured mechanism (course, workshop, certification) that builds a skill." },
  process: { label: "Process / ritual", icon: "●", description: "A non-tool operating practice or behaviour." },
  standard: { label: "Standard / guideline", icon: "▲", description: "An authoritative rule, policy, or reference document." },
  infrastructure: { label: "Infrastructure / model asset", icon: "▦", description: "An underlying technical asset (model, dataset, index) other capabilities depend on." },
};

// ---------------------------------------------------------------------------
// Enumerations (status, maturity, portfolio action, evidence)
// ---------------------------------------------------------------------------

const APPROVAL_STATUSES = {
  approved: { label: "Approved", icon: "✓", tone: "positive" },
  restricted: { label: "Restricted", icon: "⚠", tone: "caution" },
  pilot: { label: "Pilot", icon: "◐", tone: "info" },
  experimental: { label: "Experimental", icon: "✦", tone: "info" },
  underInvestigation: { label: "Under investigation", icon: "?", tone: "neutral" },
  notApproved: { label: "Not approved", icon: "✕", tone: "negative" },
  unknown: { label: "Unknown", icon: "–", tone: "unknown" },
};

const MATURITY_STAGES = [
  "Identified",
  "Assessing",
  "Piloting",
  "Validated",
  "Scaling",
  "Established",
  "Retiring",
];

const PORTFOLIO_ACTIONS = {
  scale: "Scale",
  integrate: "Integrate",
  improve: "Improve",
  pilot: "Pilot",
  consolidate: "Consolidate",
  retire: "Retire",
  investigate: "Investigate",
};

const EVIDENCE_STATES = {
  none: { label: "No evidence", icon: "○" },
  anecdotal: { label: "Anecdotal", icon: "◔" },
  earlySignal: { label: "Early signal", icon: "◑" },
  workflowImpact: { label: "Measured workflow impact", icon: "◕" },
  qualityImpact: { label: "Measured quality impact", icon: "◕" },
  businessImpact: { label: "Measured business impact", icon: "●" },
};

// ---------------------------------------------------------------------------
// Capability records
// Field groups follow the register structure (Identity / Need & use /
// Portfolio state / Ownership / Governance / Evidence), reduced to the
// "essential first-version fields" plus a few enrichment fields.
// ---------------------------------------------------------------------------

const CAPABILITIES = [
  {
    id: "REG-001",
    isExample: true,
    name: "EXAMPLE - Research synthesis capability",
    description: "Illustrative capability for turning raw qualitative research into structured themes and insights.",
    role: "Owner to confirm",
    jobToBeDone: "Turn raw interview/survey data into structured, traceable insight themes",
    workflowStage: "Research and insight synthesis",
    lifecycleColumn: "Create",
    connectedWorkstream: "capability",
    secondaryWorkstream: null,
    approvalStatus: "underInvestigation",
    maturity: "Assessing",
    owner: "Owner to confirm",
    backpackConnection: "Not applicable / to confirm",
    evidence: "anecdotal",
    principalRisk: "Provenance of synthesised themes not yet traceable to source data",
    recommendedAction: "Investigate",
    lastReviewed: "No evidence collected",
  },
  {
    id: "REG-002",
    isExample: true,
    name: "EXAMPLE - UI generation capability",
    description: "Illustrative capability for AI-assisted generation of UI screens or components from a prompt or brief.",
    role: "Product designer",
    jobToBeDone: "Rapidly draft UI options for a known flow before manual refinement",
    workflowStage: "UI creation and prototyping",
    lifecycleColumn: "Create",
    connectedWorkstream: "systems",
    secondaryWorkstream: "capability",
    approvalStatus: "pilot",
    maturity: "Piloting",
    owner: "Owner to confirm",
    backpackConnection: "Approval status unknown",
    evidence: "earlySignal",
    principalRisk: "Generated UI may bypass Backpack components/tokens",
    recommendedAction: "Pilot",
    lastReviewed: "Baseline required",
  },
  {
    id: "REG-003",
    isExample: true,
    name: "EXAMPLE - Accessibility validation capability",
    description: "Illustrative capability for automated accessibility checks against WCAG 2.2 AA on design or code artefacts.",
    role: "Accessibility reviewer",
    jobToBeDone: "Catch accessibility issues earlier in the design/review stage",
    workflowStage: "Accessibility and quality validation",
    lifecycleColumn: "Review",
    connectedWorkstream: "delivery",
    secondaryWorkstream: null,
    approvalStatus: "unknown",
    maturity: "Identified",
    owner: "Owner to confirm",
    backpackConnection: "Data source to identify",
    evidence: "none",
    principalRisk: "False negatives could give unwarranted confidence in compliance",
    recommendedAction: "Investigate",
    lastReviewed: "No evidence collected",
  },
  {
    id: "REG-004",
    isExample: false,
    isUnconfirmed: true,
    name: "Design Radar - feedback and review tool",
    description: "Indexes Figma files and lets teams request or give structured feedback, including an AI-generated review summary, before work moves into delivery. Organised into team spaces (e.g. Backpack, Flights, Hotels, Falcon · SEO, AI lab).",
    role: "Product designer / design reviewer",
    jobToBeDone: "Get faster, structured feedback on design work before it ships",
    workflowStage: "Documentation and collaboration",
    lifecycleColumn: "Review",
    connectedWorkstream: "delivery",
    secondaryWorkstream: "capability",
    approvalStatus: "unknown",
    maturity: "Piloting",
    owner: "Owner to confirm",
    backpackConnection: "Approval status unknown",
    evidence: "anecdotal",
    principalRisk: "AI review summary accuracy and provenance not yet validated",
    recommendedAction: "Investigate",
    lastReviewed: "Observed via screenshot - not yet confirmed with tool owner",
  },
];

// Empty template, mirrors the register's essential fields, used for the
// "add a new capability" row/template.
const EMPTY_CAPABILITY_TEMPLATE = {
  id: "REG-___",
  isExample: false,
  isTemplate: true,
  name: "Tool to validate",
  description: "",
  role: "Owner to confirm",
  jobToBeDone: "",
  workflowStage: "",
  lifecycleColumn: "",
  connectedWorkstream: null,
  secondaryWorkstream: null,
  approvalStatus: "unknown",
  maturity: "Identified",
  owner: "Owner to confirm",
  backpackConnection: "Approval status unknown",
  evidence: "none",
  principalRisk: "",
  recommendedAction: "Investigate",
  lastReviewed: "No evidence collected",
};

// ---------------------------------------------------------------------------
// Measurement dashboard
// The strategy linkage records the department outcome, Product Design strategy,
// enabling conditions, and the distinction between direct enablement and shared
// business contribution. Every measure remains a clearly labelled placeholder
// until its definition, baseline, owner, and source are confirmed.
// ---------------------------------------------------------------------------

const DEPARTMENT_OUTCOME = "Make good design easier to create, validate and scale.";

const STRATEGY_LINKAGES = [
  {
    goal: "Faster, higher-quality Product Design",
    strategy: "AI-native ways of working",
    conditions: ["AI-native", "Cultural", "Structural"],
    signals: ["Approved AI-tool enablement", "AI capability development plans", "Governed tool adoption"],
    leadingMeasures: ["Designers actively using approved AI tools", "Designers with an AI capability development plan", "Time from kick-off to first prototype"],
    outcomeMeasures: ["Prototype-to-successful-XP cycle time", "Rework or quality measures"],
    attribution: "Design Infrastructure enables the conditions; downstream product impact requires shared evidence.",
  },
  {
    goal: "Faster delivery with less bespoke UI",
    strategy: "Backpack and scalable contribution model",
    conditions: ["Structural", "Cultural", "AI-native"],
    signals: ["Atlas gaps prioritised", "Contribution-model throughput", "Backpack adoption in AI-assisted outputs"],
    leadingMeasures: ["Atlas gaps usable in Backpack", "Components through the contribution model", "Backpack adoption in AI-assisted outputs"],
    outcomeMeasures: ["Bespoke UI reduction in priority teams", "Delivery speed", "Quality consistency"],
    attribution: "Requires product and engineering adoption data.",
  },
  {
    goal: "Design shapes roadmaps and committed bets",
    strategy: "Strategic direction",
    conditions: ["Strategic", "Structural", "Cultural"],
    signals: ["Design-led ideas in flight", "Evidence entering roadmap decisions", "Reusable ideas across CX"],
    leadingMeasures: ["Design-led novel product ideas in flight", "Evidence entering roadmap decisions", "Reusable ideas across CX"],
    outcomeMeasures: ["Ideas shipped with positive KPI impact", "Speed of acting on validated scalable ideas"],
    attribution: "Business KPI impact is a contribution measure, not proof of direct causation.",
  },
];

const SCORECARD_GROUPS = [
  {
    group: "Adoption and capability",
    strategy: "AI-native ways of working",
    indicators: [
      {
        outcome: "Designers actively using approved AI tools",
        current: "Data unavailable",
        target: "Contextual target: >90% (definition, baseline, population to confirm)",
        trend: "Not yet measurable",
        confidence: "Unknown",
        evidence: "Baseline required",
        owner: "Owner to confirm",
        commentary: "No data source identified yet for active usage.",
      },
      {
        outcome: "Designers with an AI capability development plan",
        current: "Data unavailable",
        target: "Contextual target: >90% (connected to AI capabilities roadmap)",
        trend: "Not yet measurable",
        confidence: "Unknown",
        evidence: "Definition required",
        owner: "Owner to confirm",
        commentary: "Development plan definition not yet confirmed.",
      },
    ],
  },
  {
    group: "Workflow and velocity",
    strategy: "AI-native ways of working",
    indicators: [
      {
        outcome: "Time from kick-off to first prototype",
        current: "Data unavailable",
        target: "Target to confirm",
        trend: "Not yet measurable",
        confidence: "Unknown",
        evidence: "No data source",
        owner: "Owner to confirm",
        commentary: "No comparison group established yet.",
      },
      {
        outcome: "Rework rate on AI-assisted outputs",
        current: "Data unavailable",
        target: "Target to confirm",
        trend: "Not yet measurable",
        confidence: "Unknown",
        evidence: "Undefined metric",
        owner: "Owner to confirm",
        commentary: "Metric definition pending.",
      },
    ],
  },
  {
    group: "Quality and scale",
    strategy: "Backpack and scalable contribution model",
    indicators: [
      {
        outcome: "Backpack adoption in AI-assisted outputs",
        current: "Data unavailable",
        target: "Target to confirm",
        trend: "Not yet measurable",
        confidence: "Unknown",
        evidence: "No data source",
        owner: "Owner to confirm",
        commentary: "Risk: generation volume may be mistaken for quality.",
      },
      {
        outcome: "AI outputs requiring significant human correction",
        current: "Data unavailable",
        target: "Target to confirm",
        trend: "Not yet measurable",
        confidence: "Unknown",
        evidence: "Insufficient sample",
        owner: "Owner to confirm",
        commentary: "",
      },
    ],
  },
  {
    group: "Strategic and business impact",
    strategy: "Strategic direction",
    indicators: [
      {
        outcome: "Design-led novel product ideas in flight",
        current: "Data unavailable",
        target: "Contextual target: 5 or more",
        trend: "Not yet measurable",
        confidence: "Unknown",
        evidence: "No comparison group",
        owner: "Owner to confirm",
        commentary: "Attribution to specific capabilities not yet validated.",
      },
      {
        outcome: "Novel ideas shipped with positive KPI impact",
        current: "Data unavailable",
        target: "Contextual target: 2 or more",
        trend: "Not yet measurable",
        confidence: "Unknown",
        evidence: "Confounding factors",
        owner: "Owner to confirm",
        commentary: "Correlation with AI tooling use, not yet causal.",
      },
    ],
  },
];

// One example measurement chain (illustrative only).
const MEASUREMENT_CHAIN_EXAMPLE = {
  capability: "EXAMPLE - UI generation capability (REG-002)",
  steps: [
    { stage: "Investment / capability", detail: "AI-assisted UI generation piloted with a small group of designers." },
    { stage: "Adoption behaviour", detail: "Designers use the capability to draft early UI options faster. Baseline and active-use definition required." },
    { stage: "Workflow change", detail: "Reduced time from kick-off to first prototype. Target and comparison group to confirm." },
    { stage: "Quality or delivery outcome", detail: "Backpack adoption and accessibility of generated UI to be measured. Data source to identify." },
    { stage: "Business contribution", detail: "Not yet measurable. Shared business evidence is required; correlation does not establish causation." },
  ],
};
