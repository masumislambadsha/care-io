# Debug Dark Mode Issue

## Problem

Dark mode toggle changes icon but doesn't change the UI colors properly.

## Steps to Debug

### 1. Check if dark class is applied

Open browser DevTools (F12) and:

1. Click the theme toggle button
2. Inspect the `<html>` element
3. Check if `class="dark"` appears when you toggle

**Expected**: `<html lang="en" class="dark" suppressHydrationWarning>`

### 2. Check Tailwind CSS is loading

In DevTools Console, run:

```javascript
document.querySelector("html").classList.contains("dark");
```

Should return `true` when dark mode is active.

### 3. Check if dark: classes are working

In DevTools, inspect a white card and check computed styles.
When dark mode is active, you should see:

- `background-color: rgb(30, 41, 59)` (slate-800)

### 4. Force dark mode manually

In DevTools Console:

```javascript
document.documentElement.classList.add("dark");
```

If this works, the issue is with next-themes.
If this doesn't work, the issue is with Tailwind configuration.

## Quick Fix

### Option 1: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Option 2: Clear Next.js Cache

```bash
rm -rf .next
npm run dev
```

### Option 3: Check Browser Cache

- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or open in incognito mode

## Verify Tailwind Config

Your `tailwind.config.js` should have:

```javascript
export default {
  darkMode: ["variant", "&:where(.dark, .dark *)"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
};
```

## Test Page

Navigate to: `http://localhost:3000/test-theme`

This page will show:

- Current theme
- System theme
- Whether dark mode is active

## Common Issues

### Issue 1: CSS not rebuilding

**Solution**: Restart dev server

### Issue 2: Browser cache

**Solution**: Hard refresh or incognito mode

### Issue 3: Tailwind v4 syntax

**Solution**: Already fixed in config

### Issue 4: Theme not persisting

**Solution**: Check localStorage in DevTools:

```javascript
localStorage.getItem("care-xyz-theme");
```

## Manual Test

1. Open DevTools Console
2. Run:

```javascript
// Add dark class
document.documentElement.classList.add("dark");

// Check if background changed
getComputedStyle(document.querySelector(".bg-white")).backgroundColor;
```

If background changes to dark, Tailwind is working.
If not, CSS needs to rebuild.

## Next Steps

1. Stop dev server (Ctrl+C)
2. Delete .next folder
3. Restart: `npm run dev`
4. Hard refresh browser (Ctrl+Shift+R)
5. Toggle theme
6. Check if it works

If still not working, check browser console for errors.
