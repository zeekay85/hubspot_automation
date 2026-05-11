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
    return normalizeCampaignBrief(JSON.parse(extractJsonText(text)));
  } catch {
    return createFallbackCampaignBrief(text, payload);
  }
}

function extractJsonText(text) {
  const unfencedText = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  const firstBrace = unfencedText.indexOf('{');
  const lastBrace = unfencedText.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return unfencedText;
  }

  return unfencedText.slice(firstBrace, lastBrace + 1);
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
    kpiHighlights: normalizeKpiHighlights(brief.kpiHighlights),
    risksDependencies: normalizeList(brief.risksDependencies),
    nextSteps: normalizeList(brief.nextSteps),
    operationalRiskAssessment: normalizeRiskAssessment(brief.operationalRiskAssessment),
    suggestedLifecycleProgression: normalizeList(brief.suggestedLifecycleProgression),
    suggestedSlaRecommendations: normalizeList(brief.suggestedSlaRecommendations),
    governanceChecks: normalizeList(brief.governanceChecks),
    operationalReadinessChecklist: normalizeList(brief.operationalReadinessChecklist),
    reportingRecommendations: normalizeList(brief.reportingRecommendations),
    attributionTrackingConsiderations: normalizeList(brief.attributionTrackingConsiderations),
    salesBdrAlignmentNotes: normalizeList(brief.salesBdrAlignmentNotes),
    recommendedAutomationWorkflows: normalizeList(brief.recommendedAutomationWorkflows),
  };
}

function normalizeRiskAssessment(value) {
  const score = Number(value?.score);
  const normalizedScore = Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 72;

  return {
    score: normalizedScore,
    riskLevel: String(
      value?.riskLevel ||
        (normalizedScore >= 80 ? 'Low Risk' : normalizedScore >= 60 ? 'Medium Risk' : 'High Risk'),
    ),
    summary: String(
      value?.summary ||
        'Operational readiness depends on attribution, routing, lifecycle, and reporting QA.',
    ),
  };
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  return value ? [String(value)] : [];
}

function normalizeKpiHighlights(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => ({
      label: String(item?.label || ''),
      value: String(item?.value || ''),
      context: String(item?.context || ''),
    }))
    .filter((item) => item.label && item.value);
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
      'MQL to SAL conversion by channel',
      'Lifecycle stage progression from engaged to opportunity',
      'Campaign-sourced and campaign-influenced pipeline',
      'Routing SLA attainment for qualified leads',
    ],
    kpiHighlights: [
      {
        label: 'Primary KPI',
        value: payload.kpis,
        context: 'Anchors success measurement to the submitted campaign objective.',
      },
      {
        label: 'Pipeline KPI',
        value: 'Campaign-sourced pipeline and MQL to SAL conversion',
        context: 'Connects demand creation to revenue team acceptance.',
      },
      {
        label: 'Operational KPI',
        value: 'Routing SLA attainment and attribution completeness',
        context: 'Shows whether handoff speed and data quality support follow-up.',
      },
    ],
    risksDependencies: [
      'Audience definition, offer, and CTA must be finalized before activation.',
      'UTM governance and CRM campaign setup need QA before launch.',
      'Creative and landing page approvals may affect the timeline.',
      'Sales follow-up capacity and routing rules must be confirmed before launch.',
    ],
    nextSteps: [
      'Confirm campaign owner and approval stakeholders.',
      'Finalize audience criteria and channel budget allocation.',
      'Build campaign assets, tracking links, and QA checklist.',
      'Schedule performance review and optimization checkpoints.',
    ],
    operationalRiskAssessment: {
      score: calculateReadinessScore(payload),
      riskLevel:
        calculateReadinessScore(payload) >= 80
          ? 'Low Risk'
          : calculateReadinessScore(payload) >= 60
            ? 'Medium Risk'
            : 'High Risk',
      summary:
        'Readiness is based on attribution planning, KPI specificity, routing clarity, lifecycle definition, and sales alignment.',
    },
    suggestedLifecycleProgression: [
      'Map engaged leads to MQL criteria before sales handoff.',
      'Define MQL to SAL acceptance rules with sales leadership.',
      'Track opportunity creation and campaign influence after SAL acceptance.',
    ],
    suggestedSlaRecommendations: [
      'Route qualified target-account leads within one business day.',
      'Create BDR tasks when engagement crosses the MQL threshold.',
      'Escalate missed follow-up SLAs in weekly revenue standup reporting.',
    ],
    governanceChecks: [
      'Validate CRM campaign naming and hierarchy.',
      'Confirm UTM values use the governed taxonomy.',
      'QA campaign member statuses and lifecycle transitions.',
      'Confirm dashboard filters match attribution rules.',
    ],
    operationalReadinessChecklist: [
      'Create CRM campaign with standardized naming and member statuses.',
      'Validate UTM naming, source fields, and channel taxonomy before launch.',
      'Confirm lifecycle stage rules and MQL threshold with RevOps.',
      'QA routing, alerts, nurture enrollment, and suppression logic.',
      'Confirm sales enablement, SLA expectations, and follow-up ownership.',
    ],
    reportingRecommendations: [
      'Build dashboard views for MQLs, SALs, opportunities, pipeline, and conversion by channel.',
      'Track campaign-sourced and campaign-influenced pipeline separately.',
      'Review attribution completeness, UTM consistency, and campaign member status coverage.',
      'Compare performance against budget, timeline, and lifecycle stage goals.',
    ],
    attributionTrackingConsiderations: [
      'Use governed UTMs for every channel and asset.',
      'Confirm campaign member statuses align to funnel stages.',
      'Validate original source, latest source, and campaign influence fields.',
      'QA CRM and marketing automation campaign associations before launch.',
    ],
    salesBdrAlignmentNotes: [
      'Define MQL to SAL acceptance criteria before launch.',
      'Set routing SLA expectations for qualified responses.',
      'Provide BDRs with message angles, objections, CTA, and target account context.',
      'Clarify nurture versus direct follow-up paths for lower-intent engagement.',
    ],
    recommendedAutomationWorkflows: [
      'Route qualified leads to sales based on audience fit and lifecycle stage.',
      'Enroll non-ready leads into channel-specific nurture paths.',
      'Trigger sales alerts when target-account engagement crosses threshold.',
      'Update campaign member status based on form, attendance, or CTA engagement.',
    ],
  };
}

