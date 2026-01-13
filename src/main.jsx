import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NavigationProvider } from './context/NavigationContext';
import { StarSystemProvider } from './context/StarSystemContext';
import { AIProvider } from './context/AIContext';
import RocketLoader from './components/Loader/RocketLoader';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RocketLoader>
      <NavigationProvider>
        <StarSystemProvider>
          <AIProvider>
            <App />
          </AIProvider>
        </StarSystemProvider>
      </NavigationProvider>
    </RocketLoader>
  </StrictMode>
);
