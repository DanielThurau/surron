import React, { useState, useEffect } from 'react';
import InteractiveImageAnnotator from './InteractiveImageAnnotator';

// Import CanvasData type (you'll need to export it from InteractiveImageAnnotator)
interface CanvasData {
  backgroundImage: string | null;
  objects: Record<string, unknown>;
  annotations: AnnotationData[];
  timestamp: string;
}

interface AnnotationData {
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  text?: string;
  angle: number;
}

import {
  Plus,
  Edit3,
  Trash2,
  Save,
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
  warnings: string[];
  images: string[];
  annotations: AnnotationData[];
}

interface MaintenanceSection {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  procedures: MaintenanceProcedure[];
}

const MaintenanceManual: React.FC = () => {
  const [sections, setSections] = useState<MaintenanceSection[]>([]);
  const [editingProcedure, setEditingProcedure] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('surron-maintenance-manual');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSections(parsedData.sections || []);
      } catch (_error) {
        console.error('Error loading saved data:', _error);
        initializeDefaultSections();
      }
    } else {
      initializeDefaultSections();
    }
  }, []);

  // Save data to localStorage whenever sections change
  useEffect(() => {
    const dataToSave = {
      sections,
      lastModified: new Date().toISOString(),
      version: '1.0.0',
    };
    localStorage.setItem('surron-maintenance-manual', JSON.stringify(dataToSave));
  }, [sections]);

  const initializeDefaultSections = () => {
    const defaultSections = [
      {
        id: 'battery',
        title: 'Battery System',
        icon: Zap,
        color: 'var(--cyber-warning)',
        procedures: [
          {
            id: 'battery-check',
            title: 'Battery Health Check',
            description: 'Regular battery voltage and capacity inspection',
            difficulty: 'Easy' as const,
            estimatedTime: '15 minutes',
            status: 'pending' as const,
            steps: [
              'Turn off the bike and remove the key',
              'Locate the battery voltage display',
              'Check voltage reading (should be 58.8V when fully charged)',
              'Inspect battery connections for corrosion',
              'Test battery under load',
            ],
            tools: ['Multimeter', 'Cleaning brush', 'Battery tester'],
            warnings: ['Never short-circuit battery terminals', 'Wear safety glasses'],
            images: [],
            annotations: [],
          },
        ],
      },
      {
        id: 'motor',
        title: 'Motor & Drive System',
        icon: Settings,
        color: 'var(--cyber-primary)',
        procedures: [
          {
            id: 'motor-check',
            title: 'Motor Inspection',
            description: 'Check motor mounting and electrical connections',
            difficulty: 'Intermediate' as const,
            estimatedTime: '30 minutes',
            status: 'pending' as const,
            steps: [
              'Ensure bike is off and key removed',
              'Inspect motor mounting bolts',
              'Check motor cable connections',
              'Listen for unusual sounds when spinning wheel',
              'Check motor temperature after riding',
            ],
            tools: ['Socket wrench set', 'Torque wrench'],
            warnings: ['Motor can be hot after use', 'Check mounting torque specs'],
            images: [],
            annotations: [],
          },
        ],
      },
      {
        id: 'suspension',
        title: 'Suspension & Brakes',
        icon: Wrench,
        color: 'var(--cyber-secondary)',
        procedures: [
          {
            id: 'brake-check',
            title: 'Brake System Check',
            description: 'Inspect brake pads, discs, and hydraulic lines',
            difficulty: 'Intermediate' as const,
            estimatedTime: '20 minutes',
            status: 'pending' as const,
            steps: [
              'Check brake pad thickness',
              'Inspect brake discs for wear and warping',
              'Test brake lever feel and travel',
              'Check brake fluid level',
              'Inspect brake lines for leaks',
            ],
            tools: ['Hex keys', 'Brake fluid', 'Cleaning supplies'],
            warnings: ['Use only DOT 4 brake fluid', 'Brake fluid is toxic'],
            images: [],
            annotations: [],
          },
        ],
      },
    ];
    setSections(defaultSections);
  };

  const addNewSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      icon: BookOpen,
      color: 'var(--cyber-accent)',
      procedures: [],
    };
    setSections([...sections, newSection]);
  };

  const addNewProcedure = (sectionId: string): void => {
    const newProcedure = {
      id: `procedure-${Date.now()}`,
      title: 'New Procedure',
      description: 'Add description here...',
      difficulty: 'Easy' as const,
      estimatedTime: '15 minutes',
      status: 'pending' as const,
      steps: ['Step 1'],
      tools: [],
      warnings: [],
      images: [],
      annotations: [],
    };

    setSections(
      sections.map(section =>
        section.id === sectionId
          ? { ...section, procedures: [...section.procedures, newProcedure] }
          : section
      )
    );
    setEditingProcedure(newProcedure.id);
  };

  const updateProcedure = (
    sectionId: string,
    procedureId: string,
    updates: Partial<MaintenanceProcedure>
  ): void => {
    setSections(
      sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              procedures: section.procedures.map(proc =>
                proc.id === procedureId ? { ...proc, ...updates } : proc
              ),
            }
          : section
      )
    );
  };

  const deleteProcedure = (sectionId: string, procedureId: string): void => {
    setSections(
      sections.map(section =>
        section.id === sectionId
          ? { ...section, procedures: section.procedures.filter(proc => proc.id !== procedureId) }
          : section
      )
    );
  };

  const exportData = () => {
    const dataToExport = {
      sections,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `surron-maintenance-manual-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (importedData.sections) {
            setSections(importedData.sections);
          }
        } catch {
          alert('Error importing file: Invalid format');
        }
      };
      reader.readAsText(file);
    }
  };

  const getDifficultyColor = (difficulty: 'Easy' | 'Intermediate' | 'Advanced') => {
    switch (difficulty) {
      case 'Easy':
        return 'var(--cyber-accent)';
      case 'Intermediate':
        return 'var(--cyber-warning)';
      case 'Advanced':
        return 'var(--cyber-danger)';
      default:
        return 'var(--cyber-text-dim)';
    }
  };

  const getStatusColor = (status: 'pending' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'var(--cyber-accent)';
      case 'in-progress':
        return 'var(--cyber-warning)';
      case 'pending':
        return 'var(--cyber-text-dim)';
      default:
        return 'var(--cyber-text-dim)';
    }
  };

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
              <span className="stat-value">
                {sections.reduce((total, section) => total + section.procedures.length, 0)}
              </span>
              <span className="stat-label">Procedures</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {sections.reduce(
                  (total, section) =>
                    total + section.procedures.filter(p => p.status === 'completed').length,
                  0
                )}
              </span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className="cyber-button" onClick={addNewSection}>
            <Plus size={16} /> New Section
          </button>
          <button className="cyber-button secondary" onClick={exportData}>
            <Download size={16} /> Export
          </button>
          <label className="cyber-button secondary">
            <Upload size={16} /> Import
            <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
          </label>
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

                    <div className="procedure-actions">
                      <button
                        className="cyber-button"
                        onClick={() => setEditingProcedure(procedure.id)}
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        className="cyber-button secondary"
                        onClick={() => deleteProcedure(section.id, procedure.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                      <button
                        className="cyber-button"
                        onClick={() =>
                          updateProcedure(section.id, procedure.id, {
                            status: procedure.status === 'completed' ? 'pending' : 'completed',
                          })
                        }
                      >
                        <CheckCircle size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  className="add-procedure-btn cyber-button"
                  onClick={() => addNewProcedure(section.id)}
                >
                  <Plus size={16} /> Add Procedure
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Procedure Editor Modal */}
        {editingProcedure && (
          <ProcedureEditor
            procedure={
              sections
                .flatMap(s => s.procedures)
                .find(p => p.id === editingProcedure) as MaintenanceProcedure
            }
            onSave={updates => {
              const sectionId = sections.find(s =>
                s.procedures.some(p => p.id === editingProcedure)
              )?.id;
              if (sectionId) {
                updateProcedure(sectionId, editingProcedure, updates);
              }
              setEditingProcedure(null);
            }}
            onCancel={() => setEditingProcedure(null)}
          />
        )}
      </div>
    </div>
  );
};

// Procedure Editor Component
const ProcedureEditor = ({
  procedure,
  onSave,
  onCancel,
}: {
  procedure: MaintenanceProcedure;
  onSave: (updates: Partial<MaintenanceProcedure>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(procedure || {});

  const handleSave = () => {
    onSave(formData);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...(formData.steps || [])];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...(formData.steps || []), 'New step'],
    });
  };

  const removeStep = (index: number) => {
    const newSteps = (formData.steps || []).filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  return (
    <div className="procedure-editor-overlay">
      <div className="procedure-editor terminal">
        <div className="terminal-content">
          <h3>Edit Procedure</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Title</label>
              <input
                className="cyber-input"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="cyber-input"
                rows={3}
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Difficulty</label>
                <select
                  className="cyber-input"
                  value={formData.difficulty || 'Easy'}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as 'Easy' | 'Intermediate' | 'Advanced',
                    })
                  }
                >
                  <option value="Easy">Easy</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Time</label>
                <input
                  className="cyber-input"
                  value={formData.estimatedTime || ''}
                  onChange={e => setFormData({ ...formData, estimatedTime: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Steps</label>
              {(formData.steps || []).map((step, index) => (
                <div key={index} className="step-input">
                  <input
                    className="cyber-input"
                    value={step}
                    onChange={e => updateStep(index, e.target.value)}
                  />
                  <button className="cyber-button secondary" onClick={() => removeStep(index)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button className="cyber-button" onClick={addStep}>
                <Plus size={12} /> Add Step
              </button>
            </div>
          </div>

          {/* Interactive Image Annotator */}
          <InteractiveImageAnnotator
            onSave={imageData => {
              setFormData({
                ...formData,
                images: [...(formData.images || []), imageData as unknown as string],
              });
            }}
            initialData={formData.images[0] as unknown as CanvasData | null}
          />

          <div className="editor-actions">
            <button className="cyber-button" onClick={handleSave}>
              <Save size={16} /> Save
            </button>
            <button className="cyber-button secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManual;
