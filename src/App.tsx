import React, { useState } from 'react';
import SimpleMaintenanceManual from './components/SimpleMaintenanceManual';
import ResourceViewer from './components/ResourceViewer';
import './App.css';

type ViewType = 'manual' | 'resources';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('manual');

  const handleNavigateToResources = (): void => {
    setCurrentView('resources');
  };

  const handleNavigateHome = (): void => {
    setCurrentView('manual');
  };

  return (
    <div className="App">
      {/* Animated background grid */}
      <div className="cyber-grid"></div>

      {/* Main content */}
      <div className="main-content fade-in">
        {currentView === 'manual' ? (
          <SimpleMaintenanceManual onNavigateToResources={handleNavigateToResources} />
        ) : (
          <ResourceViewer onNavigateHome={handleNavigateHome} />
        )}
      </div>
    </div>
  );
};

export default App;
