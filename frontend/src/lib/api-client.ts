// API client for backend communication

import { GeneratePersonaResponse, ErrorResponse } from '@/types/persona';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: string,
    public requestId?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function generatePersona(
  linkedinUrl: string,
  designBrief: string
): Promise<GeneratePersonaResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/persona/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        linkedinUrl,
        designBrief,
      }),
    });

    if (!response.ok) {
      // Try to parse error response
      try {
        const errorData: ErrorResponse = await response.json();
        throw new ApiError(
          errorData.error,
          errorData.code,
          errorData.details,
          errorData.requestId
        );
      } catch {
        // If parsing fails, throw generic error
        throw new ApiError(
          `Request failed with status ${response.status}`,
          'UNKNOWN_ERROR'
        );
      }
    }

    const data: GeneratePersonaResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Unable to connect to the server. Please check your connection.',
        'NETWORK_ERROR'
      );
    }

    // Handle other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      'UNKNOWN_ERROR'
    );
  }
}
