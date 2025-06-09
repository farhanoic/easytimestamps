interface RetryOptions {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  backoffFactor: number
  jitter: boolean
}

interface RetryResult<T> {
  success: boolean
  data?: T
  error?: Error
  attempts: number
}

export class RetryableError extends Error {
  constructor(message: string, public isRetryable: boolean = true) {
    super(message)
    this.name = 'RetryableError'
  }
}

export class NetworkError extends RetryableError {
  constructor(message: string = 'Network connection failed') {
    super(message, true)
    this.name = 'NetworkError'
  }
}

export class ServiceUnavailableError extends RetryableError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, true)
    this.name = 'ServiceUnavailableError'
  }
}

const defaultOptions: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  jitter: true
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const calculateDelay = (attempt: number, options: RetryOptions): number => {
  const exponentialDelay = Math.min(
    options.baseDelay * Math.pow(options.backoffFactor, attempt),
    options.maxDelay
  )
  
  if (options.jitter) {
    // Add random jitter (±25%)
    const jitterRange = exponentialDelay * 0.25
    const jitter = (Math.random() - 0.5) * 2 * jitterRange
    return Math.max(0, exponentialDelay + jitter)
  }
  
  return exponentialDelay
}

export const isRetryableError = (error: Error): boolean => {
  // Network errors
  if (error instanceof NetworkError || error instanceof ServiceUnavailableError) {
    return true
  }
  
  // Check for common network error patterns
  const retryablePatterns = [
    'fetch', 'network', 'timeout', 'connection',
    'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND',
    'ERR_NETWORK', 'ERR_INTERNET_DISCONNECTED'
  ]
  
  const errorMessage = error.message.toLowerCase()
  return retryablePatterns.some(pattern => errorMessage.includes(pattern))
}

export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {},
  onRetry?: (attempt: number, error: Error) => void
): Promise<RetryResult<T>> => {
  const opts = { ...defaultOptions, ...options }
  let lastError: Error
  
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      const result = await operation()
      return {
        success: true,
        data: result,
        attempts: attempt + 1
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      // Don't retry on the last attempt or if error is not retryable
      if (attempt === opts.maxRetries || !isRetryableError(lastError)) {
        break
      }
      
      const delay = calculateDelay(attempt, opts)
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, lastError.message)
      
      onRetry?.(attempt + 1, lastError)
      await sleep(delay)
    }
  }
  
  return {
    success: false,
    error: lastError!,
    attempts: opts.maxRetries + 1
  }
}

// Specific retry wrapper for fetch requests
export const retryFetch = async (
  url: string,
  options: RequestInit = {},
  retryOptions: Partial<RetryOptions> = {}
): Promise<Response> => {
  const result = await withRetry(
    async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          if (response.status >= 500 || response.status === 429) {
            throw new ServiceUnavailableError(`Server error: ${response.status}`)
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        return response
      } catch (error) {
        clearTimeout(timeoutId)
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new NetworkError('Request timeout')
          }
          if (error.message.includes('fetch')) {
            throw new NetworkError('Network request failed')
          }
        }
        
        throw error
      }
    },
    retryOptions
  )
  
  if (!result.success) {
    throw result.error
  }
  
  return result.data!
}

// Analytics with fallback and retry
export const safeAnalyticsCall = async (
  operation: () => Promise<any>,
  fallback?: () => void
): Promise<void> => {
  try {
    const result = await withRetry(operation, {
      maxRetries: 2,
      baseDelay: 500,
      maxDelay: 2000
    })
    
    if (!result.success) {
      console.warn('Analytics call failed after retries:', result.error?.message)
      fallback?.()
    }
  } catch (error) {
    console.warn('Analytics error (non-blocking):', error)
    fallback?.()
  }
}

export const createCircuitBreaker = (
  threshold: number = 5,
  timeout: number = 60000
) => {
  let failures = 0
  let lastFailureTime = 0
  let state: 'closed' | 'open' | 'half-open' = 'closed'
  
  return {
    async execute<T>(operation: () => Promise<T>): Promise<T> {
      const now = Date.now()
      
      // Reset if timeout has passed
      if (state === 'open' && now - lastFailureTime > timeout) {
        state = 'half-open'
        failures = 0
      }
      
      if (state === 'open') {
        throw new Error('Circuit breaker is open - service unavailable')
      }
      
      try {
        const result = await operation()
        
        if (state === 'half-open') {
          state = 'closed'
          failures = 0
        }
        
        return result
      } catch (error) {
        failures++
        lastFailureTime = now
        
        if (failures >= threshold) {
          state = 'open'
        }
        
        throw error
      }
    },
    
    getState: () => ({ state, failures, lastFailureTime })
  }
}