import { useState, useEffect } from 'react'

interface NetworkStatus {
  isOnline: boolean
  connectionType: string
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

interface UseNetworkStatusReturn extends NetworkStatus {
  isSlowConnection: boolean
  canRetry: boolean
  retryCount: number
  resetRetry: () => void
  incrementRetry: () => void
}

export const useNetworkStatus = (): UseNetworkStatusReturn => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionType, setConnectionType] = useState('unknown')
  const [effectiveType, setEffectiveType] = useState<string>()
  const [downlink, setDownlink] = useState<number>()
  const [rtt, setRtt] = useState<number>()
  const [saveData, setSaveData] = useState<boolean>()
  const [retryCount, setRetryCount] = useState(0)

  const updateNetworkInfo = () => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    if (connection) {
      setConnectionType(connection.type || 'unknown')
      setEffectiveType(connection.effectiveType)
      setDownlink(connection.downlink)
      setRtt(connection.rtt)
      setSaveData(connection.saveData)
    }
  }

  const handleOnline = () => {
    setIsOnline(true)
    updateNetworkInfo()
    console.log('Network: Back online')
  }

  const handleOffline = () => {
    setIsOnline(false)
    console.log('Network: Gone offline')
  }

  const resetRetry = () => {
    setRetryCount(0)
  }

  const incrementRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  useEffect(() => {
    // Initial network info
    updateNetworkInfo()

    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen for connection changes
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo)
      }
    }
  }, [])

  // Reset retry count when coming back online
  useEffect(() => {
    if (isOnline) {
      setRetryCount(0)
    }
  }, [isOnline])

  const isSlowConnection: boolean = effectiveType === 'slow-2g' || effectiveType === '2g' || (rtt ? rtt > 2000 : false) || (downlink ? downlink < 0.5 : false)
  const canRetry = retryCount < 3 && isOnline

  return {
    isOnline,
    connectionType,
    effectiveType,
    downlink,
    rtt,
    saveData,
    isSlowConnection,
    canRetry,
    retryCount,
    resetRetry,
    incrementRetry
  }
}