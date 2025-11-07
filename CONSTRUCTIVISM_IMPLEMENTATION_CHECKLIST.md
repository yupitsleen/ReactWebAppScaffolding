# Constructivism Theme - Implementation Checklist

## 📋 Project Goals

**Objective:** Make Constructivism the new default theme. Rename current theme to "basic" as an alternative skin.

**Decisions Made:**

- ✅ Constructivism becomes DEFAULT theme (not a variant)
- ✅ Current "original" theme renamed to "basic"
- ✅ No theme switcher UI needed (code-level configuration only)
- ✅ Keep dark mode toggle
- ✅ Remove ColorPresetSelector UI (colors managed in config)
- ✅ Use REDESIGN.md color palette: #8B0000, #D4A574, #2C5F2D, #FAF7F2

---

## 🎯 Implementation Checklist

### Phase 1: Foundation Setup

#### 1.1 Add Google Fonts

**File:** `src/index.html`

```html
<head>
  <!-- Existing head content -->

  <!-- ADD THESE LINES before closing </head> -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
</head>
```

- [x] File modified
- [x] Fonts loading in browser (check Network tab)

---

#### 1.2 Update Default Colors in Configuration

**File:** `src/data/configurableData.ts`

**Find this section:**

```typescript
theme: {
  primaryColor: "#3B82F6",
  secondaryColor: "#8B5CF6",
  mode: "light",
  borderRadius: 12,
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  // ...
}
```

**Replace with:**

```typescript
theme: {
  primaryColor: "#8B0000",      // Dark red (Constructivism)
  secondaryColor: "#D4A574",    // Warm tan (Constructivism)
  mode: "light",
  borderRadius: 4,              // Subtle rounds (was 12)
  fontFamily: '"Work Sans", "Helvetica Neue", sans-serif',
  // ...
}
```

- [x] primaryColor changed to #8B0000
- [x] secondaryColor changed to #D4A574
- [x] borderRadius changed to 4
- [x] fontFamily changed to Work Sans

---

#### 1.3 Add Constructivism CSS Variables

**File:** `src/index.css`

**Find the end of the file and ADD:**

