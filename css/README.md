# Modular CSS Structure

This directory contains a modular, optimized CSS architecture for the Fahrly landing page.

## File Structure

### Critical CSS (Load Immediately)
- `critical.css` - Base styles, CSS variables, utilities, and essential layout

### Component CSS (Load After Critical)
- `navigation.css` - Header, navigation links, hamburger menu, mobile navigation
- `buttons.css` - CTA buttons, mobile CTA, email signup components
- `hero.css` - Hero section layout and content
- `content-sections.css` - Problem/solution, features, onboarding sections

### Non-Critical CSS (Load Lazily)
- `non-critical.css` - Pricing, trust, SEO, footer sections

### Main Entry Point
- `main.css` - Imports all components in correct order

## CSS Variables

The system uses CSS custom properties for consistent theming:

```css
:root {
  /* Colors */
  --primary-color: #1877F2;
  --primary-hover: #0d6efd;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  
  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Typography */
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  
  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Utility Classes

The system includes utility classes for common patterns:

```css
/* Layout */
.flex, .grid, .hidden, .block
.items-center, .justify-between
.gap-sm, .gap-md, .gap-lg

/* Spacing */
.p-sm, .p-md, .p-lg
.mb-sm, .mb-md, .mb-lg
.mt-sm, .mt-md, .mt-lg

/* Typography */
.text-center, .text-left, .text-right

/* Responsive */
.md\:grid-cols-2, .md\:flex-row
```

## Mobile-First Approach

The CSS uses mobile-first responsive design with `min-width` media queries:

```css
/* Mobile styles (default) */
.hero .container {
  grid-template-columns: 1fr;
}

/* Tablet and up */
@media (min-width: 768px) {
  .hero .container {
    grid-template-columns: 1fr 1fr;
  }
}
```

## Performance Optimizations

1. **Critical CSS**: Essential styles load immediately
2. **Lazy Loading**: Non-critical sections load after page load
3. **CSS Variables**: Reduce repetition and enable easy theming
4. **Utility Classes**: Reduce CSS size and improve maintainability
5. **Will-change**: Optimize animations and transitions
6. **Focus-visible**: Better accessibility than :focus

## Accessibility Features

- `:focus-visible` instead of `:focus` for better keyboard navigation
- High contrast focus indicators
- Reduced motion support
- Touch device optimizations
- Print styles

## Usage

### For Development
Include the main CSS file:
```html
<link rel="stylesheet" href="css/main.css">
```

### For Production
Consider splitting into critical and non-critical:
```html
<!-- Critical CSS -->
<link rel="stylesheet" href="css/critical.css">
<link rel="stylesheet" href="css/navigation.css">
<link rel="stylesheet" href="css/buttons.css">
<link rel="stylesheet" href="css/hero.css">
<link rel="stylesheet" href="css/content-sections.css">

<!-- Non-critical CSS (load lazily) -->
<link rel="preload" href="css/non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

## Migration Notes

The modular structure maintains compatibility with existing HTML class names:
- `.grid-2` for problem/solution layout
- `.steps` for onboarding steps
- All existing component classes preserved

## Benefits

1. **Maintainability**: Each component is isolated and easy to modify
2. **Performance**: Critical CSS loads first, non-critical loads later
3. **Scalability**: Easy to add new components or modify existing ones
4. **Consistency**: CSS variables ensure consistent spacing, colors, and typography
5. **Accessibility**: Built-in accessibility features and best practices
6. **Mobile-First**: Responsive design that works on all devices 