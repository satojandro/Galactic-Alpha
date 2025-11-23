# Galactic Alpha - Setup Guide

This document lists all npm packages required across the project and provides installation instructions.

## Quick Setup

Install dependencies for each module:

```bash
# Install Pipes module dependencies
cd pipes && npm install && cd ..

# Install Astro module dependencies  
cd astro && npm install && cd ..

# Install Backtester module dependencies
cd backtester && npm install && cd ..

# Install Frontend dependencies
npm install
```

## Module Dependencies

### 🔗 Pipes Module (`pipes/`)

**Core Dependencies:**
- `@sqd-pipes/pipes@^0.0.1-alpha.38` - SQD Pipes SDK for blockchain indexing (alpha version)

**Development Dependencies:**
- `@types/node@^22` - TypeScript types for Node.js
- `tsx@^4.7.0` - TypeScript execution
- `typescript@^5` - TypeScript compiler

### 🌟 Astro Module (`astro/`)

**Core Dependencies:**
- `astronomia@^2.0.0` - Astronomical calculations library

**Development Dependencies:**
- `@types/node@^22`
- `tsx@^4.7.0`
- `typescript@^5`

### 📊 Backtester Module (`backtester/`)

**Development Dependencies:**
- `@types/node@^22`
- `tsx@^4.7.0`
- `typescript@^5`

*Note: This module has no runtime dependencies - it only uses Node.js built-ins.*

### 🎨 Frontend Module (root directory)

**Core Dependencies:**

**Framework & Core:**
- `next@16.0.3` - Next.js framework
- `react@19.2.0` - React library
- `react-dom@19.2.0` - React DOM renderer

**UI Components:**
- `@radix-ui/react-accordion@1.2.2`
- `@radix-ui/react-alert-dialog@1.1.4`
- `@radix-ui/react-aspect-ratio@1.1.1`
- `@radix-ui/react-avatar@1.1.2`
- `@radix-ui/react-checkbox@1.1.3`
- `@radix-ui/react-collapsible@1.1.2`
- `@radix-ui/react-context-menu@2.2.4`
- `@radix-ui/react-dialog@1.1.4`
- `@radix-ui/react-dropdown-menu@2.1.4`
- `@radix-ui/react-hover-card@1.1.4`
- `@radix-ui/react-label@2.1.1`
- `@radix-ui/react-menubar@1.1.4`
- `@radix-ui/react-navigation-menu@1.2.3`
- `@radix-ui/react-popover@1.1.4`
- `@radix-ui/react-progress@1.1.1`
- `@radix-ui/react-radio-group@1.2.2`
- `@radix-ui/react-scroll-area@1.2.2`
- `@radix-ui/react-select@2.1.4`
- `@radix-ui/react-separator@1.1.1`
- `@radix-ui/react-slider@1.2.2`
- `@radix-ui/react-slot@1.1.1`
- `@radix-ui/react-switch@1.1.2`
- `@radix-ui/react-tabs@1.1.2`
- `@radix-ui/react-toast@1.2.4`
- `@radix-ui/react-toggle@1.1.1`
- `@radix-ui/react-toggle-group@1.1.1`
- `@radix-ui/react-tooltip@1.1.6`

**Charts & Visualization:**
- `recharts@2.15.4` - Charting library

**Icons:**
- `lucide-react@^0.454.0` - Icon library

**Form Handling:**
- `react-hook-form@^7.60.0` - Form state management
- `@hookform/resolvers@^3.10.0` - Form validation resolvers
- `zod@3.25.76` - Schema validation

**Styling:**
- `tailwindcss@^4.1.9` - Utility-first CSS framework
- `tailwindcss-animate@^1.0.7` - Tailwind animations
- `autoprefixer@^10.4.20` - CSS vendor prefixing
- `postcss@^8.5` - CSS post-processing
- `clsx@^2.1.1` - Conditional class names
- `tailwind-merge@^3.3.1` - Merge Tailwind classes
- `class-variance-authority@^0.7.1` - Component variants

**Utilities:**
- `date-fns@4.1.0` - Date manipulation
- `cmdk@1.0.4` - Command menu component
- `sonner@^1.7.4` - Toast notifications
- `vaul@^1.1.2` - Drawer component
- `embla-carousel-react@8.5.1` - Carousel component
- `react-resizable-panels@^2.1.7` - Resizable panels
- `input-otp@1.4.1` - OTP input component
- `react-day-picker@9.8.0` - Date picker
- `next-themes@^0.4.6` - Theme management
- `@vercel/analytics@1.3.1` - Analytics

**Development Dependencies:**
- `@tailwindcss/postcss@^4.1.9` - Tailwind PostCSS plugin
- `@types/node@^22` - TypeScript types for Node.js
- `@types/react@^19` - TypeScript types for React
- `@types/react-dom@^19` - TypeScript types for React DOM
- `typescript@^5` - TypeScript compiler
- `tw-animate-css@1.3.3` - Tailwind animation utilities

## Dependency Categories

### Blockchain/Indexing
- `@sqd-pipes/pipes` - Blockchain event indexing (alpha version)

### Astrological Calculations
- `astronomia` - Astronomical position calculations

### Frontend Framework
- `next` - React framework with SSR
- `react` - UI library
- `react-dom` - React renderer

### UI Components
- `@radix-ui/*` - Accessible UI primitives
- `recharts` - Data visualization charts
- `lucide-react` - Icon components

### Styling
- `tailwindcss` - Utility-first CSS
- `tailwindcss-animate` - Animation utilities
- `autoprefixer` - CSS vendor prefixes
- `postcss` - CSS processing

### Development Tools
- `typescript` - Type-safe JavaScript
- `tsx` - TypeScript execution
- `@types/*` - TypeScript type definitions

### Form Handling
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Validation resolvers
- `zod` - Schema validation

## Notes

- Each module has its own `package.json` file that manages its dependencies
- Run `npm install` in each module directory to install dependencies
- This is a JavaScript/TypeScript project, not Python (no `requirements.txt` needed)
- All dependencies are managed through npm and `package.json` files

