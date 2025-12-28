import { Module } from '@nestjs/common';
import { PersonaPipelineService } from './persona-pipeline.service';
import { LinkedInModule } from '../linkedin/linkedin.module';
import { GeminiModule } from '../gemini/gemini.module';
import { ElevenLabsModule } from '../elevenlabs/elevenlabs.module';

@Module({
  imports: [LinkedInModule, GeminiModule, ElevenLabsModule],
  providers: [PersonaPipelineService],
  exports: [PersonaPipelineService],
})
export class PersonaPipelineModule {}
