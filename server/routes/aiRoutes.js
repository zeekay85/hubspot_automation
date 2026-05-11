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
      mockBody:
        `Summary: The submitted notes have been organized into a clean ${payload.outputType.toLowerCase()} structure.\n\n` +
        `Step-by-step process: Review the raw notes, identify owners, document the workflow, and flag open questions.\n\n` +
        `Action items: Confirm missing details, assign owners, and publish the final document to the team workspace.`,
    });

    response.json({ output: result.text, source: result.source });
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
