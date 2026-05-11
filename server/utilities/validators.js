const documentationTypes = ['SOP', 'Process Document', 'Meeting Summary', 'Action Plan'];

export function validateCampaignBriefRequest(body) {
  const payload = {
    campaignName: getString(body, 'campaignName'),
    campaignGoal: getString(body, 'campaignGoal'),
    targetAudience: getString(body, 'targetAudience'),
    channels: getString(body, 'channels'),
    budget: getString(body, 'budget'),
    timeline: getString(body, 'timeline'),
    kpis: getString(body, 'kpis'),
    notes: getString(body, 'notes', false),
  };

  requireFields(payload, [
    'campaignName',
    'campaignGoal',
    'targetAudience',
    'channels',
    'budget',
    'timeline',
    'kpis',
  ]);

  return payload;
}

export function validateDocumentationRequest(body) {
  const payload = {
    outputType: getString(body, 'outputType'),
    rawNotes: getString(body, 'rawNotes'),
  };

  requireFields(payload, ['outputType', 'rawNotes']);

  if (!documentationTypes.includes(payload.outputType)) {
    throw createValidationError('Select a supported documentation output type.');
  }

  return payload;
}

function getString(body, field, required = true) {
  const value = body?.[field];

  if (typeof value !== 'string') {
    return required ? '' : '';
  }

  return value.trim();
}

function requireFields(payload, fields) {
  const missingFields = fields.filter((field) => !payload[field]);

  if (missingFields.length) {
    throw createValidationError(`Missing required fields: ${missingFields.join(', ')}.`);
  }
}

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}
