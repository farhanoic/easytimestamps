import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import VideoPlayer from './VideoPlayer'
import TimestampForm from './TimestampForm'
import TimestampList from './TimestampList'
import { useStats } from '../hooks/useStats'

interface Timestamp {
  id: string
  time: string
  description: string
  seconds: number
}

// Legacy interface support
interface LegacyTimestamp {
  startTime: string
  endTime?: string
  description: string
  seconds: number
}

// Convert new timestamp to legacy for components that expect legacy format
const convertToLegacy = (timestamp: Timestamp): LegacyTimestamp => {
  // Check if time is in range format (e.g., "0:00 - 0:45")
  if (timestamp.time.includes(' - ')) {
    const parts = timestamp.time.split(' - ')
    return {
      startTime: parts[0],
      endTime: parts[1],
      description: timestamp.description,
      seconds: timestamp.seconds
    }
  }
  
  // Single time format
  return {
    startTime: timestamp.time,
    description: timestamp.description,
    seconds: timestamp.seconds
  }
}

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function TimestampExtractor() {
  const { t } = useTranslation()
  const [timestamps, setTimestamps] = useState<Timestamp[]>([])
  const [, setCurrentVideoTime] = useState(0)
  
  const { incrementTimestamps } = useStats()
  

  // Convert legacy timestamp to new format
  const convertLegacyTimestamp = (legacy: LegacyTimestamp): Timestamp => ({
    id: generateId(),
    time: legacy.endTime ? `${legacy.startTime} - ${legacy.endTime}` : legacy.startTime,
    description: legacy.description,
    seconds: legacy.seconds
  })

  // Add a single timestamp from the form
  const addTimestamp = (newTimestamp: LegacyTimestamp | Timestamp) => {
    const timestamp = 'id' in newTimestamp ? newTimestamp : convertLegacyTimestamp(newTimestamp)
    
    setTimestamps(prev => [...prev, timestamp].sort((a, b) => a.seconds - b.seconds))
    // Track timestamp generation for real-time stats
    incrementTimestamps(1)
  }

  // Edit existing timestamp
  const editTimestamp = (index: number, updatedTimestamp: LegacyTimestamp) => {
    const newTimestamp = convertLegacyTimestamp(updatedTimestamp)
    newTimestamp.id = timestamps[index]?.id || generateId()
    
    setTimestamps(prev => 
      prev.map((ts, i) => i === index ? newTimestamp : ts)
        .sort((a, b) => a.seconds - b.seconds)
    )
  }

  // Delete timestamp
  const deleteTimestamp = (index: number) => {
    setTimestamps(prev => prev.filter((_, i) => i !== index))
  }
  

  // Add timestamp from video player at current time with automatic range generation
  const addTimestampAtCurrentTime = (_seconds: number, timeString: string) => {
    const description = prompt(t('timestamp.enterDescription', 'Enter description for this timestamp:'))
    if (description && description.trim()) {
      
      // Determine start time based on existing timestamps
      let startTime = '0:00'
      let startSeconds = 0
      
      // If there are existing timestamps, use the last timestamp's end time as start time
      if (timestamps.length > 0) {
        const lastTimestamp = timestamps[timestamps.length - 1]
        
        // Extract end time from range format (e.g., "0:00 - 0:04" -> "0:04")
        if (lastTimestamp.time.includes(' - ')) {
          const parts = lastTimestamp.time.split(' - ')
          startTime = parts[1] // Get the end time
          // Convert end time to seconds for sorting
          const timeParts = startTime.split(':').map(Number)
          if (timeParts.length === 2) {
            startSeconds = timeParts[0] * 60 + timeParts[1]
          } else if (timeParts.length === 3) {
            startSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
          }
        } else {
          // If it's a single time, use it as start time
          startTime = lastTimestamp.time
          startSeconds = lastTimestamp.seconds
        }
      }
      
      // Create timestamp with automatic range (startTime - currentTime)
      const newTimestamp: Timestamp = {
        id: generateId(),
        time: `${startTime} - ${timeString}`, // Create range format
        description: description.trim(),
        seconds: startSeconds // Use start time for sorting
      }
      
      addTimestamp(newTimestamp)
    }
  }
  

  // Handle video time updates
  const handleVideoTimeUpdate = (seconds: number) => {
    setCurrentVideoTime(seconds)
  }




  return (
    <div className="space-y-8">
      {/* Video Upload/URL Section */}
      <div className="card max-w-4xl mx-auto">
        <VideoPlayer 
          onTimeUpdate={handleVideoTimeUpdate} 
          onAddTimestamp={addTimestampAtCurrentTime}
        />
      </div>
      
      {/* Timestamp Creation Section */}
      <div className="card max-w-4xl mx-auto">
        <TimestampForm 
          onAddTimestamp={addTimestamp} 
          timestamps={timestamps.map(convertToLegacy)}
        />
      </div>

      {/* Timestamp List Section */}
      {timestamps.length > 0 && (
        <div className="card max-w-4xl mx-auto">
          <TimestampList 
            timestamps={timestamps.map(convertToLegacy)}
            onEditTimestamp={editTimestamp}
            onDeleteTimestamp={deleteTimestamp}
          />
        </div>
      )}
      
    </div>
  )
}

export default TimestampExtractor