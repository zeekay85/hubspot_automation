type AiResponse = {
  output: string;
  source: 'gemini' | 'mock';
};

export type CampaignBrief = {
  executiveSummary: string;
  campaignGoal: string;
  targetAudience: string[];
  channelStrategy: string[];
  recommendedMessaging: string[];
  timeline: string[];
  kpis: string[];
  kpiHighlights: Array<{
    label: string;
    value: string;
    context: string;
  }>;
  risksDependencies: string[];
  nextSteps: string[];
  operationalRiskAssessment: {
    score: number;
    riskLevel: string;
    summary: string;
  };
  suggestedLifecycleProgression: string[];
  suggestedSlaRecommendations: string[];
  governanceChecks: string[];
  operationalReadinessChecklist: string[];
  reportingRecommendations: string[];
  attributionTrackingConsiderations: string[];
  salesBdrAlignmentNotes: string[];
  recommendedAutomationWorkflows: string[];
};

type CampaignBriefResponse = AiResponse & {
  brief: CampaignBrief;
};

export type GeneratedDocumentation = {
  title: string;
  summary: string;
  processSteps: string[];
  rolesResponsibilities: string[];
  actionItems: string[];
  risksOpenQuestions: string[];
  recommendedFormat: string[];
  suggestedWorkflowAutomations: string[];
  qaRecommendations: string[];
  stakeholderDependencies: string[];
  governanceRisks: string[];
  implementationChecklist: string[];
};

type DocumentationResponse = AiResponse & {
  documentation: GeneratedDocumentation;
};

export type CampaignBriefRequest = {
  campaignName: string;
  campaignGoal: string;
  targetAudience: string;
  channels: string;
  budget: string;
  timeline: string;
  kpis: string;
  notes: string;
};

export type DocumentationRequest = {
  outputType: string;
  rawNotes: string;
};

export async function generateCampaignBrief(payload: CampaignBriefRequest) {
  return postToAiEndpoint<CampaignBriefRequest, CampaignBriefResponse>(
    '/api/generate-campaign-brief',
    payload,
  );
}

export async function generateDocumentation(payload: DocumentationRequest) {
  return postToAiEndpoint<DocumentationRequest, DocumentationResponse>(
    '/api/generate-documentation',
    payload,
  );
}

async function postToAiEndpoint<TPayload, TResponse = AiResponse>(
  url: string,
  payload: TPayload,
): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unable to generate output. Please try again.');
  }

  return data;
}