```css
/* ============================================
   CONSTRUCTIVISM THEME (DEFAULT)
   ============================================ */

:root {
  /* Override color variables with Constructivism palette */
  --primary-color: #8b0000; /* Dark red */
  --secondary-color: #d4a574; /* Warm tan */
  --accent-color: #2c5f2d; /* Forest green */
  --background-color: #faf7f2; /* Warm off-white */
  --surface-color: #ffffff; /* Pure white */
  --text-primary: #1a1a1a; /* Near-black */
  --text-secondary: #4a4a4a; /* Medium gray */

  /* Typography - Constructivism fonts */
  --font-header: "Bebas Neue", "Arial Black", sans-serif;
  --font-subheader: "Work Sans", "Helvetica Neue", sans-serif;
  --font-body: "Work Sans", "Helvetica Neue", sans-serif;
  --font-code: "IBM Plex Mono", "Courier New", monospace;

  /* Border radius - subtle rounds */
  --border-radius-small: 2px;
  --border-radius-medium: 4px;
  --border-radius-large: 6px;

  /* Borders - bolder */
  --border-width-default: 2px;
  --border-width-focus: 3px;
}

/* Dark mode overrides for Constructivism */
[data-theme="dark"] {
  --background-color: #1a1a1a;
  --surface-color: #2a2a2a;
  --text-primary: #faf7f2;
  --text-secondary: #d4a574;
}

/* ============================================
   CONSTRUCTIVISM TYPOGRAPHY
   ============================================ */

/* Headers use Bebas Neue - bold, uppercase */
h1,
h2,
h3,
.MuiTypography-h1,
.MuiTypography-h2,
.MuiTypography-h3 {
  font-family: var(--font-header) !important;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

/* Subheaders use Work Sans */
h4,
h5,
h6,
.MuiTypography-h4,
.MuiTypography-h5,
.MuiTypography-h6 {
  font-family: var(--font-subheader) !important;
  font-weight: 600;
}

/* Body text uses Work Sans */
body,
p,
.MuiTypography-body1,
.MuiTypography-body2 {
  font-family: var(--font-body) !important;
}

/* Code uses IBM Plex Mono */
code,
pre,
.MuiTypography-code {
  font-family: var(--font-code) !important;
}

/* ============================================
   CONSTRUCTIVISM BUTTON STYLES
   ============================================ */

/* Outlined buttons - Constructivism default */
.MuiButton-outlined {
  border-width: 2px !important;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  border-radius: 4px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.MuiButton-outlined:hover {
  border-width: 2px !important;
  background-color: currentColor !important;
  color: var(--background-color) !important;
  transform: translateY(-1px);
}

.MuiButton-outlined:focus-visible {
  border-width: 3px !important;
  outline: none;
}

/* Contained buttons */
.MuiButton-contained {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  border-radius: 4px;
  box-shadow: none !important;
}

/* ============================================
   CONSTRUCTIVISM CARD STYLES
   ============================================ */

.MuiCard-root {
  border-radius: 4px !important;
  border-width: 2px;
  box-shadow: none !important;
}

/* ============================================
   CONSTRUCTIVISM CHIP STYLES
   ============================================ */

.MuiChip-root {
  border-radius: 2px !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  font-weight: 600;
  border: 2px solid currentColor;
}

/* ============================================
   CONSTRUCTIVISM TABLE STYLES
   ============================================ */

.MuiTableCell-head {
  font-family: var(--font-subheader) !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.875rem;
  border-bottom-width: 3px !important;
}

/* ============================================
   CONSTRUCTIVISM INPUT STYLES
   ============================================ */

.MuiOutlinedInput-root {
  border-radius: 4px !important;
}

.MuiOutlinedInput-notchedOutline {
  border-width: 2px;
}

.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
  border-width: 2px;
}

.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
  border-width: 3px;
}
```

- [x] CSS added to index.css
- [x] Verify styles apply in browser

---

#### 1.4 Update Theme Configuration

**File:** `src/theme/portalTheme.ts`

**Find the typography section (around line 75) and REPLACE:**

```typescript
typography: {
  fontFamily: themeConfig.fontFamily,
  h1: {
    fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1.2,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '1rem',
  },
  h2: {
    fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.3,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '0.875rem',
  },
  h3: {
    fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.4,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '0.75rem',
  },
  h4: {
    fontFamily: '"Work Sans", sans-serif',
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    marginBottom: '0.625rem',
  },
  h5: {
    fontFamily: '"Work Sans", sans-serif',
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5,
    marginBottom: '0.5rem',
  },
  h6: {
    fontFamily: '"Work Sans", sans-serif',
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.5,
    marginBottom: '0.5rem',
  },
  body1: {
    fontFamily: '"Work Sans", sans-serif',
    fontSize: '1rem',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  body2: {
    fontFamily: '"Work Sans", sans-serif',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    marginBottom: '0.75rem',
  },
},
```

**Find the shape section (around line 126) and REPLACE:**

```typescript
shape: {
  borderRadius: 4,  // Was 12
},
```

**Find the MuiButton section (around line 166) and UPDATE outlined styles:**

```typescript
// Outlined variant (secondary action)
outlined: {
  borderWidth: '2px',  // Keep this
  textTransform: 'uppercase',  // ADD
  letterSpacing: '0.08em',      // ADD

  '&:hover': {
    borderWidth: '2px',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'currentColor',  // ADD - fills on hover
    color: '#FAF7F2',                 // ADD - text color becomes background
  },

  '&:focus-visible': {              // ADD
    borderWidth: '3px',
    outline: 'none',
  },

  // ... rest stays the same
},
```

**Find the MuiCard section (around line 130) and UPDATE:**

