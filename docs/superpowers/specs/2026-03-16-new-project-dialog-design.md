# New Project Dialog — Design Spec

**Date:** 2026-03-16
**Branch:** dashboard
**Status:** Approved

---

## Overview

Add a "New" navigation item to the sidebar that opens a dialog form for creating a new project. On successful creation, the user is taken to the new project's page. This feature introduces the `ProjectActionsContext`, the `NewProjectDialog` form component, and the `ProjectPage` with its Engine/View structure.

---

## Architecture

### New Files

| File | Purpose |
|---|---|
| `src/context/ProjectActionsContext.jsx` | Context definition, `ProjectActionsProvider` component, and `useProjectActionsContext` hook |
| `src/dashboard/components/NewProjectDialog.jsx` | Form dialog component — context consumer, feature code owned by Dashboard |
| `src/project/ProjectEngine.jsx` | Container: holds mock BoQ rows, passes to view |
| `src/project/ProjectView.jsx` | Presentational: renders SearchBar, DataGrid, Card |

### Modified Files

| File | Change |
|---|---|
| `src/App.jsx` | Add `AppContent` inner component; `App` renders `ThemeProvider` + `ProjectActionsProvider`; `AppContent` renders `CssClasses`, `Sidebar`, `main`, and dialog. `AppContent` imports `NewProjectDialog` from `'./dashboard/components/NewProjectDialog'` |
| `components-lib/navigation/NavItem.jsx` | Support `onClick`-only mode — set `component={href ? 'a' : 'button'}`, only forward `href` when defined. `onClick` already passes through `...props`; no signature change needed. |
| `components-lib/dialogs/Dialog.jsx` | Accept `children` (in `DialogContent`), `actions` prop (in `DialogActions`), fix `onClose` wiring, retain `dialogTitle` prop |
| `components-lib/cards/Card.jsx` | Pass `children` directly through `CardContent` without wrapping in `Typography` |

**Unchanged and pre-existing:** `NavSection` from `components-lib/navigation` is already used in `App.jsx` and requires no changes.

**Known pre-existing limitations (not introduced by this spec):**
- `Card.jsx` destructures `...props` but never forwards it to `DefaultCard`, silently discarding `sx`, `className`, etc. Does not affect current usage.
- `Containers.jsx` `FlexContainer` has a missing semicolon after the `gap` CSS value, causing the `flex` interpolation to be concatenated onto the same CSS line when `$flex` is provided. `ProjectView` uses `<FlexContainer style={{ justifyContent: 'center' }}>` with no `$flex` or `$gap` props, so this bug does not affect the current implementation.
- `DashboardView.jsx` contains a dead `import Dialog from '../../components-lib/dialogs/Dialog'` (commented-out usage). This spec leaves `DashboardView` unchanged; the dead import is pre-existing.

### Directory Structure

```
src/
├── context/
│   └── ProjectActionsContext.jsx
├── dashboard/
│   ├── components/
│   │   └── NewProjectDialog.jsx
│   ├── DashboardEngine.jsx       (unchanged)
│   └── DashboardView.jsx         (unchanged)
├── project/
│   ├── ProjectEngine.jsx
│   └── ProjectView.jsx
└── App.jsx
```

---

## Data Flow

```
App
  <ThemeProvider>
    <ProjectActionsProvider>
      <AppContent>                              ← consumes context; renders everything below
        <CssClasses>
          <Sidebar>
            NavItem "Home"  → onClick → goToDashboard()      (selected={activeView==='dashboard'})
            NavItem "New"   → onClick → openNewProjectDialog()
            NavItem "All Projects"  href='#'
            NavItem "Estimates"     href='#'
          </Sidebar>

          <main>
            <DashboardEngine />              (activeView === 'dashboard')
            <ProjectEngine project={...} /> (activeView === 'project')
          </main>

          {isNewProjectOpen && <NewProjectDialog />}
        </CssClasses>
      </AppContent>
    </ProjectActionsProvider>
  </ThemeProvider>
```

**Note on `<NewProjectDialog />` placement:** `CssClasses` is a `flex-direction: row` container. MUI `Dialog` renders into a Portal (appended to `document.body`), so its placement inside `CssClasses` has no effect on its visual rendering or layout — it will correctly appear as a centered overlay regardless of where it sits in the React tree.

