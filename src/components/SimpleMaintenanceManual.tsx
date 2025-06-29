import React, { useState, useEffect } from 'react';
import {
  Plus,
  Download,
  Upload,
  Settings,
  Wrench,
  Zap,
  CheckCircle,
  Clock,
  BookOpen,
  LucideIcon,
} from 'lucide-react';

// Type definitions
interface MaintenanceProcedure {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  status: 'pending' | 'in-progress' | 'completed';
  steps: string[];
  tools: string[];
  warnings?: string[];
}

interface MaintenanceSection {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  procedures: MaintenanceProcedure[];
}

interface SimpleMaintenanceManualProps {
  onNavigateToResources: () => void;
}

type DifficultyLevel = 'Easy' | 'Intermediate' | 'Advanced';
type ProcedureStatus = 'pending' | 'in-progress' | 'completed';

const SimpleMaintenanceManual: React.FC<SimpleMaintenanceManualProps> = ({
  onNavigateToResources,
}) => {
  const [sections, setSections] = useState<MaintenanceSection[]>([]);

  // Initialize with default sections
  useEffect(() => {
    const defaultSections: MaintenanceSection[] = [
      {
        id: 'battery',
        title: 'Battery System',
        icon: Zap,
        color: 'var(--industrial-warning)',
        procedures: [
          {
            id: 'battery-check',
            title: 'Battery Health Check',
            description: 'Regular battery voltage and capacity inspection',
            difficulty: 'Easy',
            estimatedTime: '15 minutes',
            status: 'pending',
            steps: [
              'Turn off the bike and remove the key',
              'Locate the battery voltage display',
              'Check voltage reading (should be 58.8V when fully charged)',
              'Inspect battery connections for corrosion',
              'Test battery under load',
            ],
            tools: ['Multimeter', 'Cleaning brush', 'Battery tester'],
            warnings: ['Never short-circuit battery terminals', 'Wear safety glasses'],
          },
        ],
      },
      {
        id: 'motor',
        title: 'Motor & Drive System',
        icon: Settings,
        color: 'var(--industrial-primary)',
        procedures: [
          {
            id: 'motor-check',
            title: 'Motor Inspection',
            description: 'Check motor mounting and electrical connections',
            difficulty: 'Intermediate',
            estimatedTime: '30 minutes',
            status: 'pending',
            steps: [
              'Ensure bike is off and key removed',
              'Inspect motor mounting bolts',
              'Check motor cable connections',
              'Listen for unusual sounds when spinning wheel',
              'Check motor temperature after riding',
            ],
            tools: ['Socket wrench set', 'Torque wrench'],
            warnings: ['Motor can be hot after use', 'Check mounting torque specs'],
          },
        ],
      },
      {
        id: 'suspension',
        title: 'Suspension & Brakes',
        icon: Wrench,
        color: 'var(--industrial-secondary)',
        procedures: [
          {
            id: 'brake-check',
            title: 'Brake System Check',
            description: 'Inspect brake pads, discs, and hydraulic lines',
            difficulty: 'Intermediate',
            estimatedTime: '20 minutes',
            status: 'pending',
            steps: [
              'Check brake pad thickness',
              'Inspect brake discs for wear and warping',
              'Test brake lever feel and travel',
              'Check brake fluid level',
              'Inspect brake lines for leaks',
            ],
            tools: ['Hex keys', 'Brake fluid', 'Cleaning supplies'],
            warnings: ['Use only DOT 4 brake fluid', 'Brake fluid is toxic'],
          },
        ],
      },
    ];
    setSections(defaultSections);
  }, []);

  const updateProcedureStatus = (
    sectionId: string,
    procedureId: string,
    newStatus: ProcedureStatus
  ): void => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              procedures: section.procedures.map(proc =>
                proc.id === procedureId ? { ...proc, status: newStatus } : proc
              ),
            }
          : section
      )
    );
  };

  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
      case 'Easy':
        return 'var(--industrial-success)';
      case 'Intermediate':
        return 'var(--industrial-warning)';
      case 'Advanced':
        return 'var(--industrial-danger)';
      default:
        return 'var(--industrial-text-muted)';
    }
  };

  const getStatusColor = (status: ProcedureStatus): string => {
    switch (status) {
      case 'completed':
        return 'var(--industrial-success)';
      case 'in-progress':
        return 'var(--industrial-warning)';
      case 'pending':
        return 'var(--industrial-text-muted)';
      default:
        return 'var(--industrial-text-muted)';
    }
  };

  const totalProcedures = sections.reduce((total, section) => total + section.procedures.length, 0);
  const completedProcedures = sections.reduce(
    (total, section) => total + section.procedures.filter(p => p.status === 'completed').length,
    0
  );

  return (
    <div className="maintenance-manual">
      <div className="manual-header">
        <div className="header-content">
          <h1 className="glitch neon-text" data-text="SURRON LIGHT BEE">
            SURRON LIGHT BEE
          </h1>
          <p className="manual-subtitle">INTERACTIVE MAINTENANCE MANUAL v2.0</p>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-value">{sections.length}</span>
              <span className="stat-label">Sections</span>
            </div>
            <div className="stat">
              <span className="stat-value">{totalProcedures}</span>
              <span className="stat-label">Procedures</span>
            </div>
            <div className="stat">
              <span className="stat-value">{completedProcedures}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className="cyber-button" onClick={onNavigateToResources}>
            <BookOpen size={16} /> View Resources
          </button>
          <button className="cyber-button">
            <Plus size={16} /> New Section
          </button>
          <button className="cyber-button secondary">
            <Download size={16} /> Export
          </button>
          <button className="cyber-button secondary">
            <Upload size={16} /> Import
          </button>
        </div>
      </div>

      <div className="manual-content">
        <div className="sections-grid">
          {sections.map(section => (
            <div key={section.id} className="section-card cyber-card">
              <div className="section-header">
                <section.icon size={24} style={{ color: section.color }} />
                <h3>{section.title}</h3>
                <div className="section-stats">
                  <span className="procedure-count">
                    {section.procedures.length} procedure
                    {section.procedures.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="procedures-list">
                {section.procedures.map(procedure => (
                  <div key={procedure.id} className="procedure-item">
                    <div className="procedure-header">
                      <h4>{procedure.title}</h4>
                      <div className="procedure-meta">
                        <span
                          className="difficulty-badge"
                          style={{ color: getDifficultyColor(procedure.difficulty) }}
                        >
                          {procedure.difficulty}
                        </span>
                        <span className="time-estimate">
                          <Clock size={12} /> {procedure.estimatedTime}
                        </span>
                        <div
                          className="status-indicator"
                          style={{ background: getStatusColor(procedure.status) }}
                        ></div>
                      </div>
                    </div>

                    <p className="procedure-description">{procedure.description}</p>

                    <div className="procedure-steps">
                      <h5>Steps:</h5>
                      <ol>
                        {procedure.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="procedure-tools">
                      <h5>Required Tools:</h5>
                      <ul>
                        {procedure.tools.map((tool, index) => (
                          <li key={index}>{tool}</li>
                        ))}
                      </ul>
                    </div>

                    {procedure.warnings && procedure.warnings.length > 0 && (
                      <div className="procedure-warnings">
                        <h5>⚠️ Warnings:</h5>
                        <ul>
                          {procedure.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="procedure-actions">
                      <button
                        className="cyber-button"
                        onClick={() =>
                          updateProcedureStatus(
                            section.id,
                            procedure.id,
                            procedure.status === 'completed' ? 'pending' : 'completed'
                          )
                        }
                      >
                        <CheckCircle size={12} />
                        {procedure.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleMaintenanceManual;