```typescript
MuiCard: {
  defaultProps: {
    elevation: 0,
  },
  styleOverrides: {
    root: {
      borderRadius: 4,  // Was 12
      border: `2px solid var(--border-color)`,  // Was 1px
      boxShadow: 'none',  // No shadows in constructivism
      transition: 'all 0.3s ease-in-out',
      marginBottom: '24px',
      // ... rest stays the same
    },
  },
},
```

**Find the MuiChip section (around line 393) and UPDATE:**

```typescript
MuiChip: {
  styleOverrides: {
    root: {
      borderRadius: 2,       // Was 16
      fontWeight: 600,       // Was 500
      textTransform: 'uppercase',  // ADD
      fontSize: '0.75rem',         // ADD
      letterSpacing: '0.05em',     // ADD
      border: '2px solid currentColor',  // ADD
    },
    // ... color variants stay the same
  },
},
```

- [x] Typography updated to Bebas Neue + Work Sans
- [x] Border radius changed to 4
- [x] Button styles updated (outlined with fill on hover)
- [x] Card border width changed to 2px
- [x] Chip styles updated (angular, uppercase)

---

#### 1.5 Update CSS Variable Injection

**File:** `src/theme/portalTheme.ts`

**Find the `injectCSSVariables` function (around line 7) and UPDATE:**

```typescript
const injectCSSVariables = (themeConfig: ThemeConfig) => {
  const root = document.documentElement;
  root.style.setProperty("--primary-color", themeConfig.primaryColor);
  root.style.setProperty("--secondary-color", themeConfig.secondaryColor);

  // Constructivism colors (if using default)
  if (themeConfig.primaryColor === "#8B0000") {
    root.style.setProperty("--accent-color", "#2C5F2D"); // Forest green
    root.style.setProperty(
      "--background-color",
      themeConfig.mode === "light" ? "#FAF7F2" : "#1A1A1A"
    );
    root.style.setProperty(
      "--surface-color",
      themeConfig.mode === "light" ? "#FFFFFF" : "#2A2A2A"
    );
  } else {
    // Basic theme colors (fallback)
    root.style.setProperty(
      "--background-color",
      themeConfig.mode === "light" ? "#E8E3EB" : "#1F2937"
    );
    root.style.setProperty(
      "--surface-color",
      themeConfig.mode === "light" ? "#FFFFFF" : "#374151"
    );
  }

  root.style.setProperty(
    "--text-primary",
    themeConfig.mode === "light" ? "#1A1A1A" : "#FAF7F2"
  );
  root.style.setProperty(
    "--text-secondary",
    themeConfig.mode === "light" ? "#4A4A4A" : "#D4A574"
  );
  root.style.setProperty(
    "--border-color",
    themeConfig.mode === "light" ? "#E0E0E0" : "#374151"
  );
  root.style.setProperty(
    "--card-background",
    themeConfig.mode === "light" ? "#FFFFFF" : "#374151"
  );
};
```

- [x] CSS variables updated to support Constructivism colors

---

### Phase 2: Component Updates

#### 2.1 Remove ColorPresetSelector UI

**File:** `src/layouts/Layout.tsx`

**Find and REMOVE/COMMENT OUT these lines:**

```typescript
// REMOVE import
import { ColorPresetSelector } from '../components/ColorPresetSelector'

// REMOVE state
const [colorPresetDialogOpen, setColorPresetDialogOpen] = useState(false)

// REMOVE handler
const handleColorPresetSelect = (primaryColor: string, secondaryColor: string) => { ... }

// REMOVE button that opens dialog
<IconButton onClick={() => setColorPresetDialogOpen(true)}>
  <PaletteIcon />
</IconButton>

// REMOVE dialog component
<ColorPresetSelector
  open={colorPresetDialogOpen}
  onClose={() => setColorPresetDialogOpen(false)}
  ...
/>
```

**Keep these (we still want):**

- Dark mode toggle
- DensitySelector
- High contrast toggle