**`CssBaseline` placement:** In the new structure, `<CssBaseline />` remains a direct child of `ThemeProvider`, rendered before `<ProjectActionsProvider>`. Its position relative to the provider tree has no functional effect.

**Why `AppContent`:** `useProjectActionsContext()` must be called inside a descendant of `ProjectActionsProvider`. Therefore `App` itself cannot call the hook — `AppContent` is a child component that sits inside the Provider and handles all context consumption and rendering.

**Key design decisions:**

- `ProjectActionsContext` is defined in `src/context/` (shared infrastructure) to accommodate future contexts (auth, user, etc.)
- `NewProjectDialog` source code lives in `src/dashboard/components/` (feature code with its feature), but is **rendered inside `AppContent` → `CssClasses`** so it is always reachable regardless of `activeView`; it is a context consumer
- `<NewProjectDialog>` is conditionally rendered with `{isNewProjectOpen && <NewProjectDialog open={true} />}` — unmounting on close automatically resets all local form state
- `AppContent` reads `activeView`, `createdProject`, `isNewProjectOpen`, `openNewProjectDialog`, and `goToDashboard` from context, then passes `createdProject` as a prop to `ProjectEngine`, keeping `ProjectEngine` decoupled from context (consistent with `DashboardEngine`)
- `NewProjectDialog` is a context consumer — calls `useProjectActionsContext()` directly to get `closeNewProjectDialog` and `createProject`

---

## Context Shape

`src/context/ProjectActionsContext.jsx` exports:
- `ProjectActionsProvider` — wraps the app, provides context values
- `useProjectActionsContext` — custom hook; calls `useContext(ProjectActionsContext)` internally so consumers never import the raw context object

| Value | Type | Purpose |
|---|---|---|
| `isNewProjectOpen` | `bool` | Controls dialog visibility. **Initial value: `false`** |
| `activeView` | `'dashboard' \| 'project'` | Controls which page is rendered in `AppContent`. **Initial value: `'dashboard'`** |
| `createdProject` | `object \| null` | Project data; `null` on initial load, populated after `createProject()` |
| `openNewProjectDialog()` | `function` | Sets `isNewProjectOpen = true` |
| `closeNewProjectDialog()` | `function` | Sets `isNewProjectOpen = false` |
| `createProject(formData)` | `function` | Sets `createdProject = formData`, sets `activeView = 'project'`, sets `isNewProjectOpen = false` |
| `goToDashboard()` | `function` | Sets `activeView = 'dashboard'`; does **not** reset `createdProject` (project data is preserved until a new project is created or routing replaces this pattern) |

---

## formData Shape

The `formData` object passed to `createProject()` and stored as `createdProject`:

```js
{
  name: string,        // Project Name
  number: string,      // "Auto-assigned" (placeholder)
  types: string[],     // e.g. ["Residential", "Commercial"]
  address: string,     // Street Address
  city: string,        // City / Town
  county: string,      // County
  state: string,       // State
  zip: string,         // ZIP
}
```

`ProjectEngine` receives this as its `project` prop. Because `activeView === 'project'` is only ever set by `createProject()`, `project` is **guaranteed non-null** when `ProjectEngine` mounts — no null-checks needed inside `ProjectEngine` or `ProjectView`.

---

## State Management

| State | Location | Rationale |
|---|---|---|
| `isNewProjectOpen` | `ProjectActionsContext` | Shared between Sidebar trigger and `AppContent` dialog mount |
| `activeView` | `ProjectActionsContext` | Shared between `createProject`/`goToDashboard` and `AppContent` view switching |
| `createdProject` | `ProjectActionsContext` | Produced by `createProject`, consumed by `AppContent` and passed as prop to `ProjectEngine` |
| Form field values | Local `useState` in `NewProjectDialog.jsx` | Ephemeral UI state; automatic reset via unmount on close |

---

## Component Library Changes

### NavItem — onClick support

`NavItem` hardcodes `component='a'`. The "Home" and "New" items need to trigger functions, not navigate.

**Required change:** Keep `href` as a named parameter in the destructured props signature. Set `component={href ? 'a' : 'button'}` on `ListItemButton`. Conditionally spread `href` using `{...(href ? { href } : {})}` — passing `href` to a `<button>` element is invalid HTML. `onClick` already passes through `...props` — no change to the signature needed for it.

### Dialog — children, actions, dialogTitle, and onClose fix

**Required changes:**
1. Remove the `handleClose = () => {}` stub; pass the `onClose` prop directly to `DefaultDialog`'s `onClose`. This means backdrop click and Escape key will call `onClose` — both should close the dialog.
2. Accept and render `children` inside `DialogContent`
3. Accept an `actions` prop rendered inside `DialogActions`
4. Retain the `dialogTitle` prop unchanged
5. Add `DialogContent` and `DialogActions` to the `@mui/material` import

### Card — remove Typography wrapper

**Required changes:**
1. Remove the `<Typography variant='body1'>` wrapper around `children`; pass `children` directly through `CardContent`
2. Remove the now-unused `import Typography from '../typographies/Typography'` from `Card.jsx`

---

## App.jsx Structure

`App` renders only the providers. `AppContent` is a new inner component that consumes context:

```jsx
// App — only renders providers
const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ProjectActionsProvider>
      <AppContent />
    </ProjectActionsProvider>
  </ThemeProvider>
);

// AppContent — consumes context, renders all UI
const AppContent = () => {
  const {
    activeView, createdProject, isNewProjectOpen,
    openNewProjectDialog, goToDashboard,
  } = useProjectActionsContext();

  return (
    <CssClasses>
      <Sidebar header={<Typography variant='h6' fontWeight='bold'>BoQApp</Typography>}>
        <NavItem onClick={goToDashboard} selected={activeView === 'dashboard'}>
          Home
        </NavItem>
        <NavSection title='Projects'>
          <NavItem onClick={openNewProjectDialog}>New</NavItem>
          <NavItem href='#'>All Projects</NavItem>
          <NavItem href='#'>Estimates</NavItem>
        </NavSection>
      </Sidebar>

      <main style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {activeView === 'dashboard'
          ? <DashboardEngine />
          : <ProjectEngine project={createdProject} />}
      </main>

      {isNewProjectOpen && <NewProjectDialog />}
    </CssClasses>
  );
};
```

**`selected` on NavItems:** `Home` uses `selected={activeView === 'dashboard'}` so it is only visually active on the dashboard. No NavItem appears selected when `activeView === 'project'` — this is intentional for this iteration.

---

## NewProjectDialog

### Props

`NewProjectDialog` takes no props. It hardcodes `open={true}` on the internal `Dialog` call — since the component is only ever mounted when `isNewProjectOpen` is true, the dialog is always visible when rendered.

### Context consumption

`NewProjectDialog` calls `useProjectActionsContext()` to get:
- `closeNewProjectDialog` — passed directly as `onClose` to `Dialog`. MUI calls `onClose(event, reason)` with two arguments; `closeNewProjectDialog` accepts none — the extra arguments are harmlessly ignored. This covers Cancel, backdrop click, and Escape key.
- `createProject(formData)` — called by Create button

### Fields

| Field | Type | Required | `formData` key |
|---|---|---|---|
| Project Name | `TextField` from `components-lib/inputs/textfields/TextField` | Yes | `name` |
| Project Number | TextField (disabled) | — | `number` → `"Auto-assigned"` |
| Project Type(s) | MUI Autocomplete (multiple) — imported directly from `@mui/material` (no component-lib wrapper exists) | Yes | `types` |
| Street Address | TextField | No | `address` |
| City / Town | TextField | No | `city` |
| County | TextField | No | `county` |
| State | TextField | No | `state` |
| ZIP | TextField | No | `zip` |

### Placeholder Project Types

Residential, Commercial, Industrial, Infrastructure, Renovation, Healthcare, Educational, Mixed-Use

### Layout

```
Project Name         [TextField - required              ]
Project Number       [TextField - disabled, Auto-assigned]
Project Type(s)      [Autocomplete - multi-select        ]

── Location ────────────────────────────────────────────
Street Address       [TextField                         ]
City / Town          [TextField                         ]
County               [TextField                         ]
State                [TextField                         ]
ZIP                  [TextField                         ]
────────────────────────────────────────────────────────

                               [Cancel]  [Create]
```

