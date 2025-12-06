# Travel Advisor - Frontend

A mobile-first React PWA application built with Vite, featuring *some things we're not sure of yet* and a responsive UI design. This is the frontend component of the Travel Advisor 5 project.

## Features

- ⚡ **Vite** - Fast build tool with instant HMR (Hot Module Replacement)
- ⚛️ **React 18** - Latest React with modern hooks
- 🎨 **Tailwind CSS v4** - Utility-first CSS framework for rapid UI development
- 🧩 **shadcn/ui** - High-quality, unstyled component library
- 📱 **Responsive Design** - Mobile-first approach with custom layouts
- 🔧 **ESLint** - Code linting for consistent code quality
- 📦 **PWA Support** - Progressive Web App capabilities

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

You can verify your installation by running:
```bash
node --version
npm --version
```

## Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Project

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ui/              # shadcn/ui components
│   ├── features/            # Feature-specific components
│   │   └── map/             # Map view functionality
│   ├── layouts/             # Layout components
│   │   └── MobileLayout.jsx
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   ├── assets/              # Static assets
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static files
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## Dependencies

### Core Dependencies
- **react** - UI library
- **react-dom** - React DOM rendering

### Build & Development
- **@vitejs/plugin-react** - React plugin for Vite
- **vite** - Next-generation frontend tooling
- **@vitejs/plugin-react-swc** - SWC integration for faster builds

### Styling & UI
- **tailwindcss** - Utility-first CSS framework
- **@tailwindcss/postcss** - PostCSS plugin for Tailwind v4
- **tailwindcss-animate** - Animation utilities for Tailwind
- **postcss** - CSS processing
- **autoprefixer** - PostCSS plugin for vendor prefixes
- **shadcn-ui** - Component library built on Radix UI and Tailwind

### Development Tools
- **eslint** - Code linting
- **vite-plugin-pwa** - Progressive Web App support

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## Environment Variables

Create a `.env` file in the frontend directory if needed:

```env
VITE_API_URL=http://localhost:3000
```

Access environment variables in your code with `import.meta.env.VITE_*`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port already in use
If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the actual URL.

### Build errors
Clear your cache and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### CSS not loading
Ensure Tailwind CSS is properly configured in `postcss.config.js` and that `@tailwind` directives are in `src/index.css`.

## Contributing

When contributing to this project:
1. Follow the existing code structure
2. Use ESLint rules defined in `eslint.config.js`
3. Keep components modular and reusable
4. Document complex functionality

## Performance Tips

- Use React's `memo` for expensive component renders
- Lazy load routes with `React.lazy()`
- Optimize images in the `public/` directory
- Monitor bundle size with `npm run build`

## License

See the root project LICENSE file for details.

## Support

For issues or questions, please open an issue in the main repository.
