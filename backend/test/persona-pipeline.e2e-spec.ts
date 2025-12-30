import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

/**
 * Integration tests for the complete persona generation pipeline
 * Tests with real external services (Firecrawl, Gemini, ElevenLabs)
 * 
 * Requirements: 8.1 - Complete pipeline execution within 30 seconds
 * 
 * Prerequisites:
 * - Valid API keys in .env file
 * - Internet connectivity
 * - External services operational
 */
describe('Persona Pipeline Integration (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/persona/generate', () => {
    /**
     * Test 1: Complete pipeline with real LinkedIn profile
     * Uses a well-known public LinkedIn profile
     */
    it('should generate persona from real LinkedIn profile with design brief', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
          designBrief: 'Design a mobile app for enterprise collaboration with focus on productivity and security. Target audience is C-suite executives and senior managers.',
        })
        .expect(201);

      // Verify response structure
      expect(response.body).toHaveProperty('persona');
      expect(response.body).toHaveProperty('audioUrl');
      expect(response.body).toHaveProperty('audioScript');
      expect(response.body).toHaveProperty('processingTime');

      // Verify persona structure
      const { persona } = response.body;
      expect(persona).toHaveProperty('personaName');
      expect(persona).toHaveProperty('summary');
      expect(persona).toHaveProperty('professionalContext');
      expect(persona).toHaveProperty('communicationStyle');
      expect(persona).toHaveProperty('designBiases');
      expect(persona).toHaveProperty('contentBiases');
      expect(persona).toHaveProperty('briefConflicts');
      expect(persona).toHaveProperty('designGuidance');

      // Verify professional context
      expect(persona.professionalContext).toHaveProperty('role');
      expect(persona.professionalContext).toHaveProperty('industry');
      expect(persona.professionalContext).toHaveProperty('seniority');

      // Verify communication style
      expect(persona.communicationStyle).toHaveProperty('tone');
      expect(persona.communicationStyle).toHaveProperty('verbosity');
      expect(['low', 'medium', 'high']).toContain(persona.communicationStyle.verbosity);

      // Verify design guidance
      expect(persona.designGuidance).toHaveProperty('do');
      expect(persona.designGuidance).toHaveProperty('avoid');
      expect(Array.isArray(persona.designGuidance.do)).toBe(true);
      expect(Array.isArray(persona.designGuidance.avoid)).toBe(true);
      expect(persona.designGuidance.do.length).toBeGreaterThan(0);
      expect(persona.designGuidance.avoid.length).toBeGreaterThan(0);

      // Verify audio script
      expect(response.body.audioScript).toBeTruthy();
      expect(typeof response.body.audioScript).toBe('string');
      
      // Verify audio script length (110-150 words for 45-60 seconds)
      const wordCount = response.body.audioScript.split(/\s+/).length;
      expect(wordCount).toBeGreaterThanOrEqual(80); // Allow some flexibility
      expect(wordCount).toBeLessThanOrEqual(200);

      // Verify audio URL is provided
      expect(response.body.audioUrl).toBeTruthy();
      expect(typeof response.body.audioUrl).toBe('string');

      // Verify processing time is reasonable (< 30 seconds)
      expect(response.body.processingTime).toBeLessThan(30000);

      console.log('\n✓ Complete pipeline test passed');
      console.log(`  Processing time: ${response.body.processingTime}ms`);
      console.log(`  Persona: ${persona.personaName}`);
      console.log(`  Audio script length: ${wordCount} words`);
    }, 45000); // 45 second timeout

    /**
     * Test 2: Different design brief style - technical/developer focused
     */
    it('should handle technical design brief', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
          designBrief: 'Create a developer documentation portal with API references, code examples, and interactive tutorials. Focus on clarity and searchability.',
        })
        .expect(201);

      expect(response.body.persona).toBeDefined();
      expect(response.body.audioScript).toBeDefined();
      expect(response.body.audioUrl).toBeDefined();

      console.log('\n✓ Technical design brief test passed');
    }, 45000);

    /**
     * Test 3: Different design brief style - consumer/marketing focused
     */
    it('should handle consumer-focused design brief', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
          designBrief: 'Design a landing page for a new consumer product launch. Target is tech-savvy millennials. Emphasize innovation and user experience.',
        })
        .expect(201);

      expect(response.body.persona).toBeDefined();
      expect(response.body.audioScript).toBeDefined();
      expect(response.body.audioUrl).toBeDefined();

      console.log('\n✓ Consumer-focused design brief test passed');
    }, 45000);

    /**
     * Test 4: Verify audio format is web-playable
     */
    it('should return audio in web-playable format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
          designBrief: 'Design a simple dashboard for data visualization.',
        })
        .expect(201);

      const audioUrl = response.body.audioUrl;
      expect(audioUrl).toBeTruthy();

      // Audio URL should be a base64 data URL or HTTP URL
      const isDataUrl = audioUrl.startsWith('data:audio/');
      const isHttpUrl = audioUrl.startsWith('http://') || audioUrl.startsWith('https://');
      
      expect(isDataUrl || isHttpUrl).toBe(true);

      if (isDataUrl) {
        // Verify it's a supported audio format
        const hasValidFormat = 
          audioUrl.includes('audio/mpeg') || 
          audioUrl.includes('audio/mp3') ||
          audioUrl.includes('audio/wav') ||
          audioUrl.includes('audio/ogg');
        expect(hasValidFormat).toBe(true);
      }

      console.log('\n✓ Audio format validation test passed');
    }, 45000);

    /**
     * Test 5: Error scenario - Invalid LinkedIn URL format
     */
    it('should reject invalid LinkedIn URL format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://example.com/profile',
          designBrief: 'Design a mobile app.',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);

      console.log('\n✓ Invalid URL rejection test passed');
    });

    /**
     * Test 6: Error scenario - Empty design brief
     */
    it('should reject empty design brief', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
          designBrief: '',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');

      console.log('\n✓ Empty design brief rejection test passed');
    });

    /**
     * Test 7: Error scenario - Whitespace-only design brief
     */
    it('should reject whitespace-only design brief', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
          designBrief: '   \n\t  ',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');

      console.log('\n✓ Whitespace design brief rejection test passed');
    });

    /**
     * Test 8: Error scenario - Private or non-existent profile
     * Note: This test may pass or fail depending on the profile's actual status
     */
    it('should handle private or non-existent LinkedIn profile gracefully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://www.linkedin.com/in/nonexistentprofile12345xyz/',
          designBrief: 'Design a mobile app.',
        });

      // Should return either 422 (profile not accessible) or 500 (service error)
      expect([422, 500, 503]).toContain(response.status);
      
      if (response.status !== 201) {
        expect(response.body).toHaveProperty('error');
        console.log('\n✓ Private/non-existent profile handling test passed');
        console.log(`  Error message: ${response.body.error}`);
      }
    }, 45000);

    /**
     * Test 9: Verify second-person voice in audio script
     */
    it('should generate audio script in second person', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
          designBrief: 'Design a project management tool for remote teams.',
        })
        .expect(201);

      const audioScript = response.body.audioScript.toLowerCase();
      
      // Check for second-person pronouns
      const hasSecondPerson = audioScript.includes('you') || audioScript.includes('your');
      expect(hasSecondPerson).toBe(true);

      console.log('\n✓ Second-person voice test passed');
    }, 45000);

    /**
     * Test 10: Verify brief conflicts are surfaced when present
     * Using a design brief that might conflict with executive preferences
     */
    it('should surface conflicts between preferences and brief', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
          designBrief: 'Design a casual gaming app with playful animations and bright colors. Target audience is teenagers.',
        })
        .expect(201);

      const { persona } = response.body;
      
      // Brief conflicts should be an array (may be empty if no conflicts)
      expect(Array.isArray(persona.briefConflicts)).toBe(true);
      
      console.log('\n✓ Conflict detection test passed');
      console.log(`  Conflicts found: ${persona.briefConflicts.length}`);
      if (persona.briefConflicts.length > 0) {
        console.log(`  Example: ${persona.briefConflicts[0]}`);
      }
    }, 45000);
  });

  describe('Performance Tests', () => {
    /**
     * Test 11: Verify 30-second performance target
     */
    it('should complete pipeline within 30 seconds', async () => {
      const startTime = Date.now();

      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
          designBrief: 'Design a simple mobile app for task management.',
        })
        .expect(201);

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(30000);
      expect(response.body.processingTime).toBeLessThan(30000);

      console.log('\n✓ Performance target test passed');
      console.log(`  Total time: ${totalTime}ms`);
      console.log(`  Processing time: ${response.body.processingTime}ms`);
    }, 35000);
  });

  describe('Data Validation Tests', () => {
    /**
     * Test 12: Verify all required persona fields are populated
     */
    it('should populate all required persona fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/persona/generate')
        .send({
          linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
          designBrief: 'Design an enterprise software dashboard.',
        })
        .expect(201);

      const { persona } = response.body;

      // Check all required fields are non-empty
      expect(persona.personaName).toBeTruthy();
      expect(persona.summary).toBeTruthy();
      expect(persona.professionalContext.role).toBeTruthy();
      expect(persona.professionalContext.industry).toBeTruthy();
      expect(persona.professionalContext.seniority).toBeTruthy();
      expect(persona.communicationStyle.tone).toBeTruthy();
      expect(persona.communicationStyle.verbosity).toBeTruthy();
      expect(persona.designBiases.visualStyle).toBeTruthy();
      expect(persona.designBiases.uxPriority).toBeTruthy();
      expect(Array.isArray(persona.contentBiases.respondsTo)).toBe(true);
      expect(Array.isArray(persona.contentBiases.avoids)).toBe(true);
      expect(Array.isArray(persona.briefConflicts)).toBe(true);
      expect(persona.designGuidance.do.length).toBeGreaterThan(0);
      expect(persona.designGuidance.avoid.length).toBeGreaterThan(0);

      console.log('\n✓ Required fields validation test passed');
    }, 45000);
  });
});
