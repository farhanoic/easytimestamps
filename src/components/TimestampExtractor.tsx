import { useState } from 'react'
import VideoPlayer from './VideoPlayer'
import TimestampForm from './TimestampForm'
import TimestampList from './TimestampList'

interface Timestamp {
  startTime: string
  endTime?: string
  description: string
  seconds: number
}

function TimestampExtractor() {
  const [timestamps, setTimestamps] = useState<Timestamp[]>([])
  const [, setCurrentVideoTime] = useState(0)


  // Add a single timestamp from the form
  const addTimestamp = (newTimestamp: Timestamp) => {
    setTimestamps(prev => [...prev, newTimestamp].sort((a, b) => a.seconds - b.seconds))
  }

  // Edit existing timestamp
  const editTimestamp = (index: number, updatedTimestamp: Timestamp) => {
    setTimestamps(prev => 
      prev.map((ts, i) => i === index ? updatedTimestamp : ts)
        .sort((a, b) => a.seconds - b.seconds)
    )
  }

  // Delete timestamp
  const deleteTimestamp = (index: number) => {
    setTimestamps(prev => prev.filter((_, i) => i !== index))
  }

  // Add timestamp from video player at current time
  const addTimestampAtCurrentTime = (_seconds: number, timeString: string) => {
    const description = prompt('Enter description for this timestamp:')
    if (description && description.trim()) {
      // Get the start time from the last timestamp's end time, or 00:00:00 if none
      let startTime = '00:00:00'
      if (timestamps.length > 0) {
        const lastTimestamp = timestamps[timestamps.length - 1]
        startTime = lastTimestamp.endTime || lastTimestamp.startTime
      }
      
      const newTimestamp: Timestamp = {
        startTime: startTime,
        endTime: timeString,
        description: description.trim(),
        seconds: timeToSeconds(startTime)
      }
      addTimestamp(newTimestamp)
    }
  }

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

  // Handle video time updates
  const handleVideoTimeUpdate = (seconds: number) => {
    setCurrentVideoTime(seconds)
  }




  return (
    <div className="space-y-12">
      {/* Video Upload/URL Section */}
      <div className="card max-w-4xl mx-auto">
        <VideoPlayer 
          onTimeUpdate={handleVideoTimeUpdate} 
          onAddTimestamp={addTimestampAtCurrentTime}
        />
      </div>
      
      {/* Timestamp Creation Section */}
      <div className="card max-w-4xl mx-auto">
        <TimestampForm onAddTimestamp={addTimestamp} timestamps={timestamps} />
      </div>

      {/* Timestamp List Section */}
      {timestamps.length > 0 && (
        <div className="card max-w-4xl mx-auto">
          <TimestampList 
            timestamps={timestamps}
            onEditTimestamp={editTimestamp}
            onDeleteTimestamp={deleteTimestamp}
          />
        </div>
      )}
    </div>
  )
}

export default TimestampExtractor