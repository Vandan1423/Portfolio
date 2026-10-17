import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { NavigationProvider } from './context/NavigationContext';
import { StarSystemProvider } from './context/StarSystemContext';
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
          padding: '20px',
          textAlign: 'center',
          background: 'var(--bg)',
          color: 'var(--text)',
          fontFamily: 'var(--font-sans)',
        }}>
          <h1 style={{ fontSize: 'var(--fs-h3)', fontWeight: 600, marginBottom: '8px' }}>Something went wrong</h1>
          <p style={{ color: 'var(--text-2)', marginBottom: '24px' }}>The page hit an error. Reloading usually fixes it.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 20px',
              font: 'inherit',
              fontWeight: 500,
              color: 'var(--on-button)',
              background: 'var(--button)',
              border: 'none',
              borderRadius: 'var(--r-1)',
              cursor: 'pointer',
            }}
          >
            Reload
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
            <TutorialProvider>
              <GameModeProvider>
                <App />
              </GameModeProvider>
            </TutorialProvider>
          </StarSystemProvider>
        </NavigationProvider>
      </RocketLoader>
    </ErrorBoundary>
  </StrictMode>
);
