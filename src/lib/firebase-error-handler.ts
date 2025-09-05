/**
 * Firebase Error Handler Utility
 * Provides centralized error handling for Firebase operations
 */

export interface FirebaseError {
  code: string
  message: string
  details?: any
}

export class FirebaseErrorHandler {
  /**
   * Handle Firebase errors and provide user-friendly messages
   */
  static handleError(error: any): FirebaseError {
    // Handle empty or undefined error objects
    if (!error || (typeof error === 'object' && Object.keys(error).length === 0)) {
      return {
        code: 'empty-error',
        message: 'An empty error occurred - this usually indicates an authentication or permission issue',
        details: error
      }
    }

    const firebaseError: FirebaseError = {
      code: error.code || 'unknown',
      message: error.message || 'An unknown error occurred',
      details: error
    }

    // Handle specific Firebase error codes
    switch (error.code) {
      case 'permission-denied':
        firebaseError.message = 'You do not have permission to perform this action. Please ensure you are logged in.'
        break
      case 'unauthenticated':
        firebaseError.message = 'You must be logged in to perform this action.'
        break
      case 'not-found':
        firebaseError.message = 'The requested resource was not found.'
        break
      case 'already-exists':
        firebaseError.message = 'This resource already exists.'
        break
      case 'failed-precondition':
        firebaseError.message = 'The operation failed due to a precondition.'
        break
      case 'aborted':
        firebaseError.message = 'The operation was aborted.'
        break
      case 'out-of-range':
        firebaseError.message = 'The operation is out of range.'
        break
      case 'unimplemented':
        firebaseError.message = 'This operation is not implemented.'
        break
      case 'internal':
        firebaseError.message = 'An internal error occurred. Please try again.'
        break
      case 'unavailable':
        firebaseError.message = 'The service is currently unavailable. Please try again later.'
        break
      case 'data-loss':
        firebaseError.message = 'Data loss occurred during the operation.'
        break
      default:
        // Keep the original message for unknown errors
        break
    }

    return firebaseError
  }

  /**
   * Check if an error is a permission-related error
   */
  static isPermissionError(error: any): boolean {
    return error.code === 'permission-denied' || 
           error.code === 'unauthenticated' ||
           error.message?.includes('permission') ||
           error.message?.includes('authentication')
  }

  /**
   * Check if an error is a network-related error
   */
  static isNetworkError(error: any): boolean {
    return error.code === 'unavailable' ||
           error.message?.includes('network') ||
           error.message?.includes('connection')
  }

  /**
   * Check if an error is an offline-related error
   */
  static isOfflineError(error: any): boolean {
    return error.code === 'unavailable' ||
           error.message?.includes('offline') ||
           error.message?.includes('network') ||
           error.message?.includes('connection') ||
           error.message?.includes('timeout')
  }

  /**
   * Log error with context
   */
  static logError(error: any, context: string = 'Firebase operation') {
    const handledError = this.handleError(error)
    
    // Only log if it's not an empty error or offline-related
    if (handledError.code !== 'empty-error' && !this.isOfflineError(error)) {
      console.error(`[${context}] Firebase Error:`, {
        code: handledError.code,
        message: handledError.message,
        originalError: error,
        timestamp: new Date().toISOString()
      })
    } else {
      // Log offline errors as warnings instead
      console.warn(`[${context}] ${handledError.message}`)
    }

    return handledError
  }

  /**
   * Retry operation with exponential backoff
   */
  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        // Don't retry permission errors
        if (this.isPermissionError(error)) {
          throw error
        }

        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break
        }

        // Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt)
        console.log(`[Retry ${attempt + 1}/${maxRetries}] Retrying in ${delay}ms...`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }
}

/**
 * Wrapper function for Firebase operations with error handling
 */
export async function withFirebaseErrorHandling<T>(
  operation: () => Promise<T>,
  context: string = 'Firebase operation'
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    const handledError = FirebaseErrorHandler.logError(error, context)
    throw handledError
  }
}