Passed to `Dialog` as:
- `dialogTitle="New Project"`
- `onClose={closeNewProjectDialog}` (handles Cancel, backdrop click, and Escape — all close the dialog)
- `children` = form fields
- `actions` = Cancel + Create buttons

### Behavior

- **Create button** is disabled until `name` is non-empty and `types` has at least one selection
- **Cancel / backdrop click / Escape** → calls `closeNewProjectDialog()`; form state resets automatically via unmount
- **Create** → calls `createProject(formData)`, which sets `createdProject`, sets `activeView = 'project'`, and sets `isNewProjectOpen = false` (unmounting dialog, resetting form)

### Form State

Controlled inputs with `useState`. React Compiler handles re-render optimization. No form library added.

**Form reset:** `{isNewProjectOpen && <NewProjectDialog />}` unmounts on close; remounts fresh on reopen — no explicit reset needed.

### Future Considerations

- **State** → dropdown of all US states
- **City/Town** → cascading dropdown filtered by State
- **County** → cascading dropdown filtered by State + City
- **ZIP** → validation against location (external geocoding API)

---

## Project Page

### ProjectEngine

- Receives `project` (non-null, guaranteed) as a prop from `AppContent`
- Holds mock BoQ rows (hardcoded, same approach as `DashboardEngine`). Each row must include a unique `id` field as required by MUI DataGrid (see `DashboardEngine` rows for reference).
- Passes `rows` and `project` to `ProjectView` as props

### ProjectView

**Imports:** Follow the same import patterns as `DashboardView` (use `DashboardView.jsx` as the canonical reference). Components: `FlexContainer` from `components-lib/containers/Containers`, `DataGrid` from `components-lib/datagrids/DataGrid`, `SearchBar` from `components-lib/inputs/textfields/SearchBar`, `Card` from `components-lib/cards/Card`, `Typography` from MUI.

**Layout:** Uses `<FlexContainer style={{ justifyContent: 'center' }}>` with no `$row` prop (defaults to `flex-direction: column`) — identical to the `DashboardView` usage. The SearchBar is **non-functional / presentational** for this iteration (same as in `DashboardView`).

```
[ Search Bar  (presentational, non-functional)        ]

┌──────────────────┬──────────┬──────────────────────┐
│                  │ Status   │ Last Edited           │
├──────────────────┼──────────┼──────────────────────┤
│ BoQ 1            │ Draft    │ 2026-03-15 09:30 · John D │
│ BoQ 2            │ Approved │ 2026-03-14 14:00 · John D │
└──────────────────┴──────────┴──────────────────────┘

┌──────────────────────────────────┐
│ Project: [name]                  │
│ Number: [number]                 │
│ [address], [city], [county]      │
│ [state] [zip]                    │
└──────────────────────────────────┘
```

### DataGrid Columns

| Field | Header | Notes |
|---|---|---|
| `name` | *(intentionally empty)* | "BoQ 1", "BoQ 2", etc. Primary row identifier. `flex: 1`. TODO: revisit with UX review. |
| `status` | Status | "Draft", "Approved" (more statuses to come). `width: 120` |
| `lastEdited` | Last Edited | Format: `YYYY-MM-DD HH:mm · Username` — mocked with hardcoded user. `width: 220` |

### Card

Uses the updated `Card` component (`children` passed directly through `CardContent`). Only non-empty location fields are rendered:

```jsx
<Card>
  <Typography>Project: {project.name}</Typography>
  <Typography>Number: {project.number}</Typography>
  {(project.address || project.city || project.county) && (
    <Typography>
      {[project.address, project.city, project.county].filter(Boolean).join(', ')}
    </Typography>
  )}
  {(project.state || project.zip) && (
    <Typography>{[project.state, project.zip].filter(Boolean).join(' ')}</Typography>
  )}
</Card>
```

---

## Out of Scope (Future Work)

- React Router / multi-page navigation (replaces `activeView` state in context)
- Backend API integration (replaces mock data and `"Auto-assigned"` number)
- Cascading location dropdowns (replaces free-text location fields)
- ZIP validation against location
- Authentication / real user names in "Last Edited"
- Additional BoQ status types beyond Draft and Approved
- Functional SearchBar in ProjectView
- Forward `...props` on `Card` to `DefaultCard` (pre-existing limitation)
