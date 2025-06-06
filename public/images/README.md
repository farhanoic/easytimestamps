# Easy Timestamps Logo Files

This folder contains the logo assets for Easy Timestamps with theme-aware switching support.

## Required Logo Files

### Primary Logos (SVG - Recommended)
- `logo-dark.svg` - Dark logo for light theme (dark text/elements on transparent/light background)
- `logo-light.svg` - Light logo for dark theme (light/white text/elements on transparent background)

### Fallback Logos (PNG)
- `logo-dark.png` - Dark logo fallback (300x300px minimum)
- `logo-light.png` - Light logo fallback (300x300px minimum)

### Icon-Only Versions
- `icon-dark.svg` - Dark icon without text
- `icon-light.svg` - Light icon without text
- `icon-dark.png` - Dark icon fallback (180x180px)
- `icon-light.png` - Light icon fallback (180x180px)

## Logo Specifications

### File Format Requirements
- **Primary**: SVG format (scalable, crisp at all sizes)
- **Fallback**: PNG format with transparent background
- **No JPG**: Avoid JPEG format for logos (compression artifacts)

### Size Guidelines
- **SVG**: Vector format, no specific size needed
- **PNG**: Minimum 300x300px for logos, 180x180px for icons
- **Maximum**: 1000x1000px to keep file sizes reasonable

### Design Requirements

#### Dark Theme Logo (`logo-light.svg`)
- **Background**: Transparent or very dark
- **Text/Elements**: White or very light colors (#FFFFFF, #F8F9FA)
- **Use Case**: Displayed on dark backgrounds
- **Contrast**: High contrast against dark backgrounds

#### Light Theme Logo (`logo-dark.svg`)
- **Background**: Transparent or very light
- **Text/Elements**: Dark colors (#1F2937, #111827, #000000)
- **Use Case**: Displayed on light backgrounds
- **Contrast**: High contrast against light backgrounds

### Brand Colors (Reference)
```css
Primary Red: #E73C3C
Dark Gray: #1F2937
Light Gray: #F8F9FA
White: #FFFFFF
Black: #000000
```

## Logo Component Usage

The Logo component automatically switches between dark and light versions based on the current theme:

### Basic Usage
```tsx
import Logo from './components/Logo'

// Default medium size with text
<Logo />

// Small size, icon only
<Logo size="small" showText={false} />

// Large size with click handler
<Logo size="large" onClick={() => console.log('Logo clicked')} />
```

### Size Options
- `small` - 32px height (h-8)
- `medium` - 48px height (h-12) - Default
- `large` - 64px height (h-16)
- `hero` - 80px height (h-20) - Used in main header

### Props
- `size`: 'small' | 'medium' | 'large' | 'hero'
- `showText`: boolean (show/hide text next to logo)
- `className`: string (additional CSS classes)
- `onClick`: function (click handler for logo interaction)

## File Structure
```
public/images/
├── README.md (this file)
├── logo-dark.svg ← Add your dark theme logo here
├── logo-light.svg ← Add your light theme logo here
├── logo-dark.png (optional fallback)
├── logo-light.png (optional fallback)
├── icon-dark.svg (optional icon-only version)
├── icon-light.svg (optional icon-only version)
├── icon-dark.png (optional icon fallback)
└── icon-light.png (optional icon fallback)
```

## Installation Instructions

### Step 1: Prepare Your Logo Files
1. Create dark and light versions of your logo
2. Save as SVG format (preferred) with transparent backgrounds
3. Ensure proper contrast for each theme
4. Test legibility at small sizes (32px height)

### Step 2: Add Files to Project
1. Save your logo files in this folder (`public/images/`)
2. Use exact filenames listed above
3. Ensure proper file permissions (readable)

### Step 3: Enable Logo Display
1. Open `src/components/Logo.tsx`
2. Change `const hasLogo = false` to `const hasLogo = true`
3. Save the file

### Step 4: Test Logo Display
1. Run your development server
2. Check both light and dark themes
3. Verify logo switches correctly with theme toggle
4. Test all size variations

## Troubleshooting

### Logo Not Displaying
1. **Check file paths**: Ensure files are in `public/images/` folder
2. **Verify filenames**: Must match exactly (case-sensitive)
3. **Enable in component**: Set `hasLogo = true` in Logo.tsx
4. **Check file format**: SVG preferred, PNG as fallback

### Logo Not Switching Themes
1. **Filename check**: Ensure both `logo-dark.svg` and `logo-light.svg` exist
2. **Theme context**: Verify theme switching works for other elements
3. **Browser cache**: Hard refresh or clear cache

### Poor Logo Quality
1. **Use SVG format**: Vector graphics scale perfectly
2. **High-resolution PNG**: Minimum 300x300px for bitmap images
3. **Optimize files**: Use SVGO for SVG optimization

## Brand Guidelines

### Logo Usage
- ✅ Use provided dark/light versions appropriately
- ✅ Maintain proper contrast with backgrounds
- ✅ Keep adequate whitespace around logo
- ✅ Use consistent sizing across the application

### Logo Don'ts
- ❌ Don't stretch or distort the logo
- ❌ Don't use low-resolution images
- ❌ Don't change brand colors arbitrarily
- ❌ Don't use poor contrast combinations

## Analytics Tracking

The Logo component automatically tracks:
- Logo clicks (with size and theme data)
- Theme-aware display analytics
- User interaction patterns

This data helps optimize logo design and placement for better user engagement.