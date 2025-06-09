import { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react'
import { useNetworkStatus } from '../hooks/useNetworkStatus'

interface NetworkStatusIndicatorProps {
  className?: string
  showDetails?: boolean
}

const NetworkStatusIndicator = ({ className = '', showDetails = false }: NetworkStatusIndicatorProps) => {
  const networkStatus = useNetworkStatus()
  const [showTooltip, setShowTooltip] = useState(false)
  const [lastOfflineTime, setLastOfflineTime] = useState<Date | null>(null)

  useEffect(() => {
    if (!networkStatus.isOnline) {
      setLastOfflineTime(new Date())
    } else {
      setLastOfflineTime(null)
    }
  }, [networkStatus.isOnline])

  const getStatusColor = () => {
    if (!networkStatus.isOnline) return 'text-red-500'
    if (networkStatus.isSlowConnection) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatusIcon = () => {
    if (!networkStatus.isOnline) return <WifiOff className="w-4 h-4" />
    if (networkStatus.isSlowConnection) return <AlertTriangle className="w-4 h-4" />
    return <Wifi className="w-4 h-4" />
  }

  const getStatusText = () => {
    if (!networkStatus.isOnline) return 'Offline'
    if (networkStatus.isSlowConnection) return 'Slow Connection'
    return 'Online'
  }

  const getConnectionDetails = () => {
    if (!networkStatus.isOnline) {
      return 'No internet connection detected'
    }

    const details = []
    if (networkStatus.effectiveType) {
      details.push(`Speed: ${networkStatus.effectiveType.toUpperCase()}`)
    }
    if (networkStatus.downlink) {
      details.push(`Bandwidth: ${networkStatus.downlink.toFixed(1)} Mbps`)
    }
    if (networkStatus.rtt) {
      details.push(`Latency: ${networkStatus.rtt}ms`)
    }
    if (networkStatus.saveData) {
      details.push('Data Saver: ON')
    }

    return details.length > 0 ? details.join(' • ') : 'Connection active'
  }

  if (!showDetails && networkStatus.isOnline && !networkStatus.isSlowConnection) {
    return null // Hide when everything is working fine
  }

  return (
    <div 
      className={`relative inline-flex items-center space-x-2 ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        {showDetails && (
          <span className="text-xs font-medium">
            {getStatusText()}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg z-50 whitespace-nowrap">
          <div className="font-medium mb-1">{getStatusText()}</div>
          <div className="text-gray-300 dark:text-gray-600">{getConnectionDetails()}</div>
          {lastOfflineTime && (
            <div className="text-gray-400 dark:text-gray-500 mt-1">
              Lost connection at {lastOfflineTime.toLocaleTimeString()}
            </div>
          )}
          {networkStatus.retryCount > 0 && (
            <div className="text-yellow-300 dark:text-yellow-600 mt-1">
              Retry attempts: {networkStatus.retryCount}
            </div>
          )}
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      )}

      {/* Pulse animation for offline state */}
      {!networkStatus.isOnline && (
        <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></div>
      )}
    </div>
  )
}

export default NetworkStatusIndicator