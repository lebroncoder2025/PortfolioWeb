import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40 }}>
          <h1>Coś poszło nie tak.</h1>
          <p style={{ color: 'gray' }}>{this.state.error?.message || 'Błąd wykonania aplikacji.'}</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 10 }}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
