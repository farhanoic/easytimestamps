import { useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { Upload, Youtube, Plus } from 'lucide-react'

interface VideoPlayerProps {
  onTimeUpdate?: (seconds: number) => void
  onAddTimestamp?: (seconds: number, timeString: string) => void
}

function VideoPlayer({ onTimeUpdate, onAddTimestamp }: VideoPlayerProps) {
  // State to track what's currently playing
  const [videoUrl, setVideoUrl] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  
  // Reference to the ReactPlayer component
  const playerRef = useRef<ReactPlayer>(null)

  // Handle loading URL from input
  const handleLoadUrl = () => {
    if (urlInput.trim()) {
      setVideoUrl(urlInput.trim())
      setIsPlaying(false)
    }
  }

  // Handle file upload for MP4 videos
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      const fileUrl = URL.createObjectURL(file)
      setVideoUrl(fileUrl)
      setIsPlaying(false)
      // Reset the input
      event.target.value = ''
    }
  }


  // When video time updates
  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds)
    onTimeUpdate?.(state.playedSeconds)
  }

  // When video loads and we get duration
  const handleDuration = () => {
    // Duration handling if needed
  }

  // Convert seconds to HH:MM:SS format
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Convert seconds to simple MM:SS or HH:MM:SS for timestamps
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
    }
  }




  return (
    <div>
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
        <span className="text-neutral-500 dark:text-gray-400 font-medium">or</span>

        {/* URL Input and Load Button */}
        <div className="flex gap-3 w-full max-w-md">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter video URL"
            className="input-field flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleLoadUrl()}
          />
          <button
            onClick={handleLoadUrl}
            disabled={!urlInput.trim()}
            className="btn-primary"
          >
            Load
          </button>
        </div>
      </div>

      {/* Video Player */}
      {videoUrl && (
        <div className="space-y-6">
          {/* Player Container */}
          <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-video">
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              playing={isPlaying}
              controls={true} // Use built-in controls for simplicity
              width="100%"
              height="100%"
              onProgress={handleProgress}
              onDuration={handleDuration}
              onError={(error) => console.error('Video error:', error)}
            />
          </div>

          {/* Current Time Display and Add Timestamp */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="bg-neutral-50 dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl px-6 py-4">
              <div className="text-center">
                <div className="text-xs text-neutral-500 dark:text-gray-400 font-medium mb-1">Current Time</div>
                <div className="text-xl font-mono font-semibold text-neutral-700 dark:text-gray-200">
                  {formatTime(currentTime) || '00:00:00'}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddTimestamp}
              disabled={!videoUrl || currentTime === 0}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span>Add Timestamp at Current Time</span>
            </button>
          </div>
        </div>
      )}

      {/* Helper Text */}
      {!videoUrl && (
        <div className="text-center py-12 text-neutral-500 dark:text-gray-400">
          <Youtube className="h-12 w-12 mx-auto mb-3 text-neutral-400 dark:text-gray-500" />
          <p className="text-lg">Add a YouTube URL or upload an MP4 file to get started</p>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer