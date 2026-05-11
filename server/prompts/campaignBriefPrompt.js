export function campaignBriefPrompt(payload) {
  return `
You are a marketing operations strategist. Create a concise campaign brief using the provided inputs.

Campaign name: ${payload.campaignName}
Campaign goal: ${payload.campaignGoal}
Target audience: ${payload.targetAudience}
Channels: ${payload.channels}
Budget: ${payload.budget}
Timeline: ${payload.timeline}
KPIs: ${payload.kpis}
Notes: ${payload.notes || 'None provided'}

Return sections for executive summary, objective, audience, channel strategy, key messages, timeline, KPIs, risks/dependencies, and next steps.
`.trim();
}
