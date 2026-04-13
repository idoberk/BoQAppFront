# Sidebar Implementation Plan

Replaces the existing `NavBar` (MUI Drawer-based) with a new `Sidebar` component that:

- Lives on the left side and **does not scroll** with the page
- Auto-sizes its minimum width to the **widest nav item + a configurable gap**
- Lets the user **drag the right edge** to expand up to a configurable max width
- Has a **header slot** at the top (logo / app name)
- Uses MUI + Emotion, React, vanilla JS (no extra deps)

---

## Files to change

| File | Action |
|------|--------|
| `components-lib/navigation/Sidebar.jsx` | **Create** |
| `components-lib/navigation/NavItem.jsx` | **Edit** – prevent text wrapping |
| `components-lib/navigation/index.js` | **Edit** – export `Sidebar` |
| `src/App.jsx` | **Edit** – replace `NavBar` with `Sidebar`, add icons |

---

## Architecture: Hooks in the Component Library?

### What the existing library tells us

Every component in `components-lib/` is a **stateless, styled wrapper** — no hooks, no local state. The consumer (`src/`) owns all state and passes it in as props:

| Component | State owner |
|-----------|-------------|
| `Dialog` | Consumer passes `open` / `onClose` |
| `TextField` | Consumer passes `value` / `onChange` |
| `NavItem` | Consumer passes `selected` |
| `NavBar` | No state at all |

The library's job is: *here's how it looks*. The app's job is: *here's what it knows*.

### Where Sidebar is different

The resize behavior introduces **two categories of state** that need to live somewhere:

| State | Type | Who should own it? |
|-------|------|-------------------|
| `width` (current sidebar width) | UI interaction state | Debatable — see below |
| `minWidthRef` (measured DOM minimum) | DOM measurement | Must be internal — it requires a ref to the element |
| `handleRef` (resize handle DOM node) | DOM ref | Must be internal |
| Mouse event handlers | Interaction logic | Could go either way |

### The two valid options

#### Option A — Hooks inside `Sidebar.jsx` (self-contained)

Sidebar internally manages the resize. Consumer API is clean:

```jsx
<Sidebar header={...}>
  <NavItem ...>Dashboard</NavItem>
</Sidebar>
```

**Pros:** Simple consumer API. Resize behavior is encapsulated — nobody using the sidebar needs to know about `mousemove`.
**Cons:** Breaks the stateless-component pattern of the library. Width can't be persisted (e.g. to `localStorage`) without adding more props.

This is acceptable when the state is *purely cosmetic UI behavior* — resize width has no meaning outside the component. MUI's own complex components (`Autocomplete`, `DatePicker`) do this too.

#### Option B — `useResizable` custom hook + stateless `Sidebar` (split)

Extract the resize logic into a dedicated hook that lives alongside the component:

```
components-lib/navigation/
  Sidebar.jsx         ← stateless, accepts width + resizeHandleProps
  useResizable.js     ← the drag + measurement logic
```

Consumer in `src/App.jsx`:

```jsx
import { Sidebar, useResizable } from '../components-lib/navigation';

const App = () => {
  const { width, sidebarRef, handleRef, handleMouseDown } = useResizable({ maxWidth: 400 });

  return (
    <Sidebar
      ref={sidebarRef}
      width={width}
      resizeHandleProps={{ ref: handleRef, onMouseDown: handleMouseDown }}
      header={...}
    >
      ...
    </Sidebar>
  );
};
```

**Pros:** Consistent with the library's stateless philosophy. Width is accessible in the consumer — easy to persist to `localStorage` or sync to a URL param.
**Cons:** More verbose consumer API. Consumer *must* call the hook; forgetting it makes the sidebar non-resizable.

### Recommendation

**Use Option A** (hooks inside `Sidebar.jsx`) for now.

The resize behavior is *interaction-only* — it doesn't represent any domain concept. No page in `src/` needs to know the sidebar's current pixel width. The clean consumer API (`<Sidebar>` with no wiring required) is more valuable here than strict adherence to the stateless pattern.

