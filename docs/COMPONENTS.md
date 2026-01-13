# Template Components

This template includes a pre-built component library for rapid development.

## Usage

Import components from `@/components/ui`:

```tsx
import { Button, Card, Input, Badge, Alert } from '@/components/ui'
```

Import layouts from `@/components/layouts`:

```tsx
import { DashboardLayout, FormLayout } from '@/components/layouts'
```

## Demo

Visit `/components-demo` to see all components in action.

## Available Components

### Form Components
- `Button` - Primary, secondary, outline, ghost, destructive variants
- `Input` - With label, error, and hint support
- `Select` - Dropdown with options
- `Textarea` - Multi-line text input

### Display Components
- `Card` - Container with header, content, footer
- `Badge` - Status indicators (success, warning, error, info)
- `Alert` - Notification banners
- `StatCard` - Metric display cards
- `Avatar` - User avatars with fallback initials

### Feedback Components
- `Modal` - Dialog overlay
- `Spinner` - Loading indicator
- `EmptyState` - Empty state placeholder

### Layout Components
- `DashboardLayout` - Sidebar navigation layout
- `DashboardHeader` - Page header with actions
- `DashboardContent` - Content wrapper
- `FormLayout` - Centered form page
- `FormSection` - Form section with title

## Customizing Brand Colors

Edit `tailwind.config.ts` to change the brand color palette:

```ts
colors: {
  brand: {
    50: '#eff6ff',
    // ... generate at https://uicolors.app/create
    500: '#3b82f6',  // Your primary color
    600: '#2563eb',  // Hover state
  }
}
```

All components using `brand-*` classes will automatically update.
