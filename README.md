# Solar Explorer

Solar Explorer is an interactive app for checking how various places would look when, through mastering material science and sustainable energy, we enter a solarpunk future. It showcases transformations through an interactive globe and before/after image sliders.

## Features

- **Interactive Image Comparison**: Smooth horizontal slider to reveal before/after images
- **Interactive Globe**: Click markers around the world to explore solarpunk transformations
- **Solarpunk Aesthetic**: Organic design elements with nature-inspired colors and textures
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Smooth Animations**: Fluid, organic transitions and interactions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance Optimized**: Fast loading with optimized image handling

## Design Philosophy

This website embodies the solarpunk aesthetic through:
- Earth-tone color palette with greens, browns, and warm accents
- Organic, flowing design elements inspired by nature
- Typography that feels natural and approachable
- Subtle textures reminiscent of natural materials
- Sustainable, eco-friendly visual themes

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Next.js 14** - React framework with app router
- **TypeScript** - Type safety and better development experience
- **CSS3** - Custom styling with CSS variables and modern features
- **React Hooks** - State management and effects

## Project Structure

```
├── app/
│   ├── components/
│   │   └── ImageComparison.tsx    # Main comparison slider component
│   ├── globals.css                # Global styles and solarpunk theme
│   ├── layout.tsx                 # Root layout with header
│   ├── page.tsx                   # Interactive globe home page
│   └── photos/
│       └── page.tsx               # Gallery of before/after comparisons
├── package.json
├── next.config.js
└── tsconfig.json
```

## Customization

### Adding New Image Comparisons

Edit the `sampleImagePairs` array in `app/photos/page.tsx`:

```typescript
const sampleImagePairs: ImagePair[] = [
  {
    id: 'unique-id',
    title: 'Your Title',
    description: 'Your description...',
    beforeImage: {
      src: 'before-image-url',
      alt: 'Description of before image',
      label: 'Before Label'
    },
    afterImage: {
      src: 'after-image-url', 
      alt: 'Description of after image',
      label: 'After Label'
    }
  }
]
```

### Customizing Colors

Modify the CSS variables in `app/globals.css`:

```css
:root {
  --forest-green: #2d5016;
  --moss-green: #4a7c59;
  --leaf-green: #a7c957;
  /* Add your custom colors */
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Images sourced from Unsplash
- Inspired by the solarpunk movement and sustainable design principles
- Built with modern web technologies for optimal performance and accessibility