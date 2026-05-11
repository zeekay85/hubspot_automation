export function campaignBriefPrompt(payload) {
  return `
You are a senior marketing operations strategist creating an executive-ready campaign brief for a revenue team.

Use the submitted values directly and make reasonable, clearly grounded recommendations. Keep the tone professional, concise, and practical for a B2B SaaS marketing/revenue operations audience.

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
  "kpis": ["3-6 measurable KPIs based on the submitted KPI input."],
  "risksDependencies": ["3-5 practical risks, dependencies, or approvals to manage."],
  "nextSteps": ["4-6 concrete next steps for the marketing ops team."]
}

Rules:
- Do not include markdown fences.
- Do not invent a budget if one was provided; reference the submitted budget where relevant.
- Make the brief specific enough to discuss in an interview or portfolio review.
- Keep each bullet under 24 words.
`.trim();
}
