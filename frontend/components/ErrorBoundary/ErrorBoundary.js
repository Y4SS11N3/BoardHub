import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Update state so the next render will show the fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Log error information
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo ? this.state.errorInfo.componentStack : 'No stack trace available'}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;