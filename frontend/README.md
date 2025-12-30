# Personification Frontend

Next.js frontend for the Personification MVP - an AI-powered persona generator that transforms LinkedIn profiles into actionable designer personas.

## Features Implemented

### Task 10: Frontend Setup

#### 10.1 Main PersonaGeneratorPage Component
- ✅ Single-page interface with state management
- ✅ Form submission handler with error handling
- ✅ API client for backend communication
- ✅ Loading states with pipeline step indicators
- ✅ Error display with user-friendly messages
- ✅ Results display (placeholder for persona components)

#### 10.2 InputForm Component
- ✅ LinkedIn URL input with real-time validation
- ✅ Design brief textarea with validation
- ✅ Inline validation error display
- ✅ Form disabled during submission
- ✅ Clear validation feedback

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main PersonaGeneratorPage component
│   │   ├── layout.tsx         # Root layout with metadata
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── InputForm.tsx      # Form component with validation
│   ├── lib/
│   │   └── api-client.ts      # API client for backend communication
│   └── types/
│       └── persona.ts         # TypeScript type definitions
```

## Components

### PersonaGeneratorPage (`src/app/page.tsx`)
Main page component that manages the entire persona generation flow.

**State Management:**
- `linkedinUrl`: Current LinkedIn URL input
- `designBrief`: Current design brief input
- `isLoading`: Loading state during API call
- `currentStep`: Current pipeline step (idle, scraping, analyzing, generating, synthesizing, complete)
- `persona`: Generated persona result
- `error`: Error message if any

**Features:**
- Form submission handling
- API communication with error handling
- Loading indicators with pipeline progress
- Results display (placeholder for future components)

### InputForm (`src/components/InputForm.tsx`)
Reusable form component with validation.

**Props:**
- `onSubmit`: Callback function for form submission
- `isLoading`: Loading state to disable form
- `error`: General error message to display

**Validation:**
- LinkedIn URL format validation (must match `linkedin.com/in/[username]`)
- Design brief validation (minimum 10 characters, no whitespace-only)
- Real-time validation error clearing
- Inline error messages

### API Client (`src/lib/api-client.ts`)
Handles all backend API communication.

**Functions:**
- `generatePersona(linkedinUrl, designBrief)`: Calls the backend API to generate a persona

**Error Handling:**
- Custom `ApiError` class for structured error handling
- Network error detection
- HTTP status code handling
- Error response parsing

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Validation Rules

### LinkedIn URL
- Must be a valid URL format
- Must contain `linkedin.com/in/` followed by alphanumeric characters and hyphens
- Example: `https://linkedin.com/in/john-doe-123`

### Design Brief
- Minimum 10 characters
- Cannot be empty or contain only whitespace
- Should describe design problem, goals, constraints, and medium

## Next Steps

The following components need to be implemented in subsequent tasks:

- **Task 11**: LoadingIndicator component with progress tracking
- **Task 12**: PersonaCard and DesignGuidance components for displaying results
- **Task 13**: AudioBriefing component with audio player
- **Task 14**: Enhanced error handling
- **Task 15**: Styling and polish with Tailwind CSS

## Requirements Validated

This implementation validates the following requirements:

- **Requirement 7.1**: Single-page interface with input form
- **Requirement 7.2**: Input form with LinkedIn URL and design brief fields
- **Requirement 10.1**: Frontend communicates with backend via REST API
- **Requirement 9.2**: Inline validation errors displayed next to relevant fields
