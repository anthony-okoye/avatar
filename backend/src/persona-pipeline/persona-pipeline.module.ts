import { Module } from '@nestjs/common';
import { PersonaPipelineService } from './persona-pipeline.service';
import { PersonaPipelineController } from './persona-pipeline.controller';
import { LinkedInModule } from '../linkedin/linkedin.module';
import { GeminiModule } from '../gemini/gemini.module';
import { ElevenLabsModule } from '../elevenlabs/elevenlabs.module';

@Module({
  imports: [LinkedInModule, GeminiModule, ElevenLabsModule],
  controllers: [PersonaPipelineController],
  providers: [PersonaPipelineService],
  exports: [PersonaPipelineService],
})
export class PersonaPipelineModule {}
