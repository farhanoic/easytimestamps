import { useState } from 'react'
import { Plus, Clock, FileText } from 'lucide-react'

interface Timestamp {
  time: string
  description: string
  seconds: number
}

interface TimestampInputProps {
  onAddTimestamp: (timestamp: Timestamp) => void
  onExportText?: () => void
  timestamps?: Timestamp[]
  currentVideoTime?: string
}

function TimestampInput({ onAddTimestamp, timestamps = [], currentVideoTime }: TimestampInputProps) {
  const [startTime, setStartTime] = useState('00:00:00')
  const [endTime, setEndTime] = useState('00:00:55')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [exportSuccess, setExportSuccess] = useState(false)

  // Convert time string (HH:MM:SS or MM:SS) to seconds
  const timeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number)
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2] // HH:MM:SS
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1] // MM:SS
    }
    return 0
  }

  // Validate time format (accepts HH:MM:SS or MM:SS)
  const validateTime = (timeStr: string): boolean => {
    const timeRegex = /^(\d{1,2}):([0-5]?\d)(?::([0-5]?\d))?$/
    return timeRegex.test(timeStr)
  }

  // Format time input as user types
  const formatTimeInput = (value: string): string => {
    // Remove any non-digit characters except colons
    const cleaned = value.replace(/[^\d:]/g, '')
    
    // Auto-format to HH:MM:SS
    if (cleaned.length <= 2) {
      return cleaned
    } else if (cleaned.length <= 4) {
      return cleaned.replace(/(\d{2})(\d)/, '$1:$2')
    } else if (cleaned.length <= 6) {
      return cleaned.replace(/(\d{2})(\d{2})(\d)/, '$1:$2:$3')
    } else {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3')
    }
  }

  // Handle time input changes
  const handleTimeChange = (value: string, setter: (val: string) => void) => {
    const formatted = formatTimeInput(value)
    setter(formatted)
    setError('')
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate inputs
    if (!startTime.trim()) {
      setError('Please enter a start time')
      return
    }

    if (!endTime.trim()) {
      setError('Please enter an end time')
      return
    }

    if (!description.trim()) {
      setError('Please enter a description')
      return
    }

    if (!validateTime(startTime)) {
      setError('Please enter start time in HH:MM:SS format')
      return
    }

    if (!validateTime(endTime)) {
      setError('Please enter end time in HH:MM:SS format')
      return
    }

    const startSeconds = timeToSeconds(startTime)
    const endSeconds = timeToSeconds(endTime)

    if (startSeconds >= endSeconds) {
      setError('End time must be after start time')
      return
    }

    // Create timestamp object using start time
    const newTimestamp: Timestamp = {
      time: startTime,
      description: `${description.trim()} (${startTime} - ${endTime})`,
      seconds: startSeconds
    }

    // Add timestamp and reset form
    onAddTimestamp(newTimestamp)
    setStartTime('00:00:00')
    setEndTime('00:00:55')
    setDescription('')
  }

  // Handle adding new section with form validation
  const handleAddSection = () => {
    setError('')

    // Validate inputs
    if (!startTime.trim()) {
      setError('Please enter a start time')
      return
    }

    if (!validateTime(startTime)) {
      setError('Please enter start time in HH:MM:SS format')
      return
    }

    // Use form description or default to "New Section"
    const sectionDescription = description.trim() || 'New Section'
    
    // Create section timestamp using form values
    const sectionTimestamp: Timestamp = {
      time: startTime,
      description: sectionDescription,
      seconds: timeToSeconds(startTime)
    }
    
    // Add timestamp and clear form
    onAddTimestamp(sectionTimestamp)
    setStartTime('00:00:00')
    setEndTime('00:00:55')
    setDescription('')
  }

  // Handle populate start time from video
  const handlePopulateStartTime = () => {
    if (currentVideoTime) {
      setStartTime(currentVideoTime)
      setError('')
    }
  }

  // Handle export as text with clipboard copy and success feedback
  const handleExportText = () => {
    if (timestamps.length === 0) {
      setError('No timestamps to export')
      return
    }

    // Format timestamps for YouTube description
    const content = timestamps
      .map(ts => `${ts.time} ${ts.description}`)
      .join('\n')
    
    // Copy to clipboard
    navigator.clipboard.writeText(content)
      .then(() => {
        setExportSuccess(true)
        setError('')
        // Clear success message after 3 seconds
        setTimeout(() => setExportSuccess(false), 3000)
      })
      .catch(() => {
        // Fallback: download as file if clipboard fails
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = 'timestamps.txt'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        setError('Clipboard failed, downloaded file instead')
      })
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-700">
          Add Timestamp Range
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Three Input Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Start Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              {currentVideoTime && (
                <button
                  type="button"
                  onClick={handlePopulateStartTime}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-md transition-colors duration-200"
                >
                  Use Current Time
                </button>
              )}
            </div>
            <input
              type="text"
              value={startTime}
              onChange={(e) => handleTimeChange(e.target.value, setStartTime)}
              placeholder="00:00:00"
              className="w-full px-4 py-3 text-center font-mono text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50"
              maxLength={8}
            />
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="text"
              value={endTime}
              onChange={(e) => handleTimeChange(e.target.value, setEndTime)}
              placeholder="00:00:55"
              className="w-full px-4 py-3 text-center font-mono text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50"
              maxLength={8}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setError('')
              }}
              placeholder="Enter description"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {exportSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm font-medium">✅ Timestamps copied to clipboard successfully!</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>Add Timestamp Range</span>
          </button>
        </div>

        {/* Helper Text */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Use HH:MM:SS format (e.g., 01:23:45 or 00:05:30)</li>
              <li>• End time must be after start time</li>
              <li>• Description will include the time range automatically</li>
            </ul>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {/* Add Section Button (Left) */}
          <button
            type="button"
            onClick={handleAddSection}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>Add Section</span>
          </button>

          {/* Export as Text Button (Right) */}
          <button
            type="button"
            onClick={handleExportText}
            disabled={timestamps.length === 0}
            className={`${
              exportSuccess 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
            } ${
              timestamps.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            } px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md`}
          >
            <FileText className="h-5 w-5" />
            <span>{exportSuccess ? 'Copied!' : 'Export as Text'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default TimestampInput