If the need ever arises to persist the width across sessions, it's a small refactor to promote `width` to a prop with an `onWidthChange` callback (controlled component pattern), while keeping the hook as a helper.

The rule of thumb going forward:

> **Stateless** in `components-lib/` when the state lives naturally in the application domain (selection, data, visibility).
> **Hooks allowed** in `components-lib/` when the state is pure interaction/DOM mechanics that would be awkward for every consumer to re-implement.

---

## React Compiler — no manual `useCallback` needed

The project has `babel-plugin-react-compiler` active (confirmed in `vite.config.js`). The React Compiler statically analyzes components at build time and automatically inserts memoization — the equivalent of `useCallback` and `useMemo` — wherever it determines a stable reference is needed.

Writing `useCallback` manually alongside the compiler is redundant: you'd be doing by hand exactly what the compiler already does. It adds noise without benefit.

```jsx
// ❌ redundant with React Compiler active
const handleMouseDown = useCallback((e) => { ... }, [maxWidth]);

// ✅ write a plain function — compiler handles memoization
const handleMouseDown = (e) => { ... };
```

**When to still use `useCallback` / `useMemo` manually:**
The compiler emits a warning when it *bails out* on a component — meaning the component isn't pure enough to analyze safely (e.g. it mutates props, uses non-standard patterns). If you see a bail-out warning, the right fix is to clean up the component, not to reach for manual hooks.

**Impact on the Sidebar code:**
- `useCallback` is removed from the import
- `handleMouseDown` becomes a plain `const` function

---

## React Best Practices Applied (Vercel guidelines)

The original draft had three issues that the Vercel React best practices guide flags. Here's what was changed in Step 1 and why.

### 1. `rerender-move-effect-to-event` — remove the `isDragging` state + its `useEffect`

**Problem (original draft):**

```jsx
const [isDragging, setIsDragging] = useState(false);

// Effect runs after every render triggered by isDragging change.
// This is a side-effect driven by an interaction, not by a render.
useEffect(() => {
  if (isDragging) {
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  } else {
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }
  return () => { /* cleanup */ };
}, [isDragging]);

const handleMouseDown = useCallback((e) => {
  e.preventDefault();
  setIsDragging(true);          // triggers re-render #1
  ...
  const onMouseUp = () => {
    setIsDragging(false);       // triggers re-render #2
    ...
  };
}, [maxWidth]);
```

`isDragging` only exists to drive `document.body` mutations via an effect. That's exactly the antipattern the rule targets: *"interaction → state → effect → DOM"* where the state and effect are unnecessary middlemen.

**Fix:** Apply the body mutations directly inside the event handlers, and remove both `isDragging` state and the effect entirely. Zero extra re-renders.

```jsx
// No isDragging state. No useEffect for body styles.

const handleMouseDown = useCallback((e) => {
  e.preventDefault();
  document.body.style.userSelect = 'none';   // set here
  document.body.style.cursor = 'col-resize';

  const onMouseUp = () => {
    document.body.style.userSelect = '';     // clear here
    document.body.style.cursor = '';
    ...
  };
  ...
}, [maxWidth]);
```

### 2. `rerender-use-ref-transient-values` — use a DOM ref for the handle's visual state

**Problem (original draft):**

```jsx
<ResizeHandle
  className={isDragging ? 'is-dragging' : ''}
  onMouseDown={handleMouseDown}
/>
```

The `is-dragging` CSS class was toggled via React state, causing two extra re-renders (one at drag start, one at drag end) purely for a visual indicator.

**Fix:** Hold a `ref` to the handle element and mutate the class list directly — the same direct DOM mutation approach used for body styles above.

```jsx
const handleRef = useRef(null);

// in handleMouseDown:
handleRef.current?.classList.add('is-dragging');

// in onMouseUp:
handleRef.current?.classList.remove('is-dragging');

// in JSX:
<ResizeHandle ref={handleRef} onMouseDown={handleMouseDown} />
```

