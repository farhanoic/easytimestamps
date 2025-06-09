import { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Upload, Youtube, Plus, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { trackVideoEvent, trackError, flushFallbackEvents, initializeFallbackAnalytics } from '../utils/analytics'
import { authAnalytics } from '../services/authAnalytics'
import { useAuth } from '../contexts/AuthContext'
import { useNetworkStatus } from '../hooks/useNetworkStatus'
import { withRetry, isRetryableError } from '../utils/retryUtils'
import NetworkStatusIndicator from './NetworkStatusIndicator'
import { useTranslation } from 'react-i18next'

interface VideoPlayerProps {
  onTimeUpdate?: (seconds: number) => void
  onAddTimestamp?: (seconds: number, timeString: string) => void
}

function VideoPlayer({ onTimeUpdate, onAddTimestamp }: VideoPlayerProps) {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const networkStatus = useNetworkStatus()
  
  // State
  const [videoType, setVideoType] = useState<'none' | 'url' | 'file'>('none')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoFile, setVideoFile] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  
  // References
  const reactPlayerRef = useRef<ReactPlayer>(null)
  const htmlVideoRef = useRef<HTMLVideoElement>(null)

  // Initialize analytics fallback and handle network status changes
  useEffect(() => {
    initializeFallbackAnalytics()
    
    // Flush stored events when coming back online
    if (networkStatus.isOnline && networkStatus.retryCount === 0) {
      flushFallbackEvents()
    }
  }, [networkStatus.isOnline])

  // Clear network errors when connection is restored
  useEffect(() => {
    if (networkStatus.isOnline && networkError) {
      setNetworkError(null)
    }
  }, [networkStatus.isOnline, networkError])

  // Enhanced URL loading with network error handling and retry logic
  const handleLoadUrl = async () => {
    if (!urlInput.trim()) return
    
    setError(null)
    setNetworkError(null)
    setIsLoading(true)
    
    let url = urlInput.trim()
    
    // Check network status first
    if (!networkStatus.isOnline) {
      setNetworkError('No internet connection. Please check your network and try again.')
      setIsLoading(false)
      return
    }
    
    // Auto-add https:// for common video sites
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
        url = 'https://' + url
      } else {
        setError('Please enter a valid URL starting with http:// or https://')
        setIsLoading(false)
        return
      }
    }
    
    // Validate URL format
    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL format.')
      setIsLoading(false)
      return
    }
    
    // Check if ReactPlayer can handle this URL
    if (!ReactPlayer.canPlay(url)) {
      setError('This URL is not supported. Please try YouTube, Vimeo, or other supported platforms.')
      setIsLoading(false)
      return
    }
    
    // Test URL accessibility with retry logic
    const result = await withRetry(
      async () => {
        // Simple connectivity test for external URLs
        if (url.includes('youtube.com') || url.includes('vimeo.com')) {
          const testUrl = url.includes('youtube.com') ? 'https://www.youtube.com/favicon.ico' : 'https://vimeo.com/favicon.ico'
          await fetch(testUrl, { method: 'HEAD', mode: 'no-cors' })
          return true
        }
        return true
      },
      { maxRetries: 2, baseDelay: 1000 },
      (attempt, error) => {
        networkStatus.incrementRetry()
        console.log(`URL accessibility test attempt ${attempt + 1} failed:`, error.message)
      }
    )
    
    if (!result.success && isRetryableError(result.error!)) {
      setNetworkError(`Connection failed. ${result.error!.message}. Please check your internet connection and try again.`)
      setIsLoading(false)
      return
    }
    
    setVideoType('url')
    setVideoUrl(url)
    setVideoFile(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setIsLoading(false)
    
    // Track analytics with network info
    trackVideoEvent('url_loaded', {
      video_source: url.includes('youtube') ? 'youtube' : 'other_url',
      url_length: url.length,
      retry_attempts: networkStatus.retryCount,
      connection_type: networkStatus.effectiveType
    })
    authAnalytics.trackFeatureUsage('video_url_loaded', {
      source: url.includes('youtube') ? 'youtube' : 'other_url',
      isAuthenticated,
      networkStatus: networkStatus.isOnline ? 'online' : 'offline'
    })
  }

  // Retry functionality for failed operations
  const handleRetry = async () => {
    if (!networkStatus.canRetry) return
    
    setIsRetrying(true)
    setError(null)
    setNetworkError(null)
    
    // Wait a moment before retrying
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (videoType === 'url' && urlInput) {
      await handleLoadUrl()
    }
    
    setIsRetrying(false)
  }

  // SIMPLIFIED - Just handle file upload directly
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    console.log('=== SIMPLE FILE UPLOAD ===')
    console.log('File name:', file.name)
    console.log('File type:', file.type)
    console.log('File size:', file.size, 'bytes')
    
    setError(null)
    setIsLoading(true)
    
    // Basic check - just see if it looks like a video file
    const isVideoFile = file.type.startsWith('video/') || 
                       file.name.match(/\.(mp4|webm|ogg|mov|avi|wmv|mkv|flv|3gp|asf|m4v)$/i)
    
    if (!isVideoFile) {
      setError('Please select a video file.')
      setIsLoading(false)
      event.target.value = ''
      return
    }
    
    // Check file size (500MB limit)
    if (file.size > 500 * 1024 * 1024) {
      setError('File is too large. Please select a video smaller than 500MB.')
      setIsLoading(false)
      event.target.value = ''
      return
    }
    
    // Create blob URL and load immediately
    const fileUrl = URL.createObjectURL(file)
    console.log('Created blob URL:', fileUrl)
    
    setVideoType('file')
    setVideoFile(fileUrl)
    setVideoUrl('')
    setIsPlaying(false)
    setCurrentTime(0)
    setIsLoading(false)
    
    // Simple analytics tracking
    trackVideoEvent('file_uploaded', {
      video_source: 'file_upload',
      file_type: file.type,
      file_size_mb: Math.round(file.size / (1024 * 1024) * 100) / 100
    })
    
    event.target.value = ''
  }

  // Format time for display
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Format timestamp
  const formatTimestamp = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Add timestamp at current time
  const handleAddTimestamp = () => {
    if (onAddTimestamp && currentTime > 0) {
      const timeString = formatTimestamp(currentTime)
      onAddTimestamp(currentTime, timeString)
      
      trackVideoEvent('timestamp_added_from_player', {
        timestamp_seconds: Math.round(currentTime),
        formatted_time: timeString
      })
      authAnalytics.trackFeatureUsage('timestamp_added_from_player', {
        timestampSeconds: Math.round(currentTime),
        isAuthenticated
      })
    }
  }

  // Clear video
  const clearVideo = () => {
    if (videoFile) {
      URL.revokeObjectURL(videoFile)
    }
    setVideoType('none')
    setVideoUrl('')
    setVideoFile(null)
    setUrlInput('')
    setError(null)
    setIsLoading(false)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  return (
    <div>
      {/* Network Status Indicator */}
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <NetworkStatusIndicator className="text-sm" />
      </div>

      {/* Upload Options */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        {/* Upload Video Button */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="btn-primary flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Video</span>
          </div>
        </label>

        {/* OR divider */}
        <span className="text-neutral-500 dark:text-gray-400 font-medium">{t('tool.or')}</span>

        {/* URL Input and Load Button */}
        <div className="flex flex-col gap-2 w-full max-w-md">
          <div className="flex gap-3">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={networkStatus.isOnline ? "Enter video URL" : "No internet connection"}
              className="input-field flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleLoadUrl()}
              disabled={!networkStatus.isOnline}
            />
            <button
              onClick={handleLoadUrl}
              disabled={!urlInput.trim() || isLoading || !networkStatus.isOnline}
              className="btn-primary flex items-center space-x-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Load</span>
            </button>
          </div>
          {/* Network Error Display */}
          {networkError && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 text-sm bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <AlertCircle className="w-4 h-4" />
                <span>{networkError}</span>
              </div>
              {networkStatus.canRetry && (
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
                >
                  {isRetrying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>{isRetrying ? 'Retrying...' : `Retry (${3 - networkStatus.retryCount} attempts left)`}</span>
                </button>
              )}
            </div>
          )}

          {error && videoType === 'none' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Player */}
      {videoType !== 'none' && (
        <div className="space-y-6">
          {/* Player Container */}
          <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-video">
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Loading video...</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="text-center text-white px-4">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                  <p className="text-sm mb-3">{error}</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setError(null)
                        setIsLoading(true)
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm underline"
                    >
                      Retry
                    </button>
                    <span className="text-gray-500">•</span>
                    <button
                      onClick={clearVideo}
                      className="text-blue-400 hover:text-blue-300 text-sm underline"
                    >
                      Try different video
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* URL Video Player (ReactPlayer) */}
            {videoType === 'url' && !error && (
              <ReactPlayer
                ref={reactPlayerRef}
                url={videoUrl}
                playing={isPlaying}
                controls={true}
                width="100%"
                height="100%"
                onProgress={(state) => {
                  setCurrentTime(state.playedSeconds)
                  onTimeUpdate?.(state.playedSeconds)
                }}
                onReady={() => {
                  setIsLoading(false)
                  setError(null)
                }}
                onStart={() => {
                  setIsLoading(false)
                }}
                onError={(error) => {
                  console.error('ReactPlayer error:', error)
                  setIsLoading(false)
                  setError('Failed to load video. Please check the URL or try a different video.')
                  trackError('video_playback_error', videoUrl)
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                config={{
                  youtube: {
                    playerVars: {
                      showinfo: 0,
                      modestbranding: 1,
                      rel: 0
                    }
                  },
                  vimeo: {
                    playerOptions: {
                      responsive: true
                    }
                  }
                }}
              />
            )}

            {/* Simplified File Video Player */}
            {videoType === 'file' && !error && (
              <video
                ref={htmlVideoRef}
                controls
                width="100%"
                height="100%"
                preload="auto"
                onLoadedData={() => {
                  console.log('Video loaded successfully')
                  setIsLoading(false)
                  setError(null)
                }}
                onTimeUpdate={(e) => {
                  const video = e.target as HTMLVideoElement
                  setCurrentTime(video.currentTime)
                  onTimeUpdate?.(video.currentTime)
                }}
                onError={() => {
                  console.log('Video playback error - but trying to continue')
                  setIsLoading(false)
                  // Don't set error - let the video try to play anyway
                }}
                onPlay={() => {
                  setIsPlaying(true)
                }}
                onPause={() => {
                  setIsPlaying(false)
                }}
                style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
                src={videoFile || ''}
              >
                <p className="text-white text-center p-4">
                  Your browser does not support HTML5 video.
                </p>
              </video>
            )}
          </div>

          {/* Current Time Display and Add Timestamp */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="bg-neutral-50 dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl px-6 py-4">
              <div className="text-center">
                <div className="text-xs text-neutral-500 dark:text-gray-400 font-medium mb-1">Current Time</div>
                <div className="text-xl font-mono font-semibold text-neutral-700 dark:text-gray-200">
                  {formatTime(currentTime) || '00:00'}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddTimestamp}
              disabled={currentTime === 0}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span>Add Timestamp at Current Time</span>
            </button>
          </div>
        </div>
      )}

      {/* Helper Text */}
      {videoType === 'none' && (
        <div className="text-center py-12 text-neutral-500 dark:text-gray-400">
          <Youtube className="h-12 w-12 mx-auto mb-3 text-neutral-400 dark:text-gray-500" />
          <p className="text-lg mb-4">{t('tool.getStartedText')}</p>
          <div className="bg-neutral-50 dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg p-4 max-w-md mx-auto text-left">
            <h4 className="font-medium text-neutral-700 dark:text-gray-300 mb-2">{t('tool.supportedFormats')}:</h4>
            <ul className="text-sm space-y-1">
              <li>• <span className="text-green-600 dark:text-green-400">✅</span> {t('tool.youtubeVideos')}</li>
              <li>• <span className="text-green-600 dark:text-green-400">✅</span> {t('tool.vimeoVideos')}</li>
              <li>• <span className="text-green-600 dark:text-green-400">✅</span> {t('tool.mostVideoFiles')}</li>
            </ul>
            <div className="text-xs text-neutral-500 dark:text-gray-500 mt-3">
              <p>{t('tool.uploadAnyVideo')}</p>
              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                <p className="text-blue-700 dark:text-blue-300 font-medium text-xs">💡 {t('tool.quickTest')}</p>
                <button
                  onClick={() => {
                    // Try with a YouTube video instead - much more reliable
                    const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                    setUrlInput(youtubeUrl)
                    
                    // Load the YouTube URL
                    setError(null)
                    setIsLoading(true)
                    
                    if (ReactPlayer.canPlay(youtubeUrl)) {
                      setVideoType('url')
                      setVideoUrl(youtubeUrl)
                      setVideoFile(null)
                      setIsPlaying(false)
                      setCurrentTime(0)
                    } else {
                      setError('YouTube video not supported.')
                      setIsLoading(false)
                    }
                  }}
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 text-xs mt-1"
                >
                  {t('tool.tryYouTubeVideo')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer