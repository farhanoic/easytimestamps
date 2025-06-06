import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'

interface Timestamp {
  startTime: string
  endTime?: string
  description: string
  seconds: number
}

interface TimestampFormProps {
  onAddTimestamp: (timestamp: Timestamp) => void
  timestamps?: Timestamp[]
}

function TimestampForm({ onAddTimestamp, timestamps = [] }: TimestampFormProps) {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  // Auto-populate start time based on last timestamp's end time
  const getNextStartTime = useCallback(() => {
    if (timestamps.length === 0) return ''
    const lastTimestamp = timestamps[timestamps.length - 1]
    return lastTimestamp.endTime || lastTimestamp.startTime
  }, [timestamps])

  // Auto-populate start time when timestamps change
  useEffect(() => {
    if (timestamps.length > 0) {
      const nextStartTime = getNextStartTime()
      if (nextStartTime) {
        setStartTime(nextStartTime)
      }
    } else {
      setStartTime('')
    }
  }, [timestamps, getNextStartTime])

  // Convert time string (like "2:30") to seconds
  const timeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number)
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1] // MM:SS
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2] // HH:MM:SS
    }
    return 0
  }

  // Validate time format (accepts MM:SS or HH:MM:SS)
  const validateTime = (timeStr: string): boolean => {
    const timeRegex = /^(\d{1,2}):([0-5]?\d)(?::([0-5]?\d))?$/
    return timeRegex.test(timeStr)
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

    if (!description.trim()) {
      setError('Please enter a description')
      return
    }

    if (!validateTime(startTime)) {
      setError('Please enter start time in MM:SS or HH:MM:SS format (e.g., 1:30 or 1:30:45)')
      return
    }

    // Validate end time if provided
    if (endTime.trim()) {
      if (!validateTime(endTime)) {
        setError('Please enter end time in MM:SS or HH:MM:SS format (e.g., 1:30 or 1:30:45)')
        return
      }

      const startSeconds = timeToSeconds(startTime.trim())
      const endSeconds = timeToSeconds(endTime.trim())

      if (startSeconds >= endSeconds) {
        setError('End time must be after start time')
        return
      }
    }

    // Create timestamp object with optional end time
    const newTimestamp: Timestamp = {
      startTime: startTime.trim(),
      endTime: endTime.trim() || undefined,
      description: description.trim(),
      seconds: timeToSeconds(startTime.trim())
    }

    // Add timestamp and clear form
    onAddTimestamp(newTimestamp)
    
    // Auto-populate start time for next section
    const nextStartTime = endTime.trim() || startTime.trim()
    setStartTime(nextStartTime)
    setEndTime('')
    setDescription('')
  }

  // Handle start time input change with basic formatting
  const handleStartTimeChange = (value: string) => {
    // Remove any non-digit or colon characters
    const cleaned = value.replace(/[^\d:]/g, '')
    setStartTime(cleaned)
    
    // Clear error when user starts typing
    if (error) setError('')
  }

  // Handle end time input change with basic formatting
  const handleEndTimeChange = (value: string) => {
    // Remove any non-digit or colon characters
    const cleaned = value.replace(/[^\d:]/g, '')
    setEndTime(cleaned)
    
    // Clear error when user starts typing
    if (error) setError('')
  }

  // Handle description change
  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    
    // Clear error when user starts typing
    if (error) setError('')
  }


  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Start Time Input */}
          <div className="flex-shrink-0 w-full sm:w-48">
            <input
              id="startTime"
              type="text"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              placeholder="00:00:00"
              className="input-field font-mono text-center"
            />
          </div>

          {/* Dash */}
          <div className="hidden sm:flex items-center justify-center">
            <span className="text-neutral-400 dark:text-gray-500 text-xl">-</span>
          </div>

          {/* End Time Input */}
          <div className="flex-shrink-0 w-full sm:w-48">
            <input
              id="endTime"
              type="text"
              value={endTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              placeholder="00:00:55"
              className="input-field font-mono text-center"
              title="End time (optional)"
            />
          </div>

          {/* Description Input */}
          <div className="flex-1">
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Enter description"
              className="input-field w-full"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4">
            <p className="text-rose-700 dark:text-rose-300 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Section</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default TimestampForm