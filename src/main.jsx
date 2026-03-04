import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { NavigationProvider } from './context/NavigationContext';
import { StarSystemProvider } from './context/StarSystemContext';
import { AIProvider } from './context/AIContext';
import { TutorialProvider } from './context/TutorialContext';
import { GameModeProvider } from './context/GameModeContext';
import RocketLoader from './components/Loader/RocketLoader';
import App from './App.jsx';
import './index.css';

// Error boundary to catch and display errors instead of white screen
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portfolio Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0a0a0f',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ff6b6b', marginBottom: '16px' }}>Something went wrong</h1>
          <p style={{ color: '#aaa', marginBottom: '24px' }}>The portfolio encountered an error.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <RocketLoader>
        <NavigationProvider>
          <StarSystemProvider>
            <AIProvider>
              <TutorialProvider>
                <GameModeProvider>
                  <App />
                </GameModeProvider>
              </TutorialProvider>
            </AIProvider>
          </StarSystemProvider>
        </NavigationProvider>
      </RocketLoader>
    </ErrorBoundary>
  </StrictMode>
);
