// src/components/common/ErrorBoundary.jsx
// Production silences the console and swallows window errors (see main.jsx), so a render
// crash used to leave a blank white page with no clue for the visitor or for us. This
// catches render errors and shows a recoverable screen instead.
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    // Navigating to another page clears the error, so one broken screen does not
    // lock the visitor out of the rest of the site.
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This page could not be displayed. Please try again, or go back to the home page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
            >
              Reload page
            </button>
            <a
              href="/"
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600 hover:text-blue-600 rounded-xl font-medium"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
