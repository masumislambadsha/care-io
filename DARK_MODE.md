# Dark Mode Implementation Guide

Care.xyz now supports full dark mode functionality using `next-themes`.

## 🌓 Features

- System preference detection
- Manual theme toggle
- Persistent theme selection
- Smooth transitions
- Full component coverage

## 🎨 Usage

### Theme Toggle Component

The `ThemeToggle` component is available for use anywhere in the app:

```tsx
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function MyComponent() {
  return (
    <div>
      <ThemeToggle />
    </div>
  );
}
```

### Using Theme in Components

```tsx
"use client";

import { useTheme } from "next-themes";

export default function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}
```

## 🎯 Styling with Dark Mode

### Tailwind CSS Classes

Use the `dark:` prefix for dark mode styles:

```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  <h1 className="text-2xl font-bold">Hello World</h1>
  <p className="text-slate-600 dark:text-slate-400">Description text</p>
</div>
```

### Common Dark Mode Patterns

#### Backgrounds

```tsx
// Page backgrounds
className = "bg-slate-50 dark:bg-slate-950";

// Card backgrounds
className = "bg-white dark:bg-slate-800";

// Hover states
className = "hover:bg-slate-100 dark:hover:bg-slate-700";
```

#### Text Colors

```tsx
// Primary text
className = "text-slate-900 dark:text-white";

// Secondary text
className = "text-slate-600 dark:text-slate-400";

// Muted text
className = "text-slate-500 dark:text-slate-500";
```

#### Borders

```tsx
// Standard borders
className = "border border-slate-200 dark:border-slate-700";

// Dividers
className = "border-t border-slate-100 dark:border-slate-800";
```

#### Buttons

```tsx
// Primary button
className = "bg-teal-600 hover:bg-teal-700 text-white";

// Secondary button
className =
  "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700";
```

## 📋 Component Checklist

Ensure all components support dark mode:

- [x] ThemeToggle component
- [ ] Navbar
- [ ] Footer
- [ ] Sidebar
- [ ] Cards
- [ ] Forms
- [ ] Buttons
- [ ] Modals
- [ ] Tables
- [ ] Badges
- [ ] Alerts
- [ ] Toasts

## 🔧 Configuration

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  darkMode: "class", // Enable class-based dark mode
  // ... rest of config
};
```

### Theme Provider

```tsx
// src/app/providers.tsx
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}
```

## 🎨 Color Palette

### Light Mode

- Background: `#F8FAFC` (slate-50)
- Surface: `#FFFFFF` (white)
- Primary: `#0D9488` (teal-600)
- Text: `#0F172A` (slate-900)
- Secondary Text: `#475569` (slate-600)

### Dark Mode

- Background: `#020617` (slate-950)
- Surface: `#1E293B` (slate-800)
- Primary: `#14B8A6` (teal-500)
- Text: `#F8FAFC` (slate-50)
- Secondary Text: `#94A3B8` (slate-400)

## 🧪 Testing Dark Mode

### Manual Testing

1. Toggle theme using ThemeToggle component
2. Check all pages in both themes
3. Verify contrast ratios meet WCAG standards
4. Test system preference detection
5. Verify theme persistence on page reload

### Automated Testing

```tsx
import { render } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

describe("Dark Mode", () => {
  it("renders correctly in dark mode", () => {
    const { container } = render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <MyComponent />
      </ThemeProvider>,
    );
    expect(container.firstChild).toHaveClass("dark");
  });
});
```

## 🚀 Best Practices

1. **Always provide dark mode variants** for all colored elements
2. **Test contrast ratios** to ensure readability
3. **Use semantic color names** (e.g., `text-primary` instead of `text-teal-600`)
4. **Avoid hardcoded colors** in inline styles
5. **Test with system preferences** enabled
6. **Provide smooth transitions** between themes

## 🐛 Common Issues

### Issue: Flash of unstyled content

**Solution**: Ensure ThemeProvider is at the root level and `suppressHydrationWarning` is added to `<html>` tag.

```tsx
<html suppressHydrationWarning>
  <body>
    <ThemeProvider>{children}</ThemeProvider>
  </body>
</html>
```

### Issue: Theme not persisting

**Solution**: Check that `next-themes` is properly configured with storage enabled (default).

### Issue: Components not updating

**Solution**: Ensure components using theme are client components (`"use client"`).

## 📱 Mobile Considerations

- Ensure touch targets remain visible in dark mode
- Test on actual devices with different brightness settings
- Consider battery-saving benefits of dark mode on OLED screens

## ♿ Accessibility

- Maintain WCAG AA contrast ratios (4.5:1 for normal text)
- Provide clear visual feedback for theme toggle
- Ensure focus indicators are visible in both themes
- Test with screen readers in both modes

## 🎯 Future Enhancements

- [ ] Add more theme options (high contrast, sepia)
- [ ] Per-component theme overrides
- [ ] Automatic theme switching based on time of day
- [ ] Theme preview before applying
- [ ] Custom color scheme builder
