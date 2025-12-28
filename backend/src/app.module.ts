import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkedInModule } from './linkedin/linkedin.module';
import { GeminiModule } from './gemini/gemini.module';
import { ElevenLabsModule } from './elevenlabs/elevenlabs.module';
import { PersonaPipelineModule } from './persona-pipeline/persona-pipeline.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LinkedInModule,
    GeminiModule,
    ElevenLabsModule,
    PersonaPipelineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
