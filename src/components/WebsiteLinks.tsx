import React, { useState } from 'react';
import { ExternalLink, Globe, BookOpen, Wrench, Settings, Info } from 'lucide-react';

// Type definitions
interface WebsiteLink {
  id: string;
  title: string;
  url: string;
  description: string;
  notes?: string;
  category: 'manual' | 'parts' | 'service' | 'info' | 'other';
  icon?: React.ReactNode;
}

interface WebsiteLinksProps {
  onNavigateToResources: () => void;
}

const WebsiteLinks: React.FC<WebsiteLinksProps> = ({ onNavigateToResources }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Website links data
  const websiteLinks: WebsiteLink[] = [
    {
      id: '1',
      title: 'Surron Upgrade Schedule',
      url: 'https://youtu.be/ELQLZKsNSL4?si=n5974Us-Ip7kQtBB',
      description: 'Surron Light Bee Upgrade Schedule',
      notes: 'Really like a lot of the upgrades this guy suggests.',
      category: 'info',
      icon: <BookOpen size={24} />,
    },
    {
      id: '2',
      title: 'Full Surron Service',
      url: 'https://youtu.be/RjMLlF1GQnc?si=pLfUojhj8Y5SEqIQ',
      description: 'Full Surron Service Tutorial',
      notes: 'A great tutorial on a full bike breakdown with tools and fluids to use.',
      category: 'manual',
      icon: <Wrench size={24} />,
    },
    {
      id: '3',
      title: 'Surron Suspension Service',
      url: 'https://youtu.be/WDTqEVLGzK8?si=QrsJTzm4JtZa1ZG6',
      description: 'Surron Suspension Service',
      notes:
        'A great tutorial on how to service the front and rear suspension on the Surron Light Bee.',
      category: 'service',
      icon: <Settings size={24} />,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Links', count: websiteLinks.length },
    {
      id: 'manual',
      name: 'Manuals',
      count: websiteLinks.filter(l => l.category === 'manual').length,
    },
    {
      id: 'parts',
      name: 'Parts',
      count: websiteLinks.filter(l => l.category === 'parts').length,
    },
    {
      id: 'service',
      name: 'Service',
      count: websiteLinks.filter(l => l.category === 'service').length,
    },
    {
      id: 'info',
      name: 'Information',
      count: websiteLinks.filter(l => l.category === 'info').length,
    },
  ];

  const filteredLinks =
    selectedCategory === 'all'
      ? websiteLinks
      : websiteLinks.filter(link => link.category === selectedCategory);

  const handleLinkClick = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'manual':
        return <BookOpen size={16} />;
      case 'parts':
        return <Wrench size={16} />;
      case 'service':
        return <Settings size={16} />;
      case 'info':
        return <Info size={16} />;
      default:
        return <Globe size={16} />;
    }
  };

  return (
    <div className="website-links">
      {/* Main Header */}
      <div className="links-main-header">
        <div className="main-header-content">
          <div className="header-title-section">
            <h1 className="glitch neon-text" data-text="IMPORTANT LINKS">
              IMPORTANT LINKS
            </h1>
            <p className="viewer-subtitle">SURRON LIGHT BEE EXTERNAL RESOURCES</p>
          </div>

          <div className="header-controls-section">
            <div className="filter-controls">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`cyber-button ${selectedCategory === category.id ? 'secondary' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {getCategoryIcon(category.id)} {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="main-header-actions">
          <button className="cyber-button" onClick={onNavigateToResources}>
            <Globe size={16} /> View Resources
          </button>
        </div>
      </div>

      {/* Links Grid */}
      <div className="links-content">
        <div className="links-grid">
          {filteredLinks.map(link => (
            <div key={link.id} className="link-card">
              <div className="link-preview">
                <div className="link-icon">{link.icon}</div>
                <div className="link-overlay">
                  <button className="cyber-button" onClick={() => handleLinkClick(link.url)}>
                    <ExternalLink size={16} /> Visit Site
                  </button>
                </div>
              </div>

              <div className="link-content">
                <h3 className="link-title">{link.title}</h3>
                <p className="link-description">{link.description}</p>
                {link.notes && (
                  <div className="link-notes">
                    <strong>Notes:</strong> {link.notes}
                  </div>
                )}
                <div className="link-meta">
                  <span className="link-category">
                    {getCategoryIcon(link.category)} {link.category}
                  </span>
                  <span className="link-url">{link.url}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsiteLinks;
