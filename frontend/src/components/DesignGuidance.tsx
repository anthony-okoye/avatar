'use client';

interface DesignGuidanceProps {
  guidance: {
    do: string[];
    avoid: string[];
  };
}

export default function DesignGuidance({ guidance }: DesignGuidanceProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Design Guidance</h2>
        <p className="text-sm text-gray-600 mt-1">
          Actionable recommendations for designing for this persona
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        {/* Do column */}
        <div className="p-6 hover:bg-green-50/30 transition-colors">
          <div className="flex items-center space-x-2 mb-5">
            <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-green-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-green-900">Do</h3>
          </div>

          <ul className="space-y-3">
            {guidance.do.map((item, index) => (
              <li key={index} className="flex items-start space-x-3 group animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 leading-relaxed flex-1">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Avoid column */}
        <div className="p-6 hover:bg-red-50/30 transition-colors">
          <div className="flex items-center space-x-2 mb-5">
            <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-red-100 to-rose-200 rounded-full flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-red-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-red-900">Avoid</h3>
          </div>

          <ul className="space-y-3">
            {guidance.avoid.map((item, index) => (
              <li key={index} className="flex items-start space-x-3 group animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 leading-relaxed flex-1">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
