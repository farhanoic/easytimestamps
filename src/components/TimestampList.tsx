import { useState } from 'react'
import { Copy, Check, Edit2, Trash2, Save, X } from 'lucide-react'
import { trackTimestampEvent, trackExportEvent, trackFeatureUsage } from '../utils/analytics'

interface Timestamp {
  startTime: string
  endTime?: string
  description: string
  seconds: number
}

interface TimestampListProps {
  timestamps: Timestamp[]
  onEditTimestamp: (index: number, updatedTimestamp: Timestamp) => void
  onDeleteTimestamp: (index: number) => void
}

function TimestampList({ timestamps, onEditTimestamp, onDeleteTimestamp }: TimestampListProps) {
  const [copied, setCopied] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Timestamp | null>(null)
  
  // Format time to HH:MM:SS
  const formatToHHMMSS = (timeStr: string): string => {
    if (!timeStr) return '00:00:00'
    
    const parts = timeStr.split(':')
    
    if (parts.length === 2) {
      // MM:SS format - add hour
      return `00:${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
    } else if (parts.length === 3) {
      // HH:MM:SS format - ensure padding
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`
    } else if (parts.length === 1) {
      // SS format - add hour and minute
      return `00:00:${parts[0].padStart(2, '0')}`
    }
    
    return timeStr // fallback
  }
  
  // Format timestamps for YouTube
  const formatForYouTube = () => {
    return timestamps
      .map(ts => {
        const formattedStartTime = formatToHHMMSS(ts.startTime)
        if (ts.endTime) {
          const formattedEndTime = formatToHHMMSS(ts.endTime)
          return `${formattedStartTime} - ${formattedEndTime} | ${ts.description}`
        } else {
          return `${formattedStartTime} | ${ts.description}`
        }
      })
      .join('\n')
  }

  // Copy to clipboard with success feedback
  const copyToClipboard = () => {
    if (timestamps.length === 0) return
    
    const formattedText = formatForYouTube()
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        
        // Track successful copy to clipboard
        trackExportEvent('copy_to_clipboard', {
          timestamp_count: timestamps.length,
          total_characters: formattedText.length
        })
        trackFeatureUsage('copy_timestamps')
      })
      .catch(() => {
        alert('Failed to copy to clipboard')
        trackExportEvent('copy_to_clipboard_failed', {
          timestamp_count: timestamps.length
        })
      })
  }

  // Start editing a timestamp
  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditForm({ ...timestamps[index] })
    
    // Track edit action start
    trackTimestampEvent('edit_started', {
      timestamp_index: index,
      has_end_time: !!timestamps[index].endTime
    })
    trackFeatureUsage('edit_timestamp')
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingIndex(null)
    setEditForm(null)
    
    // Track edit cancellation
    trackTimestampEvent('edit_cancelled')
  }

  // Save edited timestamp
  const saveEdit = () => {
    if (editForm && editingIndex !== null) {
      // Convert time string to seconds for sorting
      const timeToSeconds = (timeStr: string): number => {
        const parts = timeStr.split(':').map(Number)
        if (parts.length === 2) {
          return parts[0] * 60 + parts[1] // MM:SS
        } else if (parts.length === 3) {
          return parts[0] * 3600 + parts[1] * 60 + parts[2] // HH:MM:SS
        }
        return 0
      }
      
      const updatedTimestamp = {
        ...editForm,
        seconds: timeToSeconds(editForm.startTime)
      }
      
      onEditTimestamp(editingIndex, updatedTimestamp)
      
      // Track successful edit save
      trackTimestampEvent('edit_saved', {
        timestamp_index: editingIndex,
        has_end_time: !!editForm.endTime
      })
      
      setEditingIndex(null)
      setEditForm(null)
    }
  }

  // Delete timestamp with confirmation
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this timestamp?')) {
      // Track deletion before actually deleting
      trackTimestampEvent('timestamp_deleted', {
        timestamp_index: index,
        has_end_time: !!timestamps[index].endTime
      })
      trackFeatureUsage('delete_timestamp')
      
      onDeleteTimestamp(index)
    } else {
      // Track deletion cancellation
      trackTimestampEvent('delete_cancelled', {
        timestamp_index: index
      })
    }
  }


  return (
    <div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={copyToClipboard}
          className={`${
            copied 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'btn-primary'
          } flex items-center justify-center space-x-2`}
          title="Copy YouTube format to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>
      </div>


      {/* Individual Timestamps with Edit/Delete */}
      {timestamps.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-medium text-neutral-700 dark:text-gray-200 mb-4">
            Timestamps ({timestamps.length})
          </h3>
          <div className="space-y-3">
            {timestamps.map((timestamp, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-700 p-4">
                {editingIndex === index ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-gray-200 mb-1">
                          Start Time
                        </label>
                        <input
                          type="text"
                          value={editForm?.startTime || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, startTime: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-neutral-700 dark:text-gray-200"
                          placeholder="00:00:00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-gray-200 mb-1">
                          End Time (optional)
                        </label>
                        <input
                          type="text"
                          value={editForm?.endTime || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, endTime: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-neutral-700 dark:text-gray-200"
                          placeholder="00:00:00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-gray-200 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={editForm?.description || ''}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-neutral-700 dark:text-gray-200"
                        placeholder="Description"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                      >
                        <Save className="h-3 w-3" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-mono text-sm text-blue-600 dark:text-blue-400 mb-1">
                        {formatToHHMMSS(timestamp.startTime)}
                        {timestamp.endTime && ` - ${formatToHHMMSS(timestamp.endTime)}`}
                      </div>
                      <div className="text-neutral-700 dark:text-gray-200">
                        {timestamp.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => startEdit(index)}
                        className="p-1 text-neutral-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Edit timestamp"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-1 text-neutral-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete timestamp"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* YouTube Format Preview */}
      {timestamps.length > 0 && (
        <div className="mt-8 p-6 bg-neutral-50 dark:bg-gray-800/50 rounded-xl border border-neutral-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-neutral-700 dark:text-gray-200 mb-3">
            YouTube Format Preview
          </h3>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-neutral-200 dark:border-gray-600 p-4 max-h-32 overflow-y-auto">
            <pre className="text-sm text-neutral-600 dark:text-gray-300 whitespace-pre-wrap font-mono">
              {formatForYouTube()}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimestampList