import { Router } from 'express';
import { campaignBriefPrompt } from '../prompts/campaignBriefPrompt.js';
import { documentationPrompt } from '../prompts/documentationPrompt.js';
import { generateWithGemini } from '../services/geminiService.js';
import {
  validateCampaignBriefRequest,
  validateDocumentationRequest,
} from '../utilities/validators.js';

export const aiRoutes = Router();

aiRoutes.post('/generate-campaign-brief', async (request, response, next) => {
  try {
    const payload = validateCampaignBriefRequest(request.body);
    const prompt = campaignBriefPrompt(payload);
    const result = await generateWithGemini(prompt, {
      mockTitle: 'Campaign Brief Draft',
      mockBody: JSON.stringify(createMockCampaignBrief(payload), null, 2),
    });
    const brief = parseCampaignBrief(result.text, payload);

    response.json({
      output: formatCampaignBriefText(brief),
      brief,
      source: result.source,
    });
  } catch (error) {
    next(error);
  }
});

aiRoutes.post('/generate-documentation', async (request, response, next) => {
  try {
    const payload = validateDocumentationRequest(request.body);
    const prompt = documentationPrompt(payload);
    const result = await generateWithGemini(prompt, {
      mockTitle: `${payload.outputType} Draft`,
      mockBody: JSON.stringify(createMockDocumentation(payload), null, 2),
    });
    const documentation = parseDocumentation(result.text, payload);

    response.json({
      output: formatDocumentationText(documentation),
      documentation,
      source: result.source,
    });
  } catch (error) {
    next(error);
  }
});

function parseCampaignBrief(text, payload) {
  try {
    return normalizeCampaignBrief(JSON.parse(stripJsonFence(text)));
  } catch {
    return createFallbackCampaignBrief(text, payload);
  }
}

function stripJsonFence(text) {
  return text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
}

function normalizeCampaignBrief(brief) {
  return {
    executiveSummary: String(brief.executiveSummary || ''),
    campaignGoal: String(brief.campaignGoal || ''),
    targetAudience: normalizeList(brief.targetAudience),
    channelStrategy: normalizeList(brief.channelStrategy),
    recommendedMessaging: normalizeList(brief.recommendedMessaging),
    timeline: normalizeList(brief.timeline),
    kpis: normalizeList(brief.kpis),
    risksDependencies: normalizeList(brief.risksDependencies),
    nextSteps: normalizeList(brief.nextSteps),
  };
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  return value ? [String(value)] : [];
}

function createMockCampaignBrief(payload) {
  return {
    executiveSummary: `${payload.campaignName} is designed to help the team ${payload.campaignGoal}. The campaign focuses on ${payload.targetAudience} through ${payload.channels}, with performance measured against ${payload.kpis}.`,
    campaignGoal: payload.campaignGoal,
    targetAudience: [
      `Primary audience: ${payload.targetAudience}.`,
      'Decision makers who influence pipeline, campaign planning, or operational execution.',
      'Stakeholders who need clear proof of value before engaging with sales.',
    ],
    channelStrategy: [
      `Prioritize ${payload.channels} based on audience fit and launch timing.`,
      'Use each channel to reinforce the same core offer and conversion path.',
      `Track budget discipline against the submitted budget of ${payload.budget}.`,
    ],
    recommendedMessaging: [
      `Lead with the business outcome behind "${payload.campaignGoal}".`,
      'Emphasize operational clarity, speed to execution, and measurable impact.',
      'Use proof points that reduce risk for the target audience.',
      'Align CTAs to the funnel stage and campaign conversion goal.',
    ],
    timeline: [
      `Plan launch milestones around ${payload.timeline}.`,
      'Confirm creative, landing page, tracking, and stakeholder approvals before launch.',
      'Review performance after the first reporting window and optimize channel mix.',
    ],
    kpis: [
      payload.kpis,
      'Channel-level conversion rate',
      'Landing page conversion rate',
      'Pipeline or opportunity influence',
    ],
    risksDependencies: [
      'Audience definition, offer, and CTA must be finalized before activation.',
      'UTM governance and CRM campaign setup need QA before launch.',
      'Creative and landing page approvals may affect the timeline.',
    ],
    nextSteps: [
      'Confirm campaign owner and approval stakeholders.',
      'Finalize audience criteria and channel budget allocation.',
      'Build campaign assets, tracking links, and QA checklist.',
      'Schedule performance review and optimization checkpoints.',
    ],
  };
}

function createFallbackCampaignBrief(text, payload) {
  return {
    ...createMockCampaignBrief(payload),
    executiveSummary: text || `${payload.campaignName} campaign brief generated.`,
  };
}

function formatCampaignBriefText(brief) {
  const sections = [
    ['Executive Summary', [brief.executiveSummary]],
    ['Campaign Goal', [brief.campaignGoal]],
    ['Target Audience', brief.targetAudience],
    ['Channel Strategy', brief.channelStrategy],
    ['Recommended Messaging', brief.recommendedMessaging],
    ['Timeline', brief.timeline],
    ['KPIs', brief.kpis],
    ['Risks & Dependencies', brief.risksDependencies],
    ['Next Steps', brief.nextSteps],
  ];

  return sections
    .map(([title, items]) => {
      const body = items.length === 1 ? items[0] : items.map((item) => `- ${item}`).join('\n');
      return `${title}\n${body}`;
    })
    .join('\n\n');
}

function parseDocumentation(text, payload) {
  try {
    return normalizeDocumentation(JSON.parse(stripJsonFence(text)));
  } catch {
    return createFallbackDocumentation(text, payload);
  }
}

function normalizeDocumentation(documentation) {
  return {
    title: String(documentation.title || ''),
    summary: String(documentation.summary || ''),
    processSteps: normalizeList(documentation.processSteps),
    rolesResponsibilities: normalizeList(documentation.rolesResponsibilities),
    actionItems: normalizeList(documentation.actionItems),
    risksOpenQuestions: normalizeList(documentation.risksOpenQuestions),
    recommendedFormat: normalizeList(documentation.recommendedFormat),
  };
}

function createMockDocumentation(payload) {
  const typeGuidance = {
    SOP: {
      title: 'Standard Operating Procedure Draft',
      processLead: 'Follow a repeatable operating sequence with clear QA and handoff steps.',
      formatTip: 'Publish with owner, purpose, prerequisites, step table, QA checklist, and revision date.',
    },
    'Process Document': {
      title: 'Marketing Operations Process Document',
      processLead: 'Map the workflow from intake through execution, review, and operational handoff.',
      formatTip: 'Include workflow stages, systems involved, decision points, dependencies, and controls.',
    },
    'Meeting Summary': {
      title: 'Meeting Summary and Follow-Up',
      processLead: 'Summarize the discussion, capture decisions, and convert follow-ups into accountable actions.',
      formatTip: 'Publish with attendees, decisions, action items, owners, due dates, and open questions.',
    },
    'Action Plan': {
      title: 'Marketing Operations Action Plan',
      processLead: 'Prioritize next steps, ownership, timing, dependencies, and completion criteria.',
      formatTip: 'Use priority, owner, deadline, status, dependency, and success criteria fields.',
    },
  };
  const guidance = typeGuidance[payload.outputType] || typeGuidance.SOP;

  return {
    title: guidance.title,
    summary: `The submitted notes have been organized into a ${payload.outputType.toLowerCase()} that makes the workflow easier to execute, assign, and improve. The draft preserves the operational details from the notes while flagging gaps for follow-up.`,
    processSteps: [
      guidance.processLead,
      'Review the submitted notes and confirm the intended workflow outcome.',
      'Identify required inputs, systems, stakeholders, and handoff points.',
      'Document each step in sequence with clear completion criteria.',
      'Validate unresolved gaps with the process owner before publishing.',
    ],
    rolesResponsibilities: [
      'Process owner: accountable for accuracy, approvals, and future updates.',
      'Marketing operations: responsible for workflow setup, QA, tracking, and documentation hygiene.',
      'Stakeholders mentioned in the notes: responsible for approvals, inputs, or follow-up actions.',
    ],
    actionItems: [
      'Confirm missing owners, due dates, and dependencies from the raw notes.',
      'Review the draft with the process owner for accuracy.',
      'Publish the finalized document in the team workspace.',
      'Schedule a review cycle to keep the documentation current.',
    ],
    risksOpenQuestions: [
      'Some details may require owner confirmation before the document is production-ready.',
      'Unclear dependencies could delay execution or handoff.',
      'Open questions should be resolved before teams rely on this as the source of truth.',
    ],
    recommendedFormat: [
      guidance.formatTip,
      'Use clear section headings, short bullets, and consistent terminology.',
      'Include last updated date and document owner for governance.',
    ],
  };
}

function createFallbackDocumentation(text, payload) {
  return {
    ...createMockDocumentation(payload),
    summary: text || `${payload.outputType} draft generated from the submitted notes.`,
  };
}

function formatDocumentationText(documentation) {
  const sections = [
    ['Title', [documentation.title]],
    ['Summary', [documentation.summary]],
    ['Step-by-Step Process', documentation.processSteps],
    ['Roles & Responsibilities', documentation.rolesResponsibilities],
    ['Action Items', documentation.actionItems],
    ['Risks & Open Questions', documentation.risksOpenQuestions],
    ['Recommended Format', documentation.recommendedFormat],
  ];

  return sections
    .map(([title, items]) => {
      const body = items.length === 1 ? items[0] : items.map((item) => `- ${item}`).join('\n');
      return `${title}\n${body}`;
    })
    .join('\n\n');
}