function createFallbackCampaignBrief(text, payload) {
  const fallback = createMockCampaignBrief(payload);

  return {
    ...fallback,
    executiveSummary:
      fallback.executiveSummary ||
      `${payload.campaignName} campaign brief generated. Review the generated sections and confirm details before launch.`,
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
    ['KPI Highlights', brief.kpiHighlights.map((item) => `${item.label}: ${item.value} (${item.context})`)],
    ['Risks & Dependencies', brief.risksDependencies],
    ['Next Steps', brief.nextSteps],
    ['Operational Risk Assessment', [`${brief.operationalRiskAssessment.score}% - ${brief.operationalRiskAssessment.riskLevel}: ${brief.operationalRiskAssessment.summary}`]],
    ['Suggested Lifecycle Progression', brief.suggestedLifecycleProgression],
    ['Suggested SLA Recommendations', brief.suggestedSlaRecommendations],
    ['Governance Checks', brief.governanceChecks],
    ['Operational Readiness Checklist', brief.operationalReadinessChecklist],
    ['Reporting Recommendations', brief.reportingRecommendations],
    ['Attribution & Tracking Considerations', brief.attributionTrackingConsiderations],
    ['Sales/BDR Alignment Notes', brief.salesBdrAlignmentNotes],
    ['Recommended Automation Workflows', brief.recommendedAutomationWorkflows],
  ];

  return sections
    .map(([title, items]) => {
      const body = items.length === 1 ? items[0] : items.map((item) => `- ${item}`).join('\n');
      return `${title}\n${body}`;
    })
    .join('\n\n');
}

function calculateReadinessScore(payload) {
  const combined = `${payload.campaignGoal} ${payload.kpis} ${payload.notes} ${payload.channels}`.toLowerCase();
  const checks = [
    ['attribution', 'utm', 'source', 'tracking'],
    ['routing', 'sla', 'follow-up', 'handoff', 'bdr', 'sales'],
    ['mql', 'sal', 'pipeline', 'conversion', 'opportunity'],
    ['lifecycle', 'stage', 'nurture'],
    ['dashboard', 'reporting', 'influence'],
  ];
  const hits = checks.filter((keywords) => keywords.some((keyword) => combined.includes(keyword))).length;
  return Math.min(92, 58 + hits * 7);
}

function parseDocumentation(text, payload) {
  try {
    return normalizeDocumentation(JSON.parse(extractJsonText(text)));
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
    suggestedWorkflowAutomations: normalizeList(documentation.suggestedWorkflowAutomations),
    qaRecommendations: normalizeList(documentation.qaRecommendations),
    stakeholderDependencies: normalizeList(documentation.stakeholderDependencies),
    governanceRisks: normalizeList(documentation.governanceRisks),
    implementationChecklist: normalizeList(documentation.implementationChecklist),
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
    suggestedWorkflowAutomations: [
      'Define enrollment triggers based on form submission, status change, or engagement threshold.',
      'Configure duplicate suppression logic before creating tasks or nurture enrollment.',
      'Create SLA tasks and alerts for owner follow-up.',
      'Update lifecycle stage or process status when completion criteria are met.',
    ],
    qaRecommendations: [
      'Test enrollment criteria with sample records before launch.',
      'Validate owner assignment, due dates, and suppression rules.',
      'Confirm reporting fields update after workflow completion.',
    ],
    stakeholderDependencies: [
      'Process owner must approve final workflow and exception handling.',
      'Marketing operations must validate systems, fields, and automation logic.',
      'Revenue stakeholders must confirm SLA and handoff expectations.',
    ],
    governanceRisks: [
      'Missing owner fields may create stalled tasks or unassigned follow-up.',
      'Duplicate automation can create conflicting outreach or inaccurate reporting.',
      'Unclear lifecycle transitions can reduce funnel reporting confidence.',
    ],
    implementationChecklist: [
      'Finalize required fields, owners, and completion criteria.',
      'Build automation in a sandbox or test workflow first.',
      'QA triggers, suppression, routing, and reporting outputs.',
      'Document owner, revision date, and escalation path.',
    ],
  };
}

function createFallbackDocumentation(_text, payload) {
  const fallback = createMockDocumentation(payload);

  return {
    ...fallback,
    summary:
      fallback.summary ||
      `${payload.outputType} draft generated from the submitted notes. Review the sections and resolve open questions before publishing.`,
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
    ['Suggested Workflow Automations', documentation.suggestedWorkflowAutomations],
    ['QA Recommendations', documentation.qaRecommendations],
    ['Stakeholder Dependencies', documentation.stakeholderDependencies],
    ['Governance Risks', documentation.governanceRisks],
    ['Implementation Checklist', documentation.implementationChecklist],
  ];

  return sections
    .map(([title, items]) => {
      const body = items.length === 1 ? items[0] : items.map((item) => `- ${item}`).join('\n');
      return `${title}\n${body}`;
    })
    .join('\n\n');
}
