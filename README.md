# Surron Light Bee - Interactive Maintenance Manual

A cyberpunk-themed, interactive maintenance manual for the Surron Light Bee electric bike. Built with React, Vite, and Fabric.js for dynamic image annotations and editable maintenance procedures.

## Features

### 🎨 Cyberpunk Aesthetic

- Dark theme with neon cyan, magenta, and green accents
- Animated grid background
- Glitch text effects
- Terminal-style interface components
- Neon glow effects and hover animations

### 🔧 Interactive Maintenance System

- **Editable Procedures**: Add, edit, and delete maintenance procedures
- **Interactive Image Annotations**: Upload images and add annotations with drawing tools
- **Progress Tracking**: Mark procedures as completed, in-progress, or pending
- **Difficulty Levels**: Easy, Intermediate, and Advanced categorization
- **Time Estimates**: Track estimated completion time for each procedure
- **Tool Lists**: Specify required tools for each procedure
- **Warnings & Safety**: Add safety warnings and notes

### 🖼️ Advanced Image Annotation Features

- **Fabric.js Integration**: Powerful canvas-based image editing
- **Drawing Tools**: Freehand drawing, shapes (rectangles, circles), and text annotations
- **Zoom Controls**: Zoom in/out for detailed work
- **Drag & Drop**: Easy image upload via drag and drop
- **Annotation Tracking**: Real-time tracking of all annotations with coordinates
- **Save/Load**: Persistent storage of annotated images

### 💾 Data Management

- **Local Storage**: Automatic saving of all data
- **Export/Import**: JSON-based backup and restore functionality
- **Real-time Stats**: Track completion progress across all sections

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
git clone <your-repo>
cd surron
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage Guide

### Adding New Sections

1. Click "New Section" in the header
2. Edit the section title and choose an icon
3. Add procedures to the section

### Creating Maintenance Procedures

1. Click "Add Procedure" in any section
2. Fill in the procedure details:
   - Title and description
   - Difficulty level (Easy/Intermediate/Advanced)
   - Estimated time
   - Step-by-step instructions
   - Required tools
   - Safety warnings

### Interactive Image Annotations

1. In the procedure editor, use the image annotator
2. Upload an image via drag & drop or click
3. Use the toolbar to:
   - **Select**: Move and resize annotations
   - **Draw**: Freehand drawing with mouse/touch
   - **Rectangle**: Add rectangular highlights
   - **Circle**: Add circular highlights
   - **Text**: Add text annotations
4. Use action buttons to:
   - Zoom in/out for precision
   - Delete selected annotations
   - Clear all annotations
   - Save the annotated image

### Data Management

- **Auto-save**: All changes are automatically saved to local storage
- **Export**: Download your manual as a JSON file
- **Import**: Upload a previously exported JSON file
- **Backup**: Regular exports recommended for data safety

## Recommended Libraries for Enhancement

### For Advanced Image Interactions

```bash
# Alternative to Fabric.js - Great for complex 2D graphics
npm install konva react-konva

# For deep zoom images (like technical diagrams)
npm install openseadragon

# React-specific image annotation
npm install react-image-annotate

# For image editing features
npm install react-image-crop
```

### For Enhanced UI Components

```bash
# Advanced drag-and-drop
npm install @dnd-kit/core @dnd-kit/sortable

# Rich text editor for descriptions
npm install @tiptap/react @tiptap/starter-kit

# Advanced form components
npm install react-hook-form

# Toast notifications
npm install react-hot-toast

# Modal dialogs
npm install react-modal
```

### For 3D Models and AR

```bash
# 3D model viewer for bike parts
npm install @react-three/fiber @react-three/drei three

# AR features for maintenance guidance
npm install @ar-js-org/ar.js

# QR code generation for part identification
npm install qrcode.js
```

### For Advanced Features

```bash
# PDF generation for manual export
npm install jspdf html2canvas

# Barcode/QR scanning
npm install quagga

# Voice commands
npm install react-speech-recognition

# Offline support
npm install workbox-webpack-plugin
```

## Example Enhancements

### 1. 3D Interactive Models

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function BikeModel() {
  const { scene } = useGLTF('/models/surron-lightbee.glb');
  return <primitive object={scene} />;
}

function InteractiveBikeViewer() {
  return (
    <Canvas>
      <OrbitControls />
      <BikeModel />
    </Canvas>
  );
}
```

### 2. Konva.js Alternative Implementation

```jsx
import { Stage, Layer, Image, Circle, Text } from 'react-konva';

function KonvaAnnotator() {
  return (
    <Stage width={800} height={600}>
      <Layer>
        <Image image={imageElement} />
        <Circle x={100} y={100} radius={50} stroke="cyan" />
        <Text text="Brake caliper" x={50} y={50} fill="cyan" />
      </Layer>
    </Stage>
  );
}
```

### 3. AR Integration Example

```jsx
import { ARCanvas } from '@ar-js-org/ar.js';

function ARMaintenanceGuide() {
  return (
    <ARCanvas onARReady={() => console.log('AR Ready')} markerUrl="/markers/surron-marker.patt">
      <div className="ar-overlay">
        <p>Point camera at bike part for instructions</p>
      </div>
    </ARCanvas>
  );
}
```

## File Structure

```
src/
├── components/
│   ├── InteractiveImageAnnotator.jsx  # Main annotation component
│   └── MaintenanceManual.jsx         # Main manual interface
├── App.jsx                           # Root component
├── App.css                          # Cyberpunk styling
├── index.css                        # Base styles
└── main.jsx                         # Entry point
```

## Customization

### Color Scheme

Edit the CSS variables in `App.css`:

```css
:root {
  --cyber-bg: #0a0a0a; /* Background */
  --cyber-primary: #00ffff; /* Cyan accent */
  --cyber-secondary: #ff00ff; /* Magenta accent */
  --cyber-accent: #00ff00; /* Green accent */
  --cyber-warning: #ffff00; /* Yellow warning */
  --cyber-danger: #ff0040; /* Red danger */
}
```

### Adding New Icons

The app uses Lucide React icons. Add new icons:

```jsx
import { Wrench, Zap, Settings, AlertTriangle } from 'lucide-react';
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Image Upload Issues

- Ensure images are in supported formats: JPG, PNG, GIF, WebP
- Check file size limits (browser dependent)
- Verify CORS settings if loading external images

### Canvas Performance

- Large images may slow down annotation
- Consider image compression for better performance
- Use zoom controls for detailed work

### Local Storage Limits

- Browser storage ~5-10MB typical limit
- Export data regularly as backup
- Consider IndexedDB for larger datasets

## Future Enhancements

- [ ] Multi-user collaboration
- [ ] Cloud sync capabilities
- [ ] Video annotation support
- [ ] QR code integration for parts
- [ ] Mobile app companion
- [ ] Voice-guided instructions
- [ ] Augmented reality overlays
- [ ] Integration with parts ordering systems

## License

MIT License - feel free to customize for your needs!

## Support

For issues and feature requests, please create an issue in the repository.

---

**Built with ❤️ for the Surron community**
