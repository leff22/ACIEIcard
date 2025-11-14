import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ErrorBoundary capturou erro:', error)
    console.error('💥 Info do erro:', errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f8f8', 
          border: '1px solid #ddd',
          borderRadius: '8px',
          margin: '20px',
          fontFamily: 'monospace'
        }}>
          <h1>🚨 Algo deu errado!</h1>
          <p>Erro: {this.state.error?.message}</p>
          <pre>{this.state.error?.stack}</pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Recarregar Página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}