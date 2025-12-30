// Type definitions matching backend DTOs

export interface PersonaResult {
  personaName: string;
  summary: string;
  professionalContext: {
    role: string;
    industry: string;
    seniority: string;
  };
  communicationStyle: {
    tone: string;
    verbosity: 'low' | 'medium' | 'high';
  };
  designBiases: {
    visualStyle: string;
    uxPriority: string;
  };
  contentBiases: {
    respondsTo: string[];
    avoids: string[];
  };
  briefConflicts: string[];
  designGuidance: {
    do: string[];
    avoid: string[];
  };
}

export interface GeneratePersonaResponse {
  persona: PersonaResult;
  audioUrl: string;
  audioScript: string;
  processingTime: number;
}

export interface ErrorResponse {
  error: string;
  code: string;
  details?: string;
  timestamp: string;
  requestId: string;
}

export type PipelineStep = 'idle' | 'scraping' | 'analyzing' | 'generating' | 'synthesizing' | 'complete';
