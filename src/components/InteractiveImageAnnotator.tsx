import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';
import { useDropzone } from 'react-dropzone';
import {
  MousePointer,
  Square,
  Circle,
  Type,
  Pencil,
  Eraser,
  Save,
  Upload,
  Trash2,
  ZoomIn,
  ZoomOut,
  LucideIcon,
} from 'lucide-react';

// Type definitions
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

interface CanvasData {
  backgroundImage: string | null;
  objects: Record<string, unknown>; // fabric.js JSON object
  annotations: AnnotationData[];
  timestamp: string;
}

interface InteractiveImageAnnotatorProps {
  onSave?: (data: CanvasData) => void;
  initialData?: CanvasData | null;
}

interface Tool {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface Action {
  id: string;
  icon: LucideIcon;
  label: string;
  action: () => void;
}

type ToolType = 'select' | 'pencil' | 'rectangle' | 'circle' | 'text';

const InteractiveImageAnnotator: React.FC<InteractiveImageAnnotatorProps> = ({
  onSave,
  initialData = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType>('select');
  const [annotations, setAnnotations] = useState<AnnotationData[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const updateAnnotations = (fabricCanvas: fabric.Canvas): void => {
    const objects = fabricCanvas.getObjects();
    const annotationData: AnnotationData[] = objects.map(obj => ({
      type: obj.type || 'unknown',
      left: obj.left || 0,
      top: obj.top || 0,
      width: obj.width || 0,
      height: obj.height || 0,
      fill: obj.fill?.toString() || '',
      stroke: obj.stroke?.toString() || '',
      text: (obj as fabric.IText).text || '',
      angle: obj.angle || 0,
    }));
    setAnnotations(annotationData);
  };

  // Initialize Fabric.js canvas
  useEffect(() => {
    const loadCanvasData = (fabricCanvas: fabric.Canvas, data: CanvasData): void => {
      if (data.backgroundImage) {
        fabric.Image.fromURL(data.backgroundImage).then((img: fabric.Image) => {
          fabricCanvas.backgroundImage = img;
          fabricCanvas.renderAll();
        });
      }

      if (data.objects) {
        fabricCanvas.loadFromJSON(data.objects, () => {
          fabricCanvas.renderAll();
          updateAnnotations(fabricCanvas);
        });
      }
    };
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#1a1a1a',
        selection: selectedTool === 'select',
      });

      // Set up canvas events
      fabricCanvas.on('path:created', (e: unknown) => {
        const event = e as { path?: fabric.Path };
        if (selectedTool === 'pencil' && event.path) {
          event.path.set({
            stroke: '#00ffff',
            strokeWidth: 3,
            fill: '',
          });
        }
      });

      fabricCanvas.on('object:added', () => {
        updateAnnotations(fabricCanvas);
      });

      fabricCanvas.on('object:removed', () => {
        updateAnnotations(fabricCanvas);
      });

      fabricCanvas.on('object:modified', () => {
        updateAnnotations(fabricCanvas);
      });

      setCanvas(fabricCanvas);

      // Load initial data if provided
      if (initialData) {
        loadCanvasData(fabricCanvas, initialData);
      }

      return () => {
        fabricCanvas.dispose();
      };
    }
    return () => {}; // Return empty cleanup function for all paths
  }, [initialData, selectedTool, canvas, onSave, annotations]);

  // Update canvas settings when tool changes
  useEffect(() => {
    if (canvas) {
      canvas.isDrawingMode = selectedTool === 'pencil';
      canvas.selection = selectedTool === 'select';

      if (selectedTool === 'pencil' && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = 3;
        canvas.freeDrawingBrush.color = '#00ffff';
      }
    }
  }, [selectedTool, canvas]);