### 3. `rendering-conditional-render` — ternary over `&&` for JSX blocks

**Problem (original draft):**

```jsx
{header && (
  <>
    <Box sx={{ px: 2, py: 1.5 }}>{header}</Box>
    <Divider />
  </>
)}
```

If `header` were ever `0` or an empty string, `&&` would render the literal `0`/`""` into the DOM. A ternary makes the intent explicit and safe.

**Fix:**

```jsx
{header ? (
  <>
    <Box sx={{ px: 2, py: 1.5 }}>{header}</Box>
    <Divider />
  </>
) : null}
```

---

## Step 1 – Create `components-lib/navigation/Sidebar.jsx`

### How the sizing works

| State | CSS behaviour |
|-------|---------------|
| No drag yet | `min-width: max-content` in CSS handles width automatically; content + right padding determines the minimum |
| During / after drag | An explicit `width` state is applied, clamped to `[measuredMinWidth, maxWidth]` |

The `contentGap` prop (default `24px`) is added as `padding-right` to the inner content box. Because the outer container has `min-width: max-content`, this padding is naturally included in the measured minimum width.

### Global cursor + user-select during drag

`document.body` gets `cursor: col-resize` and `user-select: none` directly inside `handleMouseDown` (and cleared in `onMouseUp`), so the cursor stays consistent when the pointer moves over the main content area.

### Code

```jsx
// components-lib/navigation/Sidebar.jsx
import { useEffect, useRef, useState } from 'react';
import { Box, Divider } from '@mui/material';
import styled from '@emotion/styled';

const RESIZE_HANDLE_WIDTH = 6;
const DEFAULT_MAX_WIDTH = 400;

const SidebarRoot = styled(Box)`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-width: max-content;
  overflow: hidden;
  border-right: 1px solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

const ResizeHandle = styled(Box)`
  position: absolute;
  right: 0;
  top: 0;
  width: ${RESIZE_HANDLE_WIDTH}px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 2px;
    height: 100%;
    background-color: transparent;
    transition: background-color 0.2s;
  }

  &:hover::after,
  &.is-dragging::after {
    background-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

/**
 * Resizable sidebar fixed to the left side of the page.
 *
 * Props:
 *   header     – content rendered above the nav items (e.g. logo / app name)
 *   maxWidth   – maximum draggable width in px (default 400)
 *   contentGap – extra right padding beyond the widest item in px (default 24)
 *   children   – NavItem / NavSection elements
 */
const Sidebar = ({
  header,
  children,
  maxWidth = DEFAULT_MAX_WIDTH,
  contentGap = 24,
  ...props
}) => {
  const [width, setWidth] = useState(null);
  const sidebarRef = useRef(null);
  const handleRef = useRef(null);   // ref to the ResizeHandle DOM node
  const minWidthRef = useRef(0);

  // Measure the natural content width once after mount so we can clamp
  // the drag minimum to it.
  useEffect(() => {
    if (sidebarRef.current) {
      minWidthRef.current = sidebarRef.current.getBoundingClientRect().width;
    }
  }, []);

  // React Compiler handles memoization — no useCallback needed.
  const handleMouseDown = (e) => {
    e.preventDefault();

    // Direct DOM mutations — no React state needed for these transient
    // side-effects (rerender-move-effect-to-event).
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    handleRef.current?.classList.add('is-dragging');

    const startX = e.clientX;
    const startWidth =
      sidebarRef.current?.getBoundingClientRect().width ?? minWidthRef.current;

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      const next = Math.min(
        maxWidth,
        Math.max(minWidthRef.current, startWidth + delta)
      );
      setWidth(next);
    };

    const onMouseUp = () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      handleRef.current?.classList.remove('is-dragging');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <SidebarRoot
      ref={sidebarRef}
      style={width !== null ? { width: `${width}px` } : undefined}
      {...props}
    >
      {header ? (
        <>
          <Box sx={{ px: 2, py: 1.5 }}>{header}</Box>
          <Divider />
        </>
      ) : null}

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 1,
          pr: `${contentGap}px`,
        }}
      >
        {children}
      </Box>

      <ResizeHandle ref={handleRef} onMouseDown={handleMouseDown} />
    </SidebarRoot>
  );
};

export default Sidebar;
```

