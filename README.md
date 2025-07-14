# Surron Light Bee - Technical Resources Hub

A cyberpunk-themed, centralized resource viewer for the Surron Light Bee electric bike. Built with React and Vite, featuring an organized collection of technical diagrams, service manuals, and important external links.

## Features

### 🎨 Cyberpunk Aesthetic

- Dark theme with neon cyan, magenta, and green accents
- Animated grid background
- Glitch text effects
- Terminal-style interface components
- Neon glow effects and hover animations

### 📚 Resource Management

- **Technical Diagrams**: High-quality images of bike components and assemblies
- **Service Manuals**: PDF documents for detailed maintenance procedures
- **Filtering System**: Filter by images, PDFs, or view all resources
- **Grid & Single View**: Toggle between grid overview and detailed single view
- **Zoom & Rotation**: Interactive controls for detailed examination
- **Download Support**: Direct download of any resource

### 🔗 External Links Hub

- **Categorized Links**: Organized by manuals, parts, service, and information
- **Visual Previews**: Icon-based previews for each link category
- **Context Notes**: Add personal notes and context for each link
- **Direct Access**: One-click navigation to external resources
- **Responsive Grid**: Clean card-based layout for easy browsing

### 🖼️ Advanced Image Viewer

- **High-Resolution Support**: View detailed technical diagrams
- **Zoom Controls**: Scale from 25% to 400% for precision
- **Rotation**: 90-degree rotation increments
- **Fullscreen Mode**: Immersive viewing experience
- **Navigation**: Keyboard and button navigation between resources

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

### Resource Viewer

1. **Browse Resources**: Use the filter buttons to view images, PDFs, or all resources
2. **Grid View**: Click the grid view button for an overview of all resources
3. **Single View**: Click any resource to view it in detail
4. **Navigation**: Use arrow keys or navigation buttons to browse
5. **Controls**:
   - Zoom in/out for detailed examination
   - Rotate images for different perspectives
   - Download resources for offline use
   - Toggle fullscreen for immersive viewing

### External Links

1. **Browse Categories**: Filter links by type (manuals, parts, service, info)
2. **Visit Sites**: Click "Visit Site" to open external resources
3. **Add Context**: Each link includes notes and descriptions
4. **Quick Access**: All important Surron resources in one place

## Resource Categories

### Technical Diagrams

- Body assembly components
- Battery and motor assemblies
- Wheel and suspension systems
- Electronics and lighting
- Brake and drive systems

### Service Documents

- Official Surron service manual
- Light Bee parts manual
- Front wheel disassembly guide

### External Resources

- Official Surron documentation
- Parts catalogs and ordering
- Service center locator
- Community forums and support
- Technical specifications
- Warranty information

## File Structure

```
src/
├── components/
│   ├── ResourceViewer.tsx      # Main resource viewer component
│   └── WebsiteLinks.tsx        # External links hub
├── App.tsx                     # Root component
├── App.css                     # Cyberpunk styling
├── index.css                   # Base styles
└── main.tsx                    # Entry point
```

## Customization

### Adding New Resources

1. **Images**: Place new images in the `public/` directory
2. **PDFs**: Add PDF files to the `public/` directory
3. **Update Resource List**: Add new resources to the `resources` array in `ResourceViewer.tsx`

### Adding External Links

1. **Edit WebsiteLinks.tsx**: Add new links to the `websiteLinks` array
2. **Categories**: Choose from 'manual', 'parts', 'service', 'info', or 'other'
3. **Icons**: Select appropriate Lucide React icons
4. **Notes**: Add context and personal notes for each link

### Color Scheme

Edit the CSS variables in `App.css`:

```css
:root {
  --industrial-bg: #1a1d23; /* Background */
  --industrial-primary: #4a90e2; /* Blue accent */
  --industrial-accent: #f5a623; /* Orange accent */
  --industrial-warning: #f5a623; /* Yellow warning */
  --industrial-danger: #d0021b; /* Red danger */
}
```

## Technical Details

### Built With

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast development and build tooling
- **Lucide React**: Beautiful, customizable icons
- **CSS Grid & Flexbox**: Responsive layouts

### Performance Features

- **Lazy Loading**: Images load on demand
- **Optimized Rendering**: Efficient React component structure
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Navigation**: Full keyboard support for accessibility

## Future Enhancements

### Potential Additions

- **Search Functionality**: Find resources by title or content
- **Favorites System**: Mark frequently used resources
- **Custom Categories**: User-defined resource organization
- **Offline Support**: Cache resources for offline viewing
- **Mobile App**: React Native version for mobile devices
- **3D Models**: Interactive 3D bike component viewers
- **AR Integration**: Augmented reality maintenance guides

### Advanced Features

- **User Accounts**: Personalized resource collections
- **Cloud Sync**: Share resources across devices
- **Collaboration**: Share annotated resources with others
- **Analytics**: Track most-used resources and links
- **Notifications**: Updates for new resources or manuals
