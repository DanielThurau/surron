import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Circle, Text, Arrow, Rect } from 'react-konva';
import { useDropzone } from 'react-dropzone';
import { MousePointer, Circle as CircleIcon, Type, ArrowRight, Square } from 'lucide-react';

/**
 * Alternative image annotator using Konva.js
 * This is an example of how you could implement a different annotation system
 *
 * To use this component:
 * 1. npm install konva react-konva
 * 2. Import this component instead of InteractiveImageAnnotator
 * 3. Customize as needed
 */
const KonvaAnnotatorExample = ({ onSave }) => {
  const stageRef = useRef();
  const [image, setImage] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [selectedTool, setSelectedTool] = useState('select');

  const handleImageUpload = acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new window.Image();
        img.onload = () => {
          setImage(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleImageUpload,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleStageClick = e => {
    if (selectedTool === 'select') return;

    const pos = e.target.getStage().getPointerPosition();
    const newAnnotation = {
      id: Date.now(),
      x: pos.x,
      y: pos.y,
      tool: selectedTool,
    };

    switch (selectedTool) {
      case 'circle':
        newAnnotation.radius = 30;
        newAnnotation.fill = 'rgba(0, 255, 255, 0.3)';
        newAnnotation.stroke = '#00ffff';
        break;
      case 'text':
        newAnnotation.text = 'Click to edit';
        newAnnotation.fontSize = 16;
        newAnnotation.fill = '#00ffff';
        break;
      case 'arrow':
        newAnnotation.points = [pos.x, pos.y, pos.x + 50, pos.y + 50];
        newAnnotation.fill = '#00ffff';
        newAnnotation.stroke = '#00ffff';
        break;
      case 'rectangle':
        newAnnotation.width = 100;
        newAnnotation.height = 60;
        newAnnotation.fill = 'rgba(0, 255, 255, 0.3)';
        newAnnotation.stroke = '#00ffff';
        break;
    }

    setAnnotations([...annotations, newAnnotation]);
  };

  const updateAnnotation = (id, updates) => {
    setAnnotations(annotations.map(ann => (ann.id === id ? { ...ann, ...updates } : ann)));
  };

  const deleteAnnotation = id => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
  };

  const saveAnnotations = () => {
    if (onSave) {
      const stage = stageRef.current;
      const dataURL = stage.toDataURL();
      onSave({
        image: dataURL,
        annotations: annotations,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'circle', icon: CircleIcon, label: 'Circle' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
  ];

  return (
    <div className="konva-annotator">
      <div className="annotator-header">
        <h3 className="neon-text">Konva.js Annotator Example</h3>
        <div className="toolbar">
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`cyber-button ${selectedTool === tool.id ? 'secondary' : ''}`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <tool.icon size={16} />
              {tool.label}
            </button>
          ))}
          <button className="cyber-button" onClick={saveAnnotations}>
            Save
          </button>
        </div>
      </div>

      <div className="canvas-area">
        {!image ? (
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <p>Drop an image here to start annotating with Konva.js</p>
            </div>
          </div>
        ) : (
          <Stage
            ref={stageRef}
            width={800}
            height={600}
            onClick={selectedTool !== 'select' ? handleStageClick : undefined}
          >
            <Layer>
              {/* Background Image */}
              <Image image={image} width={800} height={600} draggable={false} />

              {/* Annotations */}
              {annotations.map(annotation => {
                switch (annotation.tool) {
                  case 'circle':
                    return (
                      <Circle
                        key={annotation.id}
                        x={annotation.x}
                        y={annotation.y}
                        radius={annotation.radius}
                        fill={annotation.fill}
                        stroke={annotation.stroke}
                        strokeWidth={2}
                        draggable={selectedTool === 'select'}
                        onDragEnd={e => {
                          updateAnnotation(annotation.id, {
                            x: e.target.x(),
                            y: e.target.y(),
                          });
                        }}
                        onDblClick={() => deleteAnnotation(annotation.id)}
                      />
                    );
                  case 'rectangle':
                    return (
                      <Rect
                        key={annotation.id}
                        x={annotation.x}
                        y={annotation.y}
                        width={annotation.width}
                        height={annotation.height}
                        fill={annotation.fill}
                        stroke={annotation.stroke}
                        strokeWidth={2}
                        draggable={selectedTool === 'select'}
                        onDragEnd={e => {
                          updateAnnotation(annotation.id, {
                            x: e.target.x(),
                            y: e.target.y(),
                          });
                        }}
                        onDblClick={() => deleteAnnotation(annotation.id)}
                      />
                    );
                  case 'text':
                    return (
                      <Text
                        key={annotation.id}
                        x={annotation.x}
                        y={annotation.y}
                        text={annotation.text}
                        fontSize={annotation.fontSize}
                        fill={annotation.fill}
                        draggable={selectedTool === 'select'}
                        onDragEnd={e => {
                          updateAnnotation(annotation.id, {
                            x: e.target.x(),
                            y: e.target.y(),
                          });
                        }}
                        onDblClick={() => {
                          const newText = prompt('Edit text:', annotation.text);
                          if (newText !== null) {
                            updateAnnotation(annotation.id, { text: newText });
                          }
                        }}
                      />
                    );
                  case 'arrow':
                    return (
                      <Arrow
                        key={annotation.id}
                        points={annotation.points}
                        fill={annotation.fill}
                        stroke={annotation.stroke}
                        strokeWidth={3}
                        draggable={selectedTool === 'select'}
                        onDragEnd={e => {
                          const dx = e.target.x();
                          const dy = e.target.y();
                          updateAnnotation(annotation.id, {
                            points: annotation.points.map((point, i) =>
                              i % 2 === 0 ? point + dx : point + dy
                            ),
                          });
                          e.target.position({ x: 0, y: 0 });
                        }}
                        onDblClick={() => deleteAnnotation(annotation.id)}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </Layer>
          </Stage>
        )}
      </div>

      <div className="annotations-list">
        <h4>Annotations ({annotations.length})</h4>
        {annotations.map(annotation => (
          <div key={annotation.id} className="annotation-item">
            <span>{annotation.tool}</span>
            <span>
              @({Math.round(annotation.x)}, {Math.round(annotation.y)})
            </span>
            <button
              className="cyber-button secondary"
              onClick={() => deleteAnnotation(annotation.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .konva-annotator {
          padding: 20px;
          border: 2px solid var(--cyber-border);
          border-radius: 8px;
          margin: 20px 0;
        }

        .annotator-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .toolbar {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .toolbar .cyber-button {
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .canvas-area {
          position: relative;
          border: 2px solid var(--cyber-border);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .dropzone {
          width: 800px;
          height: 600px;
          border: 2px dashed var(--cyber-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dropzone.active {
          border-color: var(--cyber-primary);
          background: rgba(0, 255, 255, 0.1);
        }

        .dropzone-content {
          text-align: center;
          color: var(--cyber-text-dim);
        }

        .annotations-list {
          padding: 15px;
          background: var(--cyber-bg-secondary);
          border-radius: 8px;
        }

        .annotations-list h4 {
          margin-bottom: 15px;
          color: var(--cyber-primary);
        }

        .annotation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid var(--cyber-border);
        }
      `}</style>
    </div>
  );
};

export default KonvaAnnotatorExample;
