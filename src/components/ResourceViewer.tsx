import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Home,
  Grid,
  FileText,
  Image as ImageIcon,
  Maximize,
  Minimize,
} from 'lucide-react';

// Type definitions
interface Resource {
  name: string;
  type: 'image' | 'pdf';
  path: string;
  title: string;
}

interface ResourceViewerProps {
  onNavigateToLinks: () => void;
}

type ViewMode = 'single' | 'grid';
type FilterType = 'all' | 'images' | 'pdfs';

const ResourceViewer: React.FC<ResourceViewerProps> = ({ onNavigateToLinks }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterType>('all');

  // Initialize resources
  useEffect(() => {
    const allResources: Resource[] = [
      // Images
      { name: 'img1.png', type: 'image', path: '/img1.png', title: 'Body Assembly 1' },
      { name: 'img5a.png', type: 'image', path: '/img5a.png', title: 'Body Assembly 2' },
      { name: 'img5b.png', type: 'image', path: '/img5b.png', title: 'Body Assembly 3' },
      { name: 'img6.png', type: 'image', path: '/img6.png', title: 'Body Assembly 4' },
      { name: 'img3.png', type: 'image', path: '/img3.png', title: 'Battery Information' },
      { name: 'img10.png', type: 'image', path: '/img10.png', title: 'Battery Lock Assembly' },
      { name: 'img4.png', type: 'image', path: '/img4.png', title: 'Motor Assembly' },
      { name: 'img9.png', type: 'image', path: '/img9.png', title: 'Seat Assembly' },
      { name: 'img17.png', type: 'image', path: '/img17.png', title: 'Front Wheel Assembly' },
      { name: 'img7.png', type: 'image', path: '/img7.png', title: 'Rear Wheel Assembly' },
      { name: 'img8.png', type: 'image', path: '/img8.png', title: 'Upper Electronics' },
      { name: 'img8b.png', type: 'image', path: '/img8b.png', title: 'Tail light Assembly' },
      {
        name: 'img11.png',
        type: 'image',
        path: '/img11.png',
        title: 'Rear Shock Absorber Assembly',
      },
      { name: 'img20.png', type: 'image', path: '/img20.png', title: 'Damping Adapter Assembly' },
      {
        name: 'img13.png',
        type: 'image',
        path: '/img13.png',
        title: 'Triple Clamp Assembly and Handlebars',
      },
      { name: 'img12.png', type: 'image', path: '/img12.png', title: 'Foot Peg Assembly' },
      { name: 'img14.png', type: 'image', path: '/img14.png', title: 'Brake Lines' },
      { name: 'img15.png', type: 'image', path: '/img15.png', title: 'Chain Drive' },
      { name: 'img16.png', type: 'image', path: '/img16.png', title: 'Air Switch Assembly' },
      { name: 'img19.png', type: 'image', path: '/img19.png', title: 'Manual Drive Assembly' },
      { name: 'img18.png', type: 'image', path: '/img18.png', title: 'Misc' },

      // PDFs
      {
        name: 'Surron-service-manual.pdf',
        type: 'pdf',
        path: '/Surron-service-manual.pdf',
        title: 'Surron Service Manual',
      },
      {
        name: 'LightBee-parts-2.pdf',
        type: 'pdf',
        path: '/LightBee-parts-2.pdf',
        title: 'Light Bee Parts Manual',
      },
      {
        name: 'FrontWheelAndTripleClampDissassemblyPartsTemplate.pdf',
        type: 'pdf',
        path: '/FrontWheelAndTripleClampDissassemblyPartsTemplate.pdf',
        title: 'Front Wheel and Triple Clamp Disassembly Parts Template',
      },
    ];

    setResources(allResources);
  }, []);

  const filteredResources = resources.filter(resource => {
    if (filter === 'all') return true;
    if (filter === 'images') return resource.type === 'image';
    if (filter === 'pdfs') return resource.type === 'pdf';
    return true;
  });

  const currentResource = filteredResources[currentIndex] || null;

  const navigateResource = useCallback(
    (direction: 'next' | 'prev'): void => {
      if (direction === 'next') {
        setCurrentIndex(prev => (prev + 1) % filteredResources.length);
      } else {
        setCurrentIndex(prev => (prev - 1 + filteredResources.length) % filteredResources.length);
      }
      setZoom(1);
      setRotation(0);
    },
    [filteredResources.length]
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'ArrowRight') navigateResource('next');
      if (e.key === 'ArrowLeft') navigateResource('prev');
      if (e.key === 'Escape') setIsFullscreen(false);
    },
    [navigateResource]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const downloadResource = (): void => {
    if (currentResource) {
      const link = document.createElement('a');
      link.href = currentResource.path;
      link.download = currentResource.name;
      link.click();
    }
  };

  const toggleFullscreen = (): void => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = (): void => {
    setZoom(Math.min(4, zoom + 0.25));
  };

  const handleZoomOut = (): void => {
    setZoom(Math.max(0.25, zoom - 0.25));
  };

  const handleRotate = (): void => {
    setRotation((rotation + 90) % 360);
  };

  const handleFilterChange = (newFilter: FilterType): void => {
    setFilter(newFilter);
    setCurrentIndex(0); // Reset to first item when filter changes
  };

  const handleViewModeToggle = (): void => {
    setViewMode(viewMode === 'grid' ? 'single' : 'grid');
  };

  const handleGridItemClick = (index: number): void => {
    setCurrentIndex(index);
    setViewMode('single');
  };

  const renderCurrentResource = (): React.ReactNode => {
    if (!currentResource) return null;

    if (currentResource.type === 'image') {
      return (
        <div className="resource-display">
          <img
            src={currentResource.path}
            alt={currentResource.title}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
            }}
          />
        </div>
      );
    } else if (currentResource.type === 'pdf') {
      return (
        <div className="resource-display pdf-display">
          <iframe
            src={currentResource.path}
            style={{
              width: '100%',
              height: '600px',
              border: 'none',
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
            title={currentResource.title}
          />
        </div>
      );
    }

    return null;
  };

  const renderGridView = (): React.ReactNode => {
    return (
      <div className="grid-view">
        {filteredResources.map((resource, index) => (
          <div
            key={resource.name}
            className={`grid-item ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleGridItemClick(index)}
          >
            {resource.type === 'image' ? (
              <img src={resource.path} alt={resource.title} />
            ) : (
              <div className="pdf-thumbnail">
                <FileText size={48} />
              </div>
            )}
            <div className="resource-title">{resource.title}</div>
          </div>
        ))}
      </div>
    );
  };

  const imageResources = resources.filter(r => r.type === 'image');
  const pdfResources = resources.filter(r => r.type === 'pdf');

  return (
    <div className={`resource-viewer ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Main Header */}
      <div className="viewer-main-header">
        <div className="main-header-content">
          <div className="header-title-section">
            <h1 className="glitch neon-text" data-text="RESOURCE VIEWER">
              RESOURCE VIEWER
            </h1>
            <p className="viewer-subtitle">SURRON LIGHT BEE TECHNICAL RESOURCES v2.0</p>
          </div>

          <div className="header-controls-section">
            <div className="filter-controls">
              <button
                className={`cyber-button ${filter === 'all' ? 'secondary' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All ({resources.length})
              </button>
              <button
                className={`cyber-button ${filter === 'images' ? 'secondary' : ''}`}
                onClick={() => handleFilterChange('images')}
              >
                <ImageIcon size={16} /> Images ({imageResources.length})
              </button>
              <button
                className={`cyber-button ${filter === 'pdfs' ? 'secondary' : ''}`}
                onClick={() => handleFilterChange('pdfs')}
              >
                <FileText size={16} /> PDFs ({pdfResources.length})
              </button>
              <button
                className={`cyber-button ${viewMode === 'grid' ? 'secondary' : ''}`}
                onClick={handleViewModeToggle}
              >
                <Grid size={16} /> {viewMode === 'grid' ? 'Single' : 'Grid'} View
              </button>
            </div>
          </div>
        </div>

        <div className="main-header-actions">
          <button className="cyber-button" onClick={onNavigateToLinks}>
            <Home size={16} /> Important Links
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="viewer-content">
        {viewMode === 'grid' ? (
          renderGridView()
        ) : (
          <div className="single-view">
            {/* Resource Display */}
            <div className="resource-container">
              {currentResource && (
                <div className="resource-info">
                  <h3>{currentResource.title}</h3>
                  <span className="resource-counter">
                    {currentIndex + 1} / {filteredResources.length}
                  </span>
                </div>
              )}

              {renderCurrentResource()}
            </div>

            {/* Navigation Controls */}
            <div className="navigation-controls">
              <button
                className="nav-button cyber-button"
                onClick={() => navigateResource('prev')}
                disabled={filteredResources.length <= 1}
              >
                <ChevronLeft size={24} />
              </button>

              <div className="control-panel">
                <div className="control-group">
                  <button className="cyber-button" onClick={handleZoomOut}>
                    <ZoomOut size={16} />
                  </button>
                  <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                  <button className="cyber-button" onClick={handleZoomIn}>
                    <ZoomIn size={16} />
                  </button>
                </div>

                <div className="control-group">
                  <button className="cyber-button" onClick={handleRotate}>
                    <RotateCw size={16} />
                  </button>
                  <button className="cyber-button" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                  </button>
                  <button className="cyber-button" onClick={downloadResource}>
                    <Download size={16} />
                  </button>
                </div>
              </div>

              <button
                className="nav-button cyber-button"
                onClick={() => navigateResource('next')}
                disabled={filteredResources.length <= 1}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceViewer;
