'use client';

import { PersonaResult } from '@/types/persona';

interface PersonaCardProps {
  persona: PersonaResult;
}

export default function PersonaCard({ persona }: PersonaCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header with persona name */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 px-6 py-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">{persona.personaName}</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="animate-fade-in">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Summary
          </h3>
          <p className="text-gray-800 leading-relaxed text-base">{persona.summary}</p>
        </div>

        {/* Brief Conflicts - Prominently displayed if present */}
        {persona.briefConflicts && persona.briefConflicts.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-5 rounded-r-xl shadow-md animate-slide-in">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-base font-bold text-amber-900 mb-2 flex items-center gap-2">
                  ⚠️ Design Brief Conflicts
                </h3>
                <ul className="space-y-2">
                  {persona.briefConflicts.map((conflict, index) => (
                    <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>{conflict}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Professional Context */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
            Professional Context
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-shadow">
              <p className="text-xs text-blue-600 font-semibold mb-1.5">Role</p>
              <p className="text-sm font-medium text-gray-900">
                {persona.professionalContext.role}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 hover:shadow-md transition-shadow">
              <p className="text-xs text-purple-600 font-semibold mb-1.5">Industry</p>
              <p className="text-sm font-medium text-gray-900">
                {persona.professionalContext.industry}
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200 hover:shadow-md transition-shadow">
              <p className="text-xs text-indigo-600 font-semibold mb-1.5">Seniority</p>
              <p className="text-sm font-medium text-gray-900">
                {persona.professionalContext.seniority}
              </p>
            </div>
          </div>
        </div>

        {/* Communication Style */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            Communication Style
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200 hover:shadow-md transition-shadow">
              <p className="text-xs text-green-600 font-semibold mb-1.5">Tone</p>
              <p className="text-sm font-medium text-gray-900">
                {persona.communicationStyle.tone}
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-xl p-4 border border-teal-200 hover:shadow-md transition-shadow">
              <p className="text-xs text-teal-600 font-semibold mb-1.5">Verbosity</p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {persona.communicationStyle.verbosity}
              </p>
            </div>
          </div>
        </div>

        {/* Design Biases */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Design Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-4 border border-pink-200 hover:shadow-md transition-shadow">
              <p className="text-xs text-pink-600 font-semibold mb-1.5">Visual Style</p>
              <p className="text-sm font-medium text-gray-900">
                {persona.designBiases.visualStyle}
              </p>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl p-4 border border-violet-200 hover:shadow-md transition-shadow">
              <p className="text-xs text-violet-600 font-semibold mb-1.5">UX Priority</p>
              <p className="text-sm font-medium text-gray-900">
                {persona.designBiases.uxPriority}
              </p>
            </div>
          </div>
        </div>

        {/* Content Biases */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            Content Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300 hover:shadow-md transition-all">
              <p className="text-sm text-green-700 font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Responds To
              </p>
              <ul className="space-y-2">
                {persona.contentBiases.respondsTo.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border-2 border-red-300 hover:shadow-md transition-all">
              <p className="text-sm text-red-700 font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Avoids
              </p>
              <ul className="space-y-2">
                {persona.contentBiases.avoids.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