- [x] ColorPresetSelector import removed
- [x] Color preset state/handlers removed
- [x] Color preset button removed from UI
- [x] ColorPresetSelector dialog removed
- [x] Dark mode toggle still works
- [x] DensitySelector still works

---

#### 2.2 Update Status Chip Colors

**File:** `src/data/configurableData.ts`

**Verify status colors work with new palette. The existing status config should work, but double-check:**

```typescript
statusConfig: {
  todoItem: {
    priority: {
      high: { color: "error", label: "High Priority", icon: "🔥" },     // Red - good
      medium: { color: "warning", label: "Medium", icon: "⚠️" },        // Orange/tan - good
      low: { color: "default", label: "Low", icon: "📋" },              // Gray - good
    },
    status: {
      completed: { color: "success", label: "Completed", icon: "✅" },  // Green - good
      // ...
    },
  },
  // ... rest
}
```

**Update theme color definitions if needed:**
**File:** `src/theme/portalTheme.ts` (around line 46)

```typescript
success: {
  main: '#2C5F2D',    // Forest green (was #10B981)
  light: '#4A8A4B',
  dark: '#1F4420',
},
warning: {
  main: '#D4A574',    // Warm tan (was #F59E0B)
  light: '#E0B896',
  dark: '#B88A5A',
},
error: {
  main: '#8B0000',    // Dark red (was #EF4444)
  light: '#B22222',
  dark: '#660000',
},
```

- [x] Status chip colors updated to Constructivism palette
- [x] Test all status colors in UI (pending, completed, high priority, etc.)

---

### Phase 3: Geometric Accents (Optional - Featured Sections Only)

#### 3.1 Create Geometric Accent Component

**File:** `src/components/constructivism/GeometricAccent.tsx` (NEW FILE)

```typescript
import { Box } from "@mui/material";
import { memo } from "react";

type GeometricShape = "circle" | "triangle" | "diagonal-bar";

interface GeometricAccentProps {
  shape: GeometricShape;
  color?: string;
  size?: "small" | "medium" | "large";
  opacity?: number;
  position?: {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
  };
}

export const GeometricAccent = memo(
  ({
    shape,
    color = "var(--primary-color)",
    size = "medium",
    opacity = 0.08,
    position = { top: -40, right: -40 },
  }: GeometricAccentProps) => {
    const sizes = {
      small: 80,
      medium: 120,
      large: 180,
    };

    const dimension = sizes[size];

    const getShapeStyles = () => {
      switch (shape) {
        case "circle":
          return {
            width: dimension,
            height: dimension,
            borderRadius: "50%",
            border: `3px solid ${color}`,
            opacity,
          };

        case "triangle":
          return {
            width: 0,
            height: 0,
            borderLeft: `${dimension / 2}px solid transparent`,
            borderRight: `${dimension / 2}px solid transparent`,
            borderBottom: `${dimension}px solid ${color}`,
            opacity,
          };

        case "diagonal-bar":
          return {
            width: "4px",
            height: "100%",
            background: `linear-gradient(135deg, ${color} 0%, var(--secondary-color) 100%)`,
            transform: "skewY(-2deg)",
            opacity: opacity * 2,
          };

        default:
          return {};
      }
    };

    return (
      <Box
        sx={{
          position: "absolute",
          ...position,
          ...getShapeStyles(),
          pointerEvents: "none",
          zIndex: 0,
        }}
        aria-hidden="true"
      />
    );
  }
);

GeometricAccent.displayName = "GeometricAccent";
```

- [x] File created
- [x] Component builds without errors

---

#### 3.2 Create Index File for Constructivism Components

**File:** `src/components/constructivism/index.ts` (NEW FILE)

```typescript
export { GeometricAccent } from "./GeometricAccent";
```

- [x] File created

---

#### 3.3 Add Geometric Accent to Dashboard Hero

**File:** `src/pages/Home.tsx`

**At the top, ADD import:**

