'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioBriefingProps {
  audioUrl: string;
  transcript: string;
  autoPlay?: boolean;
}

export default function AudioBriefing({ audioUrl, transcript, autoPlay = false }: AudioBriefingProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Debug: Log props
  useEffect(() => {
    console.log('AudioBriefing props:', { audioUrl, transcript: transcript?.substring(0, 50), autoPlay });
  }, [audioUrl, transcript, autoPlay]);

  // Handle audio loading
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('AudioBriefing: Setting up audio with URL:', audioUrl);

    const handleLoadedMetadata = () => {
      console.log('AudioBriefing: Metadata loaded, duration:', audio.duration);
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
      
      // Auto-play if enabled
      if (autoPlay) {
        console.log('AudioBriefing: Attempting auto-play');
        audio.play().then(() => {
          console.log('AudioBriefing: Auto-play successful');
          setIsPlaying(true);
        }).catch((err) => {
          console.error('AudioBriefing: Auto-play failed:', err);
          // Auto-play might be blocked by browser, that's okay
        });
      }
    };

    const handleCanPlay = () => {
      console.log('AudioBriefing: Can play event fired');
      setIsLoading(false);
    };

    const handleError = (e: Event) => {
      console.error('AudioBriefing: Error loading audio:', e);
      console.error('AudioBriefing: Audio error details:', audio.error);
      setIsLoading(false);
      setError('Failed to load audio. Please try again.');
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadStart = () => {
      console.log('AudioBriefing: Load started');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);

    // Force load
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [audioUrl, autoPlay]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
          <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">Audio Briefing</h3>
        </div>
      </div>

      <div className="p-6">
        {/* Check if audioUrl is empty */}
        {!audioUrl || audioUrl.trim() === '' ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-4 shadow-sm">
            <p className="text-sm text-yellow-700 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Audio briefing is not available. Please view the transcript below.
            </p>
            {transcript && (
              <div className="mt-4 bg-white rounded-lg p-4 border border-yellow-200">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Transcript:</h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {transcript}
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Audio Element */}
            <audio ref={audioRef} src={audioUrl} preload="metadata" crossOrigin="anonymous" />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600"></div>
            <span className="ml-3 text-gray-600 font-medium">Loading audio...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-4 shadow-sm">
            <p className="text-sm text-red-700 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {/* Audio Controls */}
        {!isLoading && !error && (
          <div className="space-y-5">
            {/* Progress Bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-600 hover:accent-purple-700 transition-all"
                style={{
                  background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${(currentTime / duration) * 100}%, rgb(229, 231, 235) ${(currentTime / duration) * 100}%, rgb(229, 231, 235) 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              {/* Replay Button */}
              <button
                onClick={handleReplay}
                className="p-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                title="Replay from start"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={handlePlayPause}
                className="p-5 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Transcript Toggle Button */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`p-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 ${
                  showTranscript 
                    ? 'bg-gradient-to-br from-purple-100 to-indigo-200 text-purple-700' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                }`}
                title={showTranscript ? 'Hide transcript' : 'Show transcript'}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
            </div>

            {/* Transcript Section */}
            {showTranscript && (
              <div className="mt-6 pt-6 border-t border-gray-200 animate-slide-down">
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  Transcript
                </h4>
                <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-5 border border-purple-100 shadow-inner">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {transcript}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
