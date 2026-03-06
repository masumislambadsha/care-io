# Dark Mode Fix for Tailwind CSS v4

## Issue

Dark mode toggle changes icon but doesn't apply dark styles to the page.

## Root Cause

You're using Tailwind CSS v4 (`@tailwindcss/postcss`) which has different configuration than v3.

## Solution

### Option 1: Use Tailwind v4 Syntax (Recommended)

Update `tailwind.config.js`:

```js
export default {
  darkMode: ["variant", "&:where(.dark, .dark *)"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
};
```

### Option 2: Downgrade to Tailwind v3

```bash
npm uninstall @tailwindcss/postcss tailwindcss
npm install tailwindcss@^3.4.0 postcss autoprefixer
```

Then update `postcss.config.mjs`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

And `tailwind.config.js`:

```js
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
```

## Quick Test

1. Navigate to `/test-theme` page
2. Click the theme toggle button
3. Verify background and text colors change

## Verification Steps

1. Open browser DevTools
2. Inspect `<html>` element
3. When dark mode is active, you should see `class="dark"` on the html element
4. Check if dark: classes are being applied in the computed styles

## If Still Not Working

Check browser console for:

- Hydration errors
- CSS loading errors
- Theme provider errors

Run:

```bash
npm run dev
```

And check the terminal for build errors.
