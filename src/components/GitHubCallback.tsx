import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * GitHub OAuth Callback Handler
 * This component handles the OAuth callback from GitHub
 */
export const GitHubCallback: React.FC = () => {
  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        // Send error to parent window
        window.opener?.postMessage({
          type: 'GITHUB_OAUTH_ERROR',
          error: errorDescription || error
        }, window.location.origin);
        window.close();
        return;
      }

      if (code && state) {
        // Send success to parent window
        window.opener?.postMessage({
          type: 'GITHUB_OAUTH_SUCCESS',
          code,
          state
        }, window.location.origin);
        window.close();
        return;
      }

      // No valid parameters found
      window.opener?.postMessage({
        type: 'GITHUB_OAUTH_ERROR',
        error: 'Invalid callback parameters'
      }, window.location.origin);
      window.close();
    };

    // Handle callback immediately
    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Completing GitHub Sign-In
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we redirect you back to Easy Timestamps...
        </p>
      </div>
    </div>
  );
};