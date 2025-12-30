/**
 * Test Readiness Checker
 * 
 * This script checks if the environment is ready for integration testing
 * by verifying that all required API keys are configured.
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

console.log('🔍 Checking test readiness...\n');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found');
  console.log('\nPlease create a .env file in the backend directory with the following variables:');
  console.log('  - GOOGLE_CLOUD_PROJECT_ID');
  console.log('  - GOOGLE_CLOUD_LOCATION');
  console.log('  - ELEVENLABS_API_KEY');
  console.log('  - FIRECRAWL_API_KEY');
  console.log('  - PORT\n');
  console.log('See backend/.env.example for reference.\n');
  process.exit(1);
}

console.log('✓ .env file found');

// Read and parse .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Check required variables
const requiredVars = [
  'GOOGLE_CLOUD_PROJECT_ID',
  'GOOGLE_CLOUD_LOCATION',
  'ELEVENLABS_API_KEY',
  'FIRECRAWL_API_KEY',
];

let allPresent = true;
const missingVars = [];

console.log('\n📋 Checking required environment variables:\n');

requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (!value || value === 'your-project-id' || value === 'your-elevenlabs-api-key' || value === 'your-firecrawl-api-key') {
    console.log(`  ❌ ${varName}: Not configured`);
    missingVars.push(varName);
    allPresent = false;
  } else {
    // Mask the value for security
    const maskedValue = value.length > 8 
      ? value.substring(0, 4) + '...' + value.substring(value.length - 4)
      : '***';
    console.log(`  ✓ ${varName}: ${maskedValue}`);
  }
});

console.log('');

if (!allPresent) {
  console.error('❌ Some required environment variables are missing or not configured:\n');
  missingVars.forEach(varName => {
    console.log(`  - ${varName}`);
  });
  console.log('\nPlease update your .env file with valid API keys.\n');
  process.exit(1);
}

console.log('✅ All required environment variables are configured!\n');
console.log('You can now run integration tests with:');
console.log('  npm run test:e2e\n');
console.log('Or run specific tests:');
console.log('  npm run test:e2e -- persona-pipeline.e2e-spec.ts\n');
console.log('⚠️  Note: Integration tests will consume API credits from:');
console.log('  - Firecrawl (web scraping)');
console.log('  - Google Vertex AI / Gemini (AI analysis)');
console.log('  - ElevenLabs (audio synthesis)\n');

process.exit(0);