---

## Step 2 – Edit `components-lib/navigation/NavItem.jsx`

Add `noWrap` to `ListItemText` via `slotProps` so text renders on a single line. This is required for `min-width: max-content` to correctly capture the full item width.

`primaryTypographyProps` is deprecated in MUI v7. Use `slotProps.primary` instead — it passes props directly to the underlying `Typography` slot.

**Before:**
```jsx
<ListItemText primary={children} />
```

**After:**
```jsx
<ListItemText primary={children} slotProps={{ primary: { noWrap: true } }} />
```

Full updated file:

```jsx
// components-lib/navigation/NavItem.jsx
import styled from '@emotion/styled';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

const DefaultNavItem = styled(ListItemButton)``;

const NavItem = ({ href, icon, selected = false, children, ...props }) => {
  return (
    <DefaultNavItem
      component='a'
      href={href}
      selected={selected}
      {...props}
    >
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText primary={children} slotProps={{ primary: { noWrap: true } }} />
    </DefaultNavItem>
  );
};

export default NavItem;
```

---

## Step 3 – Edit `components-lib/navigation/index.js`

Add the `Sidebar` export alongside the existing ones.

```js
// components-lib/navigation/index.js
export { default as NavBar } from './NavBar';
export { default as NavItem } from './NavItem';
export { default as NavSection } from './NavSection';
export { default as Sidebar } from './Sidebar';
```

---

## Step 4 – Edit `src/App.jsx`

Replace `<NavBar>` with `<Sidebar>`. Add a header with the app name and placeholder nav items with MUI icons.

`@mui/icons-material` is already installed in `package.json`.

```jsx
// src/App.jsx
import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CalculateIcon from '@mui/icons-material/Calculate';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

import theme from './utils/palettes/defaultPalette';
import { Sidebar, NavItem, NavSection } from '../components-lib/navigation';
import DashboardEngine from './dashboard/DashboardEngine';
import CssClasses from './utils/CssClasses';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CssClasses>
        <Sidebar
          header={
            <Typography variant="h6" fontWeight="bold">
              BOQApp
            </Typography>
          }
        >
          <NavItem href="#" icon={<DashboardIcon />} selected>
            Dashboard
          </NavItem>

          <NavSection title="Projects">
            <NavItem href="#" icon={<FolderOpenIcon />}>
              All Projects
            </NavItem>
            <NavItem href="#" icon={<CalculateIcon />}>
              Estimates
            </NavItem>
          </NavSection>

          <NavSection title="Reports">
            <NavItem href="#" icon={<AssessmentIcon />}>
              Cost Reports
            </NavItem>
          </NavSection>

          <NavSection title="Admin">
            <NavItem href="#" icon={<PeopleIcon />}>
              Team
            </NavItem>
            <NavItem href="#" icon={<SettingsIcon />}>
              Settings
            </NavItem>
          </NavSection>
        </Sidebar>

        <main style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <DashboardEngine />
        </main>
      </CssClasses>
    </ThemeProvider>
  );
};

export default App;
```

---

## Notes

- **No routing changes needed** – nav items use plain `href` anchors, matching the existing pattern. Wire up React Router / links later.
- **`NavBar.jsx` is not deleted** – it's left in place and still exported; nothing should break if something imports it directly.
- **`contentGap` default is 24 px** – adjust on the `<Sidebar>` element if you want more or less breathing room.
- **`maxWidth` default is 400 px** – adjust the same way.
- **The "doesn't scroll with the page" requirement** is already satisfied by the parent layout in `CssClasses` (`display: flex; height: 100vh; overflow: hidden`) and the `main` element's `overflowY: auto`. The sidebar is just a sibling flex child and stays fixed.
