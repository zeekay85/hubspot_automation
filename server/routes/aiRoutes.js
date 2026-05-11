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
      mockBody:
        `Executive summary: ${payload.campaignName} is designed to support ${payload.campaignGoal}.\n\n` +
        `Campaign objective: Align ${payload.channels} activity to measurable KPIs: ${payload.kpis}.\n\n` +
        `Next steps: Confirm audience, budget, timeline, owners, and launch QA before activation.`,
    });

    response.json({ output: result.text, source: result.source });
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
