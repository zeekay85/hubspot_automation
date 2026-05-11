export function documentationPrompt(payload) {
  return `
You are a marketing operations documentation specialist. Convert the raw notes into a clean ${payload.outputType}.

Raw notes:
${payload.rawNotes}

Return sections for summary, step-by-step process, roles/responsibilities if mentioned, action items, risks/open questions, and clean professional formatting.
`.trim();
}
