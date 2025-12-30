'use client';

import { useState, FormEvent } from 'react';

interface InputFormProps {
  onSubmit: (linkedinUrl: string, designBrief: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  initialLinkedinUrl?: string;
  initialDesignBrief?: string;
}

interface ValidationErrors {
  linkedinUrl?: string;
  designBrief?: string;
}

export default function InputForm({ 
  onSubmit, 
  isLoading, 
  error,
  initialLinkedinUrl = '',
  initialDesignBrief = ''
}: InputFormProps) {
  const [linkedinUrl, setLinkedinUrl] = useState(initialLinkedinUrl);
  const [designBrief, setDesignBrief] = useState(initialDesignBrief);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateLinkedInUrl = (url: string): string | undefined => {
    if (!url.trim()) {
      return 'LinkedIn URL is required';
    }

    // Check if it's a valid URL
    try {
      new URL(url);
    } catch {
      return 'Invalid URL format';
    }

    // Check if it matches LinkedIn profile pattern
    if (!/linkedin\.com\/in\/[a-zA-Z0-9-]+/.test(url)) {
      return 'Must be a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)';
    }

    return undefined;
  };

  const validateDesignBrief = (brief: string): string | undefined => {
    if (!brief.trim()) {
      return 'Design brief is required';
    }

    // Check if it's only whitespace
    if (brief.trim().length === 0) {
      return 'Design brief cannot be empty or contain only whitespace';
    }

    if (brief.trim().length < 10) {
      return 'Design brief must be at least 10 characters';
    }

    return undefined;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const errors: ValidationErrors = {};
    const urlError = validateLinkedInUrl(linkedinUrl);
    const briefError = validateDesignBrief(designBrief);

    if (urlError) {
      errors.linkedinUrl = urlError;
    }
    if (briefError) {
      errors.designBrief = briefError;
    }

    setValidationErrors(errors);

    // If there are validation errors, don't submit
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Submit the form
    await onSubmit(linkedinUrl, designBrief);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* API error message - more prominent display */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 border-l-4 border-red-500 shadow-sm animate-shake">
          <div className="flex items-start">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <p className="mt-2 text-xs text-red-600">
                Your form data has been preserved. You can modify it and try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn URL Input */}
      <div className="group">
        <label
          htmlFor="linkedinUrl"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          LinkedIn Profile URL
        </label>
        <div className="relative">
          <input
            type="text"
            id="linkedinUrl"
            value={linkedinUrl}
            onChange={(e) => {
              setLinkedinUrl(e.target.value);
              // Clear validation error when user starts typing
              if (validationErrors.linkedinUrl) {
                setValidationErrors((prev) => ({ ...prev, linkedinUrl: undefined }));
              }
            }}
            disabled={isLoading}
            placeholder="https://linkedin.com/in/username"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 ${
              validationErrors.linkedinUrl 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400 focus:shadow-lg'
            }`}
          />
          {!validationErrors.linkedinUrl && linkedinUrl && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        {validationErrors.linkedinUrl && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-slide-down">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {validationErrors.linkedinUrl}
          </p>
        )}
      </div>

      {/* Design Brief Textarea */}
      <div className="group">
        <label
          htmlFor="designBrief"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Design Brief
        </label>
        <textarea
          id="designBrief"
          value={designBrief}
          onChange={(e) => {
            setDesignBrief(e.target.value);
            // Clear validation error when user starts typing
            if (validationErrors.designBrief) {
              setValidationErrors((prev) => ({ ...prev, designBrief: undefined }));
            }
          }}
          disabled={isLoading}
          placeholder="Describe your design problem, goals, constraints, and medium..."
          rows={6}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-y transition-all duration-200 ${
            validationErrors.designBrief 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400 focus:shadow-lg'
          }`}
        />
        {validationErrors.designBrief && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-slide-down">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {validationErrors.designBrief}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Minimum 10 characters. Be specific about your design goals and constraints.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Persona...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Persona
          </span>
        )}
      </button>
    </form>
  );
}
