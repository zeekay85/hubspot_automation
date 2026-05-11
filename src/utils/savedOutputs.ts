import type { CampaignBrief, GeneratedDocumentation } from '../services/aiApi';

export type SavedOutputType = 'Campaign Brief' | 'Documentation';

export type SavedOutput = {
  id: string;
  title: string;
  documentType: SavedOutputType;
  createdAt: string;
  output: string;
  payload: CampaignBrief | GeneratedDocumentation;
};

const storageKey = 'marketing-ops-hub:saved-outputs';

export function readSavedOutputs(documentType?: SavedOutputType) {
  try {
    const outputs = JSON.parse(window.localStorage.getItem(storageKey) || '[]') as SavedOutput[];
    return documentType ? outputs.filter((output) => output.documentType === documentType) : outputs;
  } catch {
    return [];
  }
}

export function saveOutput(output: Omit<SavedOutput, 'id' | 'createdAt'>) {
  const savedOutput: SavedOutput = {
    ...output,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const outputs = [savedOutput, ...readSavedOutputs()].slice(0, 30);
  window.localStorage.setItem(storageKey, JSON.stringify(outputs));
  return savedOutput;
}

export function deleteSavedOutput(id: string) {
  const outputs = readSavedOutputs().filter((output) => output.id !== id);
  window.localStorage.setItem(storageKey, JSON.stringify(outputs));
}
