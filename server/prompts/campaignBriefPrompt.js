export function campaignBriefPrompt(payload) {
  return `
You are a senior Marketing Operations and RevOps strategist creating an executive-ready GTM campaign brief for a B2B SaaS revenue team.

Use the submitted values directly and make reasonable, clearly grounded recommendations. Think like an operator responsible for attribution, lifecycle stage movement, routing, reporting, governance, sales alignment, and pipeline impact. Keep the tone professional, concise, and practical.

Campaign name: ${payload.campaignName}
Campaign goal: ${payload.campaignGoal}
Target audience: ${payload.targetAudience}
Channels: ${payload.channels}
Budget: ${payload.budget}
Timeline: ${payload.timeline}
KPIs: ${payload.kpis}
Notes: ${payload.notes || 'None provided'}

Return only valid JSON with this exact shape:
{
  "executiveSummary": "2-3 sentence summary that ties the campaign name, goal, audience, channels, and business outcome together.",
  "campaignGoal": "Clear restatement of the goal with operational clarity.",
  "targetAudience": ["3-5 audience bullets based on the submitted target audience."],
  "channelStrategy": ["3-5 channel recommendations using the submitted channels."],
  "recommendedMessaging": ["4-6 message themes or angles the team can use."],
  "timeline": ["3-5 timeline milestones based on the submitted timeline."],
  "kpis": ["3-6 measurable KPIs based on the submitted KPI input and RevOps reporting needs."],
  "kpiHighlights": [
    { "label": "Primary KPI", "value": "specific KPI", "context": "why it matters" },
    { "label": "Pipeline KPI", "value": "specific KPI", "context": "why it matters" },
    { "label": "Operational KPI", "value": "specific KPI", "context": "why it matters" }
  ],
  "risksDependencies": ["3-5 practical risks, dependencies, or approvals to manage."],
  "nextSteps": ["4-6 concrete next steps for the marketing ops team."],
  "operationalReadinessChecklist": ["4-6 checks covering CRM campaign setup, UTMs, routing, lifecycle stages, QA, and stakeholder approvals."],
  "reportingRecommendations": ["3-5 dashboard/reporting recommendations including pipeline, conversion, and campaign influence."],
  "attributionTrackingConsiderations": ["3-5 tracking recommendations covering UTM governance, campaign member status, source fields, and influence consistency."],
  "salesBdrAlignmentNotes": ["3-5 notes covering routing SLAs, follow-up expectations, enablement, and handoff criteria."],
  "recommendedAutomationWorkflows": ["3-5 workflow recommendations for nurture, routing, alerts, status updates, or lifecycle progression."]
}

Rules:
- Do not include markdown fences.
- Do not invent a budget if one was provided; reference the submitted budget where relevant.
- Make the brief specific enough to discuss in an interview or portfolio review.
- Reference concrete RevOps concepts where relevant: MQL to SAL conversion, lifecycle stage progression, routing SLAs, UTM governance, attribution consistency, campaign influence, source fields, and dashboard QA.
- Keep bullets concise, executive-friendly, and under 24 words.
`.trim();
}