  const handleImageUpload = (acceptedFiles: File[]): void => {
    const file = acceptedFiles[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        if (result) {
          fabric.Image.fromURL(result).then((img: fabric.Image) => {
            const scale = Math.min(
              canvas.width! / (img.width || 1),
              canvas.height! / (img.height || 1)
            );

            img.set({
              scaleX: scale,
              scaleY: scale,
              left: (canvas.width! - (img.width || 0) * scale) / 2,
              top: (canvas.height! - (img.height || 0) * scale) / 2,
            });

            canvas.backgroundImage = img;
            canvas.renderAll();
            setCurrentImage(result);
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleImageUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: false,
  });

  const addShape = (shapeType: string): void => {
    if (!canvas) return;

    let shape: fabric.Object;
    const commonProps = {
      left: 100,
      top: 100,
      fill: 'rgba(0, 255, 255, 0.3)',
      stroke: '#00ffff',
      strokeWidth: 2,
    };

    switch (shapeType) {
      case 'rectangle':
        shape = new fabric.Rect({
          width: 100,
          height: 80,
          ...commonProps,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          radius: 50,
          ...commonProps,
        });
        break;
      case 'text':
        shape = new fabric.IText('Click to edit', {
          left: 100,
          top: 100,
          fontFamily: 'Courier Prime',
          fontSize: 18,
          fill: '#00ffff',
          stroke: '#00ffff',
          strokeWidth: 1,
        });
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  const clearCanvas = (): void => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = '#1a1a1a';
      setAnnotations([]);
      setCurrentImage(null);
    }
  };

  const saveAnnotations = (): void => {
    if (canvas && onSave) {
      const canvasData: CanvasData = {
        backgroundImage: currentImage,
        objects: canvas.toJSON(),
        annotations: annotations,
        timestamp: new Date().toISOString(),
      };
      onSave(canvasData);
    }
  };

  const zoomIn = (): void => {
    if (canvas) {
      const zoom = canvas.getZoom();
      canvas.setZoom(Math.min(zoom * 1.1, 3));
    }
  };

  const zoomOut = (): void => {
    if (canvas) {
      const zoom = canvas.getZoom();
      canvas.setZoom(Math.max(zoom * 0.9, 0.1));
    }
  };

  const deleteSelected = (): void => {
    if (canvas) {
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length) {
        activeObjects.forEach(obj => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
  };

  const handleToolClick = (tool: Tool): void => {
    if (tool.id === 'rectangle' || tool.id === 'circle' || tool.id === 'text') {
      addShape(tool.id);
    } else {
      setSelectedTool(tool.id as ToolType);
    }
  };

  const tools: Tool[] = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'pencil', icon: Pencil, label: 'Draw' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  const actions: Action[] = [
    { id: 'zoomIn', icon: ZoomIn, label: 'Zoom In', action: zoomIn },
    { id: 'zoomOut', icon: ZoomOut, label: 'Zoom Out', action: zoomOut },
    { id: 'delete', icon: Trash2, label: 'Delete', action: deleteSelected },
    { id: 'clear', icon: Eraser, label: 'Clear All', action: clearCanvas },
    { id: 'save', icon: Save, label: 'Save', action: saveAnnotations },
  ];

  return (
    <div className="interactive-annotator">
      <div className="annotator-header">
        <h3 className="annotator-title neon-text">Interactive Image Annotator</h3>
        <div className="status-indicator online"></div>
        <span>Ready</span>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="tool-group">
          <h4>Tools</h4>
          <div className="tool-buttons">
            {tools.map(tool => (
              <button
                key={tool.id}
                className={`cyber-button ${selectedTool === tool.id ? 'secondary' : ''}`}
                onClick={() => handleToolClick(tool)}
                title={tool.label}
              >
                <tool.icon size={16} />
              </button>
            ))}
          </div>
        </div>

        <div className="tool-group">
          <h4>Actions</h4>
          <div className="tool-buttons">
            {actions.map(action => (
              <button
                key={action.id}
                className="cyber-button"
                onClick={action.action}
                title={action.label}
              >
                <action.icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="canvas-area">
        {!currentImage && (
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <Upload size={48} className="neon-text" />
              <p>Drag & drop an image here, or click to select</p>
              <p className="dropzone-hint">Supports JPG, PNG, GIF, WebP</p>
            </div>
          </div>
        )}

        <div className="canvas-container">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Annotations Info */}
      {annotations.length > 0 && (
        <div className="annotations-info terminal">
          <div className="terminal-content">
            <h4>Annotations ({annotations.length})</h4>
            <div className="annotation-list">
              {annotations.map((annotation, index) => (
                <div key={index} className="annotation-item">
                  <span className="annotation-type">{annotation.type}</span>
                  <span className="annotation-position">
                    @({Math.round(annotation.left)}, {Math.round(annotation.top)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveImageAnnotator;
