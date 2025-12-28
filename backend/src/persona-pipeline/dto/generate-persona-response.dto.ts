import { PersonaResult } from '../../gemini/gemini.service';

export class GeneratePersonaResponseDto {
  persona: PersonaResult;
  audioUrl: string;
  audioScript: string;
  processingTime: number;
}
