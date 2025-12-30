# Integration Tests

## Overview

This directory contains integration tests for the Personification MVP. The tests verify the complete pipeline with real external services.

## Test Files

- `app.e2e-spec.ts` - Basic application health check
- `persona-pipeline.e2e-spec.ts` - Complete persona generation pipeline tests

## Prerequisites

Before running integration tests, ensure you have:

1. **Valid API Keys**: Create a `.env` file in the `backend` directory with:
   ```
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   ELEVENLABS_API_KEY=your-elevenlabs-api-key
   FIRECRAWL_API_KEY=your-firecrawl-api-key
   PORT=3001
   ```

2. **Internet Connectivity**: Tests make real API calls to external services

3. **API Credits**: Ensure you have sufficient credits/quota for:
   - Firecrawl API (scraping)
   - Google Vertex AI / Gemini (analysis and generation)
   - ElevenLabs (audio synthesis)

## Running Tests

### Run all integration tests
```bash
npm run test:e2e
```

### Run specific test file
```bash
npm run test:e2e -- persona-pipeline.e2e-spec.ts
```

### Run with verbose output
```bash
npm run test:e2e -- --verbose
```

## Test Coverage

### Persona Pipeline Tests (`persona-pipeline.e2e-spec.ts`)

#### Complete Pipeline Tests
1. **Real LinkedIn Profile**: Tests complete flow with public LinkedIn profile
2. **Technical Design Brief**: Tests with developer-focused brief
3. **Consumer Design Brief**: Tests with marketing-focused brief
4. **Audio Format Validation**: Verifies audio is web-playable
5. **Second-Person Voice**: Verifies audio script addresses designer directly
6. **Conflict Detection**: Tests surfacing of preference/brief conflicts
7. **Required Fields**: Validates all persona fields are populated

#### Error Scenario Tests
8. **Invalid LinkedIn URL**: Tests URL validation
9. **Empty Design Brief**: Tests brief validation
10. **Whitespace Design Brief**: Tests whitespace rejection
11. **Private/Non-existent Profile**: Tests graceful error handling

#### Performance Tests
12. **30-Second Target**: Verifies pipeline completes within performance target

## Test Scenarios

### Valid Test Cases

**Test 1: Enterprise Executive Profile**
- LinkedIn: Public executive profile (e.g., Satya Nadella)
- Brief: Enterprise collaboration app
- Expected: Complete persona with executive context

**Test 2: Technical Brief**
- Brief: Developer documentation portal
- Expected: Technical design guidance

**Test 3: Consumer Brief**
- Brief: Consumer product landing page
- Expected: Consumer-focused recommendations

### Error Test Cases

**Test 4: Invalid URL**
- Input: Non-LinkedIn URL
- Expected: 400 Bad Request with validation error

**Test 5: Empty Brief**
- Input: Empty string
- Expected: 400 Bad Request

**Test 6: Whitespace Brief**
- Input: Only spaces/tabs/newlines
- Expected: 400 Bad Request

**Test 7: Private Profile**
- Input: Private or non-existent LinkedIn URL
- Expected: 422 or 500 with error message

## Expected Results

### Successful Response Structure
```json
{
  "persona": {
    "personaName": "string",
    "summary": "string",
    "professionalContext": {
      "role": "string",
      "industry": "string",
      "seniority": "string"
    },
    "communicationStyle": {
      "tone": "string",
      "verbosity": "low|medium|high"
    },
    "designBiases": {
      "visualStyle": "string",
      "uxPriority": "string"
    },
    "contentBiases": {
      "respondsTo": ["string"],
      "avoids": ["string"]
    },
    "briefConflicts": ["string"],
    "designGuidance": {
      "do": ["string"],
      "avoid": ["string"]
    }
  },
  "audioUrl": "string (data URL or HTTP URL)",
  "audioScript": "string (110-150 words)",
  "processingTime": "number (milliseconds)"
}
```

### Error Response Structure
```json
{
  "error": "string",
  "message": "string or array",
  "statusCode": "number"
}
```

## Performance Expectations

- **Total Pipeline Time**: < 30 seconds (90th percentile)
- **Firecrawl Scraping**: < 5 seconds
- **Gemini Analysis**: < 5 seconds
- **Gemini Persona Generation**: < 8 seconds
- **Gemini Audio Script**: < 3 seconds
- **ElevenLabs Synthesis**: < 7 seconds

## Troubleshooting

### Test Timeouts
If tests timeout, check:
- Internet connectivity
- API service status
- API rate limits
- Increase timeout in test (default: 45 seconds)

### API Errors
If tests fail with API errors:
- Verify API keys are correct
- Check API quota/credits
- Verify services are operational
- Check error logs for details

### Validation Errors
If validation tests fail:
- Verify ValidationPipe is configured
- Check DTO validation rules
- Review error messages

## Notes

- Tests use real external services and consume API credits
- Some tests may take 30-45 seconds to complete
- Private LinkedIn profiles will fail gracefully
- Audio synthesis may occasionally fail (service-dependent)
- Tests are designed to be run sequentially to avoid rate limits

## Requirements Coverage

These tests validate:
- **Requirement 1**: LinkedIn profile ingestion
- **Requirement 2**: Design brief ingestion
- **Requirement 3**: AI profile analysis
- **Requirement 4**: Persona generation
- **Requirement 5**: Audio script generation
- **Requirement 6**: Audio briefing synthesis
- **Requirement 7**: UI data structure
- **Requirement 8**: Performance targets
- **Requirement 9**: Error handling
- **Requirement 10**: API integration
