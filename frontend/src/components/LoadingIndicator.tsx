'use client';

import { useEffect, useState } from 'react';

interface LoadingIndicatorProps {
  currentStep: 'scraping' | 'analyzing' | 'generating' | 'synthesizing';
}

interface StepInfo {
  label: string;
  description: string;
  estimatedSeconds: number;
}

const STEP_INFO: Record<'scraping' | 'analyzing' | 'generating' | 'synthesizing', StepInfo> = {
  scraping: {
    label: 'Scraping LinkedIn Profile',
    description: 'Extracting profile data from LinkedIn',
    estimatedSeconds: 5,
  },
  analyzing: {
    label: 'Analyzing Profile',
    description: 'AI is analyzing professional context and preferences',
    estimatedSeconds: 5,
  },
  generating: {
    label: 'Generating Persona',
    description: 'Creating actionable designer persona',
    estimatedSeconds: 8,
  },
  synthesizing: {
    label: 'Creating Audio Briefing',
    description: 'Synthesizing voice briefing with ElevenLabs',
    estimatedSeconds: 7,
  },
};

const TOTAL_ESTIMATED_TIME = 30; // Total estimated time in seconds

export default function LoadingIndicator({ currentStep }: LoadingIndicatorProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(TOTAL_ESTIMATED_TIME);

  useEffect(() => {
    // Start timer
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);

      // Calculate estimated time remaining
      const remaining = Math.max(0, TOTAL_ESTIMATED_TIME - elapsed);
      setEstimatedTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate progress percentage based on current step
  const getProgressPercentage = (): number => {
    const stepOrder: Array<'scraping' | 'analyzing' | 'generating' | 'synthesizing'> = [
      'scraping',
      'analyzing',
      'generating',
      'synthesizing',
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    const baseProgress = (currentIndex / stepOrder.length) * 100;
    
    // Add some progress within the current step based on elapsed time
    const stepProgress = (elapsedTime % 10) / 10 * (100 / stepOrder.length);
    
    return Math.min(95, baseProgress + stepProgress); // Cap at 95% until complete
  };

  const progressPercentage = getProgressPercentage();
  const stepInfo = STEP_INFO[currentStep];

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 shadow-lg animate-pulse-slow">
      {/* Header with spinner */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-8 w-8 border-4 border-transparent border-t-purple-600 animate-spin-slow"></div>
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold text-blue-900">{stepInfo.label}</p>
          <p className="text-sm text-blue-700 mt-0.5">{stepInfo.description}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mb-4 gap-2">
        {(['scraping', 'analyzing', 'generating', 'synthesizing'] as const).map((step, index) => {
          const isComplete = ['scraping', 'analyzing', 'generating', 'synthesizing'].indexOf(currentStep) > index;
          const isCurrent = currentStep === step;

          return (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isComplete
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md scale-110'
                    : isCurrent
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white animate-bounce-slow shadow-lg'
                    : 'bg-blue-100 text-blue-600 border-2 border-blue-200'
                }`}
              >
                {isComplete ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <p className={`text-xs mt-2 text-center font-medium transition-colors ${
                isCurrent ? 'text-blue-900' : 'text-blue-700'
              }`}>
                {STEP_INFO[step].label.split(' ')[0]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Time estimate */}
      <div className="flex items-center justify-between text-sm text-blue-700 bg-white/50 rounded-lg px-4 py-2">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Elapsed: {elapsedTime}s
        </span>
        <span className="font-medium">
          {estimatedTimeRemaining > 0
            ? `~${estimatedTimeRemaining}s remaining`
            : 'Finishing up...'}
        </span>
      </div>
    </div>
  );
}
