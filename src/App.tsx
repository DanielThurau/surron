import React, { useState } from 'react';
import ResourceViewer from './components/ResourceViewer';
import WebsiteLinks from './components/WebsiteLinks';
import './App.css';

type ViewType = 'resources' | 'links';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('resources');

  const handleNavigateToLinks = (): void => {
    setCurrentView('links');
  };

  const handleNavigateToResources = (): void => {
    setCurrentView('resources');
  };

  return (
    <div className="App">
      {/* Animated background grid */}
      <div className="cyber-grid"></div>

      {/* Main content */}
      <div className="main-content fade-in">
        {currentView === 'resources' ? (
          <ResourceViewer onNavigateToLinks={handleNavigateToLinks} />
        ) : (
          <WebsiteLinks onNavigateToResources={handleNavigateToResources} />
        )}
      </div>
    </div>
  );
};

export default App;
