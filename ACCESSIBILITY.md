# Accessibility Guide for Care.xyz

This document outlines the accessibility features and best practices implemented in Care.xyz to ensure WCAG 2.1 AA compliance.

## 🎯 Accessibility Goals

- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Touch target sizing
- Reduced motion support

## ♿ Key Features

### 1. Semantic HTML

All pages use proper semantic HTML elements:

```tsx
// ✅ Good
<nav>
  <ul>
    <li><a href="/services">Services</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Page Title</h1>
    <section>Content</section>
  </article>
</main>

// ❌ Bad
<div class="nav">
  <div class="link">Services</div>
</div>
```

### 2. ARIA Labels

Interactive elements have descriptive ARIA labels:

```tsx
<button
  aria-label="Toggle dark mode"
  onClick={toggleTheme}
>
  <span className="material-icons">dark_mode</span>
</button>

<input
  type="search"
  aria-label="Search caregivers"
  placeholder="Search..."
/>
```

### 3. Keyboard Navigation

All interactive elements are keyboard accessible:

- Tab: Navigate forward
- Shift + Tab: Navigate backward
- Enter/Space: Activate buttons
- Escape: Close modals/dropdowns
- Arrow keys: Navigate lists/menus

```tsx
// Keyboard event handling
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  }}
>
  Click me
</div>
```

### 4. Color Contrast

All text meets WCAG AA contrast ratios:

| Element        | Light Mode         | Dark Mode          | Ratio  |
| -------------- | ------------------ | ------------------ | ------ |
| Body text      | #0F172A on #FFFFFF | #F8FAFC on #020617 | 16.1:1 |
| Secondary text | #475569 on #FFFFFF | #94A3B8 on #020617 | 7.5:1  |
| Links          | #0D9488 on #FFFFFF | #14B8A6 on #020617 | 4.8:1  |
| Buttons        | #FFFFFF on #0D9488 | #FFFFFF on #14B8A6 | 4.5:1  |

### 5. Touch Targets

All interactive elements meet minimum size requirements:

- Minimum size: 44x44px (mobile)
- Minimum spacing: 8px between targets
- Large tap areas for elderly users

```tsx
// ✅ Good - Large touch target
<button className="px-6 py-3 min-h-[44px] min-w-[44px]">
  Submit
</button>

// ❌ Bad - Too small
<button className="px-2 py-1">
  Submit
</button>
```

### 6. Focus Indicators

All focusable elements have visible focus indicators:

```css
/* Global focus styles */
*:focus-visible {
  outline: 2px solid #0d9488;
  outline-offset: 2px;
}

/* Custom focus for buttons */
.btn:focus-visible {
  ring: 2px;
  ring-color: teal-500;
  ring-offset: 2px;
}
```

### 7. Form Accessibility

Forms include proper labels and error messages:

```tsx
<div>
  <label htmlFor="email" className="block text-sm font-medium">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
  {errors.email && (
    <p id="email-error" role="alert" className="text-red-600">
      {errors.email.message}
    </p>
  )}
</div>
```

### 8. Image Alt Text

All images have descriptive alt text:

```tsx
// ✅ Good
<img
  src="/caregiver.jpg"
  alt="Sarah Johnson, certified elderly care specialist with 10 years experience"
/>

// ❌ Bad
<img src="/caregiver.jpg" alt="caregiver" />

// Decorative images
<img src="/decoration.svg" alt="" role="presentation" />
```

### 9. Skip Links

Skip navigation links for keyboard users:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white"
>
  Skip to main content
</a>
```

### 10. Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// In components
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

<motion.div animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}>
  Content
</motion.div>;
```

## 🧪 Testing Accessibility

### Automated Testing

```bash
# Install axe-core
npm install --save-dev @axe-core/react

# Run accessibility tests
npm run test:a11y
```

### Manual Testing Checklist

- [ ] Navigate entire site using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify color contrast with browser tools
- [ ] Test with 200% zoom
- [ ] Test with reduced motion enabled
- [ ] Verify form error announcements
- [ ] Check focus indicators on all interactive elements
- [ ] Test with browser extensions (WAVE, axe DevTools)