```typescript
import { GeometricAccent } from "../components/constructivism";
```

**Find the dashboard cards section (around line 200-250) and ADD to ONE featured card:**

```tsx
{/* Example: Add to the first/main dashboard card */}
<Grid item xs={12} md={6} lg={3}>
  <Card
    sx={{
      position: 'relative',
      overflow: 'hidden',
      minHeight: '200px',
    }}
  >
    {/* Geometric accent - subtle circle */}
    <GeometricAccent
      shape="circle"
      size="medium"
      opacity={0.08}
      position={{ top: -40, right: -40 }}
    />

    {/* Existing card content */}
    <DataCard ... />
  </Card>
</Grid>
```

**Note:** Only add to ONE card (the featured/main card). Keep other cards clean.

- [x] Import added
- [x] Geometric accent added to ONE dashboard card
- [x] Accent is subtle (low opacity)
- [x] Doesn't interfere with content readability

---

### Phase 4: Testing & Verification

#### 4.1 Visual Testing Checklist

**Typography:**

- [x] Dashboard page shows Bebas Neue uppercase headers
- [x] Headers are readable (not too bold/overwhelming)
- [x] Body text uses Work Sans
- [x] Line spacing looks good
- [x] All text is readable (default theme verified)

**Colors:**

- [x] Primary red (#8B0000) appears on primary buttons
- [x] Secondary tan (#D4A574) appears on secondary elements
- [x] Background is warm off-white (#FAF7F2) (might change)
- [x] Text contrast is sufficient (readable) (default theme is good, we can worry about other styles' readbility later)
- [x] Status chips use new color palette

**Buttons:**

- [x] Outlined buttons have 2px borders
- [x] Hover behavior readable (removed fill-on-hover to ensure readability across all themes)
- [x] Focus shows 3px border
- [x] Text transforms to uppercase (CSS applied correctly)
- [x] Transitions are smooth (subtle lift on hover)

**Cards:**

- [x] Border radius is 4px (subtle rounds)
- [x] Borders are 2px (visible but not harsh)
- [x] No shadows (flat design)
- [x] Card hover states work

**Tables:**

- [x] Headers are uppercase
- [x] Headers are bold
- [x] Bottom border is 3px
- [x] Rows are readable
- [x] Sorting works

**Geometric Accent:**

- [ ] Circle appears on dashboard hero card (USER TO VERIFY)
- [ ] Opacity is subtle (~8%) (USER TO VERIFY)
- [ ] Doesn't interfere with text (USER TO VERIFY)
- [ ] Positioned correctly (top-right) (USER TO VERIFY)

**Dark Mode:**

- [x] Dark mode toggle still works
- [x] Colors adjust appropriately (improved warm palette: #B22222, #E0B896, #4A8A4B)
- [x] Text is readable in dark mode
- [x] Constructivism aesthetic maintained (warm browns instead of cool grays)

---

#### 4.2 Page-by-Page Testing

**Dashboard (Home):**

- [ ] Headers uppercase (Bebas Neue)
- [ ] Cards show new border style
- [ ] Geometric accent on hero card
- [ ] Colors look good
- [ ] All interactive elements work

**Tasks Page:**

- [ ] Table headers uppercase
- [ ] Status chips angular and uppercase
- [ ] Buttons show outlined style
- [ ] Create/edit dialogs work
- [ ] Filters work

**Payments Page:**

- [ ] Status chips show correct colors
- [ ] Table styling consistent
- [ ] Amount formatting correct
- [ ] All interactions work

**Documents Page:**

- [ ] Card grid displays correctly
- [ ] Upload button styled correctly
- [ ] Document actions work
- [ ] Grid responsive

**Discussions Page:**

- [ ] Priority indicators visible
- [ ] Reply forms styled correctly
- [ ] Status chips work
- [ ] All interactions functional

**Timeline Page:**

- [ ] Timeline visualization works
- [ ] Date labels readable
- [ ] Status colors correct
- [ ] Responsive layout works

**Forms/Dialogs:**

- [ ] Input fields have 2px borders
- [ ] Focus shows 3px borders
- [ ] Labels uppercase where appropriate
- [ ] Buttons styled correctly
- [ ] Validation works

---

#### 4.3 Responsive Testing

**Desktop (1920px):**

- [ ] Layout looks good
- [ ] Typography scales appropriately
- [ ] Geometric accent positioned correctly
- [ ] All elements visible

**Laptop (1366px):**

- [ ] No horizontal scroll
- [ ] Cards resize appropriately
- [ ] Navigation works
- [ ] Content readable

**Tablet (768px):**

- [ ] Grid stacks correctly
- [ ] Typography still readable
- [ ] Touch targets adequate
- [ ] Navigation accessible

**Mobile (375px):**

- [ ] Single column layout
- [ ] Headers not too large
- [ ] Buttons tap-able
- [ ] All features accessible

---

#### 4.4 Accessibility Testing

**Keyboard Navigation:**

- [ ] Tab through all interactive elements
- [ ] Focus indicators visible (3px borders)
- [ ] Skip links work
- [ ] No keyboard traps

**Screen Reader:**

- [ ] Headers read correctly (despite uppercase)
- [ ] Buttons have clear labels
- [ ] Status chips announce properly
- [ ] Form labels associated correctly

**Color Contrast:**

- [ ] Text meets WCAG AA (4.5:1) - Test with contrast checker
- [ ] Buttons meet WCAG AA (3:1)
- [ ] Status indicators don't rely on color alone
- [ ] High contrast mode still works

**WCAG Checker URLs:**

- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- [ ] Primary red (#8B0000) on white: Contrast ratio \_\_\_\_:1 (should be ≥4.5:1)
- [ ] Near-black (#1A1A1A) on off-white (#FAF7F2): Contrast ratio \_\_\_\_:1
- [ ] Warm tan (#D4A574) on white: Contrast ratio \_\_\_\_:1

---

#### 4.5 Cross-Browser Testing

**Chrome/Edge:**

- [ ] Fonts load correctly
- [ ] CSS transforms work (skew, etc.)
- [ ] Clip-path works
- [ ] All features functional

**Firefox:**

- [ ] Fonts load correctly
- [ ] Border styles render correctly
- [ ] Uppercase transforms work
- [ ] All features functional

**Safari:**

- [ ] Fonts load correctly
- [ ] CSS variables work
- [ ] Border radius renders correctly
- [ ] All features functional

**Mobile Browsers:**

- [ ] Safari iOS - All features work
- [ ] Chrome Android - All features work

---

#### 4.6 Performance Testing

**Font Loading:**

- [ ] Fonts load without blocking render
- [ ] FOUT (Flash of Unstyled Text) minimal
- [ ] Fallback fonts acceptable
- [ ] No layout shift on font load

**Page Load:**

- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No console errors
- [ ] No console warnings (or minimal)

**Bundle Size:**

- [ ] CSS file size increase < 5kb
- [ ] No duplicate styles
- [ ] Fonts cached correctly

---

### Phase 5: Documentation & Cleanup

#### 5.1 Update Documentation

**File:** `README.md`

**Find the Design System section and UPDATE:**

````markdown
## Design System

### Theme

The application uses a **Constructivism-inspired design system** with warm modernist aesthetics.

**Typography:**

- Headers: Bebas Neue (bold, uppercase, tracking: 0.12em)
- Subheaders: Work Sans (semibold)
- Body: Work Sans (regular)
- Code: IBM Plex Mono

**Colors:**

- Primary: #8B0000 (dark red)
- Secondary: #D4A574 (warm tan)
- Accent: #2C5F2D (forest green)
- Background: #FAF7F2 (warm off-white)

**Aesthetic:**

- Subtle border radius (4px)
- Bold borders (2px, 3px on focus)
- Outlined buttons (fill on hover)
- Uppercase headers and labels
- Geometric accents on featured sections (sparingly)

**Alternative Theme:**
To use the "basic" theme (previous default), update `src/data/configurableData.ts`:

```typescript
theme: {
  primaryColor: "#3B82F6",
  secondaryColor: "#8B5CF6",
  borderRadius: 12,
  fontFamily: '"Inter", sans-serif',
}
```
````

````

- [x] README.md updated with new design system info ✅

---

**File:** `CLAUDE.md`

**Find the Design System section and UPDATE:**

```markdown
## Design System

### Constructivism Theme (Default)

Inspired by 1920s Russian avant-garde art (Stepanova, Popova, Exter).

**Typography Rules (#memorize):**
- Headers (H1-H3): Bebas Neue, bold, uppercase, 0.12-0.15em tracking
- Subheaders (H4-H6): Work Sans, semibold, normal case
- Body text: Work Sans, regular
- Code/technical: IBM Plex Mono

**Color Palette (#memorize):**
- Primary: #8B0000 (dark red) - primary actions, urgent status
- Secondary: #D4A574 (warm tan) - accents, borders, secondary actions
- Accent: #2C5F2D (forest green) - success states
- Background: #FAF7F2 (warm off-white) - page background
- Surface: #FFFFFF (pure white) - card backgrounds
- Text: #1A1A1A (near-black) - primary text

**Button Treatment:**
- Outlined: 2px border, fill with color on hover, 3px border on focus
- Contained: Uppercase, subtle shadow
- Text: Uppercase for labels

**Border Radius:**
- Small: 2px (chips, small elements)
- Medium: 4px (buttons, cards, containers)
- Large: 6px (dialogs, modals)

**Geometric Accents:**
- Used sparingly on featured sections only (dashboard hero)
- Subtle opacity (8-10%)
- Shapes: circles, triangles, diagonal bars
- Colors: primary red or secondary tan

**Styling Rules (#memorize):**
- Use CSS custom properties (--primary-color, --font-header, etc.)
- Target elements via CSS classes, not inline styles
- Uppercase transforms via CSS, not JSX
- Geometric accents via GeometricAccent component

### Alternative Theme: Basic

The "basic" theme is available as an alternative skin:
- Rounded corners (12px)
- Softer colors (blue/purple)
- Inter font family
- No geometric accents

Switch by updating `configurableData.ts` theme section.
````

- [x] CLAUDE.md updated with Constructivism design system ✅

---

#### 5.2 Code Comments

**Files to add comments:**

**`src/data/configurableData.ts`:**

```typescript
// Constructivism theme configuration (default)
// Colors inspired by Russian avant-garde art
theme: {
  primaryColor: "#8B0000",      // Dark red
  secondaryColor: "#D4A574",    // Warm tan
  // ...
}
```

**`src/theme/portalTheme.ts`:**

```typescript
// Constructivism typography
// Headers use Bebas Neue (bold, uppercase)
// Body uses Work Sans (readable, modern)
typography: {
  fontFamily: '"Work Sans", sans-serif',
  h1: {
    fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
    // ...
  }
}
```

**`src/index.css`:**

```css
/* ============================================
   CONSTRUCTIVISM THEME
   Default theme inspired by 1920s Russian avant-garde
   ============================================ */
```

- [x] Comments added to key configuration files

---

#### 5.3 Remove Unused Code (Optional)

**If completely removing "basic" theme support:**

- [ ] Remove color preset arrays from ColorPresetSelector.tsx (or keep as examples)
- [ ] Remove unused CSS for previous theme
- [ ] Remove colorManager.ts if not needed

**If keeping "basic" theme as option:**

- [ ] Document how to switch themes in code
- [ ] Add comments explaining theme variants
- [ ] Keep colorManager.ts for manual color changes

---

### Phase 6: Git & Deployment

#### 6.1 Test Suite

**Run existing tests:**

```bash
npm test
```

- [x] All 270 tests pass ✅
- [x] No new console errors in tests
- [x] Snapshot tests updated (if needed)

---

#### 6.2 Build

**Create production build:**

```bash
npm run build
```

- [x] Build succeeds ✅
- [x] No TypeScript errors
- [x] Bundle size reasonable

---

#### 6.3 Dev Server Test

**Test in development:**

```bash
npm run dev
```

- [ ] Server starts
- [ ] No console errors
- [ ] Hot reload works
- [ ] All features functional

---

#### 6.4 Commit

**Create feature branch and commit:**

```bash
git checkout -b feat/constructivism-default-theme
git add .
git commit -m "Replace default theme with Constructivism aesthetic

- Update default colors to warm modernist palette (#8B0000, #D4A574)
- Add Bebas Neue and Work Sans typography
- Update button styles (outlined with fill on hover)
- Update card and chip styles (subtle borders, angular)
- Add geometric accent component (used sparingly)
- Update documentation (README, CLAUDE.md)
- Rename previous theme to 'basic' (alternative skin)
- Remove ColorPresetSelector UI (colors managed in config)
- All tests passing (97/97)"
```

- [x] Branch created (feat/childishDesign)
- [x] Changes committed (commit: ac02332) ✅
- [x] Commit message clear and descriptive

---

#### 6.5 Push and Deploy

**Push to GitHub:**

```bash
git push origin feat/constructivism-default-theme
```

- [ ] Pushed to GitHub (USER TO PUSH)
- [ ] CI/CD pipeline runs (WILL RUN AFTER PUSH)
- [ ] Tests pass in CI (WILL CHECK AFTER PUSH)
- [ ] Build succeeds in CI (WILL CHECK AFTER PUSH)

**Merge to main:**

- [ ] Create PR
- [ ] Review changes
- [ ] Merge to main
- [ ] Deployed to GitHub Pages
- [ ] Verify live site

---

## 🎯 Success Criteria

### Design Quality

- [ ] Sophisticated, professional appearance
- [ ] Constructivism aesthetic clear but subtle
- [ ] Typography hierarchy effective
- [ ] Colors harmonious
- [ ] Geometric accents enhance, don't distract

### Technical Quality

- [ ] All tests pass
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Performance maintained
- [ ] Accessibility maintained

### User Experience

- [ ] Dark mode works
- [ ] Responsive on all devices
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] All features functional

---

## 🚀 Quick Start Commands

```bash
# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📝 Notes for Continuation

**If you need to pause and resume:**

1. **Check completed checkboxes** to see progress
2. **Last completed phase** determines where to resume
3. **Test after each phase** before moving to next
4. **Document any issues** encountered
5. **Update this checklist** as you work

**Key files modified:**

- `src/index.html` - Google Fonts
- `src/index.css` - Constructivism CSS
- `src/data/configurableData.ts` - Default colors/theme
- `src/theme/portalTheme.ts` - Typography, component styles
- `src/layouts/Layout.tsx` - Remove ColorPresetSelector UI
- `src/pages/Home.tsx` - Add geometric accent (optional)
- `src/components/constructivism/*` - New geometric components

**Testing priorities:**

1. Typography (fonts loading)
2. Colors (palette applied)
3. Buttons (outlined with fill on hover)
4. Cards (border styles)
5. Tables (uppercase headers)
6. Dark mode compatibility
7. Responsive layouts

---

## 🔍 Troubleshooting

**Fonts not loading:**

- Check Network tab for font requests
- Verify Google Fonts link in index.html
- Check font-family names match exactly

**Colors not applying:**

- Check CSS variable names in index.css
- Verify configurableData.ts colors
- Check browser DevTools computed styles

**Styles not applying:**

- Check CSS specificity (!important may be needed)
- Verify MuiTheme overrides in portalTheme.ts
- Clear browser cache

**Tests failing:**

- Update snapshots if UI changed
- Check for TypeScript errors
- Verify component imports

---

**End of Checklist - Ready for Implementation**
