export type ToolId = 'campaign' | 'utm' | 'documentation';

export type Tool = {
  id: ToolId;
  title: string;
  eyebrow: string;
  description: string;
  status: 'Static preview' | 'MVP next' | 'AI-ready later';
  accent: string;
};

export const tools: Tool[] = [
  {
    id: 'campaign',
    title: 'Campaign Brief Generator',
    eyebrow: 'Strategy intake',
    description:
      'Turn campaign inputs into a structured brief with goals, audience, channels, KPIs, and next steps.',
    status: 'AI-ready later',
    accent: 'from-brand-500 to-indigo-500',
  },
  {
    id: 'utm',
    title: 'UTM Link Builder',
    eyebrow: 'Attribution ops',
    description:
      'Standardize tracking links for campaign launches and preserve history for QA and reuse.',
    status: 'MVP next',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'documentation',
    title: 'Documentation Automation',
    eyebrow: 'Process enablement',
    description:
      'Convert raw notes into clean SOPs, process docs, meeting summaries, and action plans.',
    status: 'Static preview',
    accent: 'from-violet-500 to-fuchsia-500',
  },
];