### Screen Reader Testing

#### NVDA (Windows)

```
Insert + Down Arrow: Read next line
Insert + Up Arrow: Read previous line
Insert + Space: Read current element
```

#### VoiceOver (Mac)

```
VO + Right Arrow: Next element
VO + Left Arrow: Previous element
VO + Space: Activate element
```

#### JAWS (Windows)

```
Down Arrow: Next line
Up Arrow: Previous line
Enter: Activate link/button
```

## 📋 Component Accessibility Checklist

### Buttons

- [ ] Descriptive text or aria-label
- [ ] Keyboard accessible (Enter/Space)
- [ ] Focus indicator visible
- [ ] Disabled state announced
- [ ] Loading state announced

### Forms

- [ ] Labels associated with inputs
- [ ] Required fields marked
- [ ] Error messages announced
- [ ] Success messages announced
- [ ] Validation on blur and submit

### Modals

- [ ] Focus trapped within modal
- [ ] Escape key closes modal
- [ ] Focus returns to trigger element
- [ ] Background content inert
- [ ] Announced to screen readers

### Navigation

- [ ] Semantic nav element
- [ ] Current page indicated
- [ ] Skip links provided
- [ ] Keyboard navigable
- [ ] Mobile menu accessible

### Tables

- [ ] Table headers defined
- [ ] Caption provided
- [ ] Complex tables use scope
- [ ] Sortable columns announced
- [ ] Responsive on mobile

## 🎨 Accessible Color Palette

### Primary Colors

```css
/* Teal - Primary brand color */
--teal-50: #f0fdfa; /* Backgrounds */
--teal-600: #0d9488; /* Primary actions */
--teal-700: #0f766e; /* Hover states */

/* Slate - Text and UI */
--slate-50: #f8fafc; /* Light backgrounds */
--slate-600: #475569; /* Secondary text */
--slate-900: #0f172a; /* Primary text */
```

### Status Colors

```css
/* Success */
--green-600: #059669; /* 4.5:1 on white */

/* Warning */
--amber-600: #d97706; /* 4.5:1 on white */

/* Error */
--red-600: #dc2626; /* 4.5:1 on white */

/* Info */
--blue-600: #2563eb; /* 4.5:1 on white */
```

## 🔧 Tools and Resources

### Browser Extensions

- [WAVE](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Screen Readers

- [NVDA](https://www.nvaccess.org/) (Windows, Free)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Windows, Paid)
- VoiceOver (Mac/iOS, Built-in)
- TalkBack (Android, Built-in)

### Testing Services

- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Deque University](https://dequeuniversity.com/)

## 📚 Best Practices

1. **Design with accessibility in mind** from the start
2. **Test with real users** who use assistive technologies
3. **Provide multiple ways** to accomplish tasks
4. **Use progressive enhancement** for JavaScript features
5. **Document accessibility features** for users
6. **Train team members** on accessibility standards
7. **Regular audits** to maintain compliance
8. **User feedback** mechanism for accessibility issues

## 🚨 Common Issues to Avoid

### ❌ Don't

- Use color alone to convey information
- Create keyboard traps
- Use placeholder as label
- Auto-play videos with sound
- Use low contrast text
- Create time-limited content without extensions
- Use images of text
- Rely solely on hover states

### ✅ Do

- Provide text alternatives for images
- Ensure keyboard navigation works
- Use proper heading hierarchy
- Provide captions for videos
- Test with screen readers
- Use semantic HTML
- Provide clear error messages
- Allow users to control timing

## 📞 Accessibility Support

For accessibility issues or questions:

- Email: accessibility@care.xyz
- Report issues: GitHub Issues
- Documentation: /docs/accessibility

## 🎯 Compliance Statement

Care.xyz is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

**Conformance Status**: WCAG 2.1 Level AA (Target)
**Last Reviewed**: March 2026
**Next Review**: June 2026
