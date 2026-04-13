# New Project Dialog Improvements — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the New Project Dialog by centralizing all form-layout styling into the MUI theme and creating a validation utility module with placeholder functions ready for future rules.

**Architecture:** All structural styling for dialog content (spacing between fields) moves into a `MuiDialogContent` theme override in `DefaultPalette.js` — no `sx` props needed in the form component. `Dialog.jsx` gets a one-line change to forward extra props (e.g. `fullWidth`, `maxWidth`) to MUI's Dialog. `NewProjectDialog.jsx` shrinks: it only declares sizing props and delegates validation logic to a new dedicated file. The validation file (`src/utils/validation/projectValidation.js`) is a stub module — all functions exist and are imported, but no rules are enforced yet.

**Tech Stack:** React 19, MUI v7, Emotion, Vite, pnpm. No test framework configured — verification is done via `pnpm dev` in the browser.

**Previous plan:** `docs/plan/2026-03-16-new-project-dialog.md` (initial dialog implementation — already done)

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/utils/palettes/DefaultPalette.js` | Add `MuiDialogContent` theme override: flex column layout with gap for automatic form-field spacing |
| Modify | `components-lib/dialogs/Dialog.jsx` | Spread `...props` so consumers can pass `fullWidth`, `maxWidth`, etc. |
| Modify | `src/dashboard/components/NewProjectDialog.jsx` | Add `fullWidth maxWidth="sm"`; remove `sx` from Typography; delegate `isValid` to validation module |
| Create | `src/utils/validation/projectValidation.js` | Placeholder validation functions for all project form fields |

---

## Chunk 1: Centralize Dialog Form Styling

### Task 1: Add MuiDialogContent theme override

**Files:**
- Modify: `src/utils/palettes/DefaultPalette.js`

**Why:** Right now `DialogContent` uses default block layout, so form fields inside any dialog stack with no vertical spacing. Adding a `MuiDialogContent` override with `display: flex; flex-direction: column; gap` means every dialog automatically gets proper field spacing — no `sx` props needed in any form component.

- [ ] **Step 1: Open `src/utils/palettes/DefaultPalette.js` and add the override**

Inside the `components` object, add `MuiDialogContent` after `MuiDialog` (around line 138):

```js
MuiDialogContent: {
    styleOverrides: {
        root: ({ theme }) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
        }),
    },
},
```

The full `components` block should now end:

```js
        MuiDialog: {
            defaultProps: {
                slotProps: {
                    paper: { elevation: 2 },
                },
            },
            styleOverrides: {
                root: ({ theme }) => ({
                    boxShadow: theme.shadows[2],
                }),
            },
        },
        MuiDialogContent: {
            styleOverrides: {
                root: ({ theme }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing(2),
                }),
            },
        },
        MuiDrawer: {
            // ... existing
        },
```

- [ ] **Step 2: Verify in the browser**

```bash
pnpm dev
```

Open the app, click "New" in the sidebar to open the dialog. The form fields should now have uniform 16px vertical gaps between them without any change to the form component.

Before vs. after:
- Before: fields are flush against each other (no margin between them)
- After: each field has a visible gap below it, including between the "Location" Typography label and the fields around it

- [ ] **Step 3: Commit**

```bash
git add src/utils/palettes/DefaultPalette.js
git commit -m "feat(theme): add MuiDialogContent flex-column layout with gap for form field spacing"
```

---

### Task 2: Spread extra props in Dialog.jsx

**Files:**
- Modify: `components-lib/dialogs/Dialog.jsx`

**Why:** The Dialog wrapper currently accepts only a fixed set of named props. Consumers have no way to pass MUI Dialog props like `fullWidth` or `maxWidth` through to the underlying MUI Dialog. Adding `...props` spread fixes this without changing any existing behavior.

- [ ] **Step 1: Edit `components-lib/dialogs/Dialog.jsx`**

Change the destructure and `DefaultDialog` usage:

```jsx
// Before:
const Dialog = ({ dialogTitle, onClose, open, children, actions }) => {
    return (
        <DefaultDialog
            open={open}
            onClose={onClose}
        >

// After:
const Dialog = ({ dialogTitle, onClose, open, children, actions, ...props }) => {
    return (
        <DefaultDialog
            open={open}
            onClose={onClose}
            {...props}
        >
```

The rest of the file is unchanged.

- [ ] **Step 2: Verify no regressions**

The dialog should open and close exactly as before. No visual change expected yet — `fullWidth`/`maxWidth` are not passed by any consumer until Task 3.

- [ ] **Step 3: Commit**

```bash
git add components-lib/dialogs/Dialog.jsx
git commit -m "feat(dialog): spread extra props to MUI Dialog for fullWidth/maxWidth support"
```

---

### Task 3: Clean up NewProjectDialog.jsx

**Files:**
- Modify: `src/dashboard/components/NewProjectDialog.jsx`

**Why:** Two small changes to make the component cleaner now that the theme and validation module handle those concerns:
1. Add `fullWidth maxWidth="sm"` — gives the dialog a consistent, well-proportioned width (≈600px). Without this, MUI Dialog width is uncontrolled.
2. Remove `sx={{ mt: 1 }}` from the "Location" `Typography` — the MuiDialogContent gap now handles spacing, so the inline `sx` is redundant.
3. Replace the inline `isValid` expression with a call to `isProjectFormValid` from the validation module (created in Task 4). Import is added in this step; the function itself is created next.

> **Note:** Tasks 3 and 4 are coupled — after this step the app will fail to compile until Task 4 creates the validation file. Complete both tasks before running the dev server.

- [ ] **Step 1: Edit `src/dashboard/components/NewProjectDialog.jsx`**

**a) Add the import at the top:**

```jsx
import { isProjectFormValid } from '../../utils/validation/projectValidation';
```

Add this after the existing imports, before the `PROJECT_TYPES` constant.

**b) Replace the inline `isValid` line:**

```jsx
// Before:
const isValid = name.trim() !== '' && types.length > 0;

// After:
const isValid = isProjectFormValid({ name, types });
```

**c) Add `fullWidth` and `maxWidth` to the Dialog element:**

```jsx
// Before:
<Dialog
    open={true}
    dialogTitle='Create New Project'
    onClose={closeNewProjectDialog}
    actions={...}
>

// After:
<Dialog
    open={true}
    dialogTitle='Create New Project'
    onClose={closeNewProjectDialog}
    fullWidth
    maxWidth='sm'
    actions={...}
>
```

**d) Remove the `sx` prop from the "Location" Typography:**

```jsx
// Before:
<Typography
    variant='subtitle2'
    sx={{ mt: 1 }}
>
    Location
</Typography>

// After:
<Typography variant='subtitle2'>
    Location
</Typography>
```

- [ ] **Step 2: Proceed immediately to Task 4**

Do not run the dev server yet — the `isProjectFormValid` import will cause a compile error until the file exists.

---

## Chunk 2: Validation Infrastructure

### Task 4: Create the project validation module

**Files:**
- Create: `src/utils/validation/projectValidation.js`

**Why:** Centralizes all future validation logic for the project form in one place. Functions are stubs now — they always return valid — but they define the interface and import point so adding real rules later is a one-file change.

- [ ] **Step 1: Create `src/utils/validation/` directory and file**

Create `src/utils/validation/projectValidation.js` with the following content:

```js
/**
 * Validation utilities for the New Project form.
 *
 * All validators return { isValid: boolean, error: string | null }.
 * Stubs return isValid: true until rules are implemented.
 */

/**
 * Project Name: required, non-empty.
 * Future rules: min/max length, no special characters, etc.
 */
export const validateProjectName = (name) => {
	if (!name || name.trim() === '') {
		return { isValid: false, error: 'Project name is required.' };
	}
	return { isValid: true, error: null };
};

/**
 * Project Types: at least one type must be selected.
 * Future rules: max number of types, allowed combinations, etc.
 */
export const validateProjectTypes = (types) => {
	if (!types || types.length === 0) {
		return { isValid: false, error: 'At least one project type is required.' };
	}
	return { isValid: true, error: null };
};

/**
 * ZIP code: optional field.
 * Future rules: US ZIP format (5 digits or ZIP+4), etc.
 */
export const validateZip = (_zip) => {
	return { isValid: true, error: null };
};

/**
 * State: optional field.
 * Future rules: 2-letter US state abbreviation, etc.
 */
export const validateState = (_state) => {
	return { isValid: true, error: null };
};

/**
 * Determines if the entire project form is valid enough to submit.
 * Only checks fields required for creation (name + types).
 */
export const isProjectFormValid = ({ name, types }) => {
	return (
		validateProjectName(name).isValid && validateProjectTypes(types).isValid
	);
};
```

- [ ] **Step 2: Verify the app compiles and works**

```bash
pnpm dev
```

Open the app. Verify:
1. No console errors on load
2. Click "New" in the sidebar — the dialog opens
3. The dialog is now visibly wider (≈600px, `maxWidth="sm"`)
4. Form fields have uniform vertical spacing between them
5. The "Location" label has the same gap above it as any other field (no extra top margin)
6. The "Create" button is disabled initially
7. Fill in Project Name + at least one Project Type → "Create" button enables
8. Submit the form → navigates to the project page as before

- [ ] **Step 3: Commit**

```bash
git add src/utils/validation/projectValidation.js src/dashboard/components/NewProjectDialog.jsx
git commit -m "feat(validation): add project validation module; use in NewProjectDialog"
```

---

## Chunk 3: Location Field Layout

### Task 5: Arrange location fields in a two-column Grid

**Files:**
- Modify: `src/dashboard/components/NewProjectDialog.jsx`

**Why:** The top three fields (Project Name, Number, Type) are full-width (`fullWidth` as direct children of `DialogContent`). The location fields should be visually narrower to match the design intent. Wrapping them in an MUI `Grid` container and assigning each field a column size achieves this without any `sx` props — the width comes from the Grid's column count, not inline styles.

**Layout:**
- Street Address: full Grid width (`size={12}`) — spans the full row
- City / Town + County: share one row (`size={7}` + `size={5}`)
- State + ZIP: share one row (`size={6}` + `size={6}`)

All location fields use `fullWidth` inside their Grid item, so they fill their column. City and State being wider columns reflects that they typically hold longer values; County and ZIP are narrower.

> **Note:** `Grid` from `@mui/material` in MUI v7 uses the `size` prop (not `xs`/`sm`). This is the new unified Grid API.

- [ ] **Step 1: Add `Grid` to the MUI import in `NewProjectDialog.jsx`**

```jsx
// Before:
import { Autocomplete, Typography } from '@mui/material';

// After:
import { Autocomplete, Grid, Typography } from '@mui/material';
```

- [ ] **Step 2: Replace the five stacked location TextFields with a Grid layout**

Replace everything from `<TextField label='Street Address'` through the closing `</TextField>` of the ZIP field with:

```jsx
<Grid container spacing={2}>
    <Grid size={12}>
        <TextField
            label='Street Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
        />
    </Grid>
    <Grid size={7}>
        <TextField
            label='City / Town'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
        />
    </Grid>
    <Grid size={5}>
        <TextField
            label='County'
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            fullWidth
        />
    </Grid>
    <Grid size={6}>
        <TextField
            label='State'
            value={state}
            onChange={(e) => setState(e.target.value)}
            fullWidth
        />
    </Grid>
    <Grid size={6}>
        <TextField
            label='ZIP'
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            fullWidth
        />
    </Grid>
</Grid>
```

The full location section in `NewProjectDialog.jsx` should now look like:

```jsx
<Typography variant='subtitle2'>Location</Typography>
<Grid container spacing={2}>
    <Grid size={12}>
        <TextField
            label='Street Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
        />
    </Grid>
    <Grid size={7}>
        <TextField
            label='City / Town'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
        />
    </Grid>
    <Grid size={5}>
        <TextField
            label='County'
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            fullWidth
        />
    </Grid>
    <Grid size={6}>
        <TextField
            label='State'
            value={state}
            onChange={(e) => setState(e.target.value)}
            fullWidth
        />
    </Grid>
    <Grid size={6}>
        <TextField
            label='ZIP'
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            fullWidth
        />
    </Grid>
</Grid>
```

- [ ] **Step 3: Verify in the browser**

```bash
pnpm dev
```

Open the dialog. Verify:
1. Project Name, Project Number, Project Type(s) still span the full dialog width
2. Street Address spans the full width (Grid row)
3. City / Town and County sit side by side (City ~58%, County ~42%)
4. State and ZIP sit side by side (50/50)
5. The `spacing={2}` inside the Grid matches the `gap` between other fields visually
6. No React console warnings

- [ ] **Step 4: Commit**

```bash
git add src/dashboard/components/NewProjectDialog.jsx
git commit -m "feat(dialog): arrange location fields in two-column Grid layout"
```

---

## Chunk 4: Dialog UX Polish

All three fixes in this chunk are changes to `src/utils/palettes/DefaultPalette.js` only.

### Task 6: Fix floating label overlap with DialogTitle

**Files:**
- Modify: `src/utils/palettes/DefaultPalette.js`

**Why:** MUI ships a built-in CSS rule with an adjacent sibling selector: `.MuiDialogTitle-root + .MuiDialogContent-root { padding-top: 0 }`. This selector has higher specificity than a plain class rule, so it silently wins over our `padding: '15px'` override. The result: the first field sits at the very top edge of `DialogContent`, leaving no room for the floating label to move upward on focus — it clips into the `DialogTitle` area instead. Using `!important` is the direct, explicit way to override a specificity mismatch from a third-party library.

- [ ] **Step 1: Add `paddingTop: '20px !important'` to the `MuiDialogContent` root override**

In `DefaultPalette.js`, update `MuiDialogContent.styleOverrides.root`:

```js
MuiDialogContent: {
    styleOverrides: {
        root: ({ theme }) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(3),
            padding: '15px',
            paddingTop: '20px !important', // Overrides MUI's adjacent-sibling rule that zeroes this out
            margin: '15px',
            flex: '1 1 auto',
            overflowY: 'auto',
        }),
    },
},
```

- [ ] **Step 2: Verify in the browser**

Open the dialog, click into the "Project Name" field. The floating label should animate upward and sit cleanly above the input border — with visible space between it and the dialog title above.

- [ ] **Step 3: Commit**

```bash
git add src/utils/palettes/DefaultPalette.js
git commit -m "fix(theme): fix floating label overlap and restore DialogContent scroll flex properties"
```

---

### Task 7: Fix dialog responsiveness on smaller viewport (scrollable content)

**Why:** Setting `display: flex; flex-direction: column` on `MuiDialogContent` (Task 1) removed MUI's default `flex: 1 1 auto` and `overflowY: auto` that the Dialog Paper relies on to contain and scroll its content. Without those, the `DialogContent` grows unbounded and overflows the Dialog Paper instead of scrolling inside it. The `flex: '1 1 auto'` and `overflowY: 'auto'` properties were already added in Task 6's code snippet — this task is the verification step for that fix.

> **Note:** This task has no separate code step — `flex: '1 1 auto'` and `overflowY: 'auto'` are already included in Task 6's `MuiDialogContent` update above.

- [ ] **Step 1: Verify responsive behaviour on a constrained viewport**

In Chrome DevTools (F12), open the device toolbar and set the viewport to `1280x720` (simulates a 1920x1080 display at 150% scale). Open the dialog. Verify:

1. The `DialogTitle` ("Create New Project") is always visible at the top
2. The `DialogActions` (Cancel / Create buttons) are always visible at the bottom
3. The form fields between them scroll independently when they overflow
4. On a full-size viewport (1920x1080) the dialog still fits without scrolling

---

### Task 8: Place Cancel and Create buttons on opposing sides

**Files:**
- Modify: `src/utils/palettes/DefaultPalette.js`

**Why:** The default MUI `DialogActions` uses `justify-content: flex-end`, which clusters all buttons in the bottom-right corner. Adding `justifyContent: 'space-between'` pushes the first child (Cancel) to the left and the last child (Create) to the right, without any changes to `NewProjectDialog.jsx`.

- [ ] **Step 1: Add `justifyContent: 'space-between'` to the `MuiDialogActions` root override**

```js
MuiDialogActions: {
    styleOverrides: {
        root: {
            padding: '15px',
            justifyContent: 'space-between',
        },
    },
},
```

- [ ] **Step 2: Verify in the browser**

Open the dialog. The Cancel button should sit in the bottom-left corner of the dialog; the Create button in the bottom-right.

- [ ] **Step 3: Commit**

```bash
git add src/utils/palettes/DefaultPalette.js
git commit -m "feat(theme): space dialog action buttons to opposing sides"
```

---

## Verification Checklist

After all tasks are complete:

- [ ] Dialog opens at `maxWidth="sm"` width — noticeably wider than before
- [ ] All form fields have consistent vertical gaps — no `sx` props in `NewProjectDialog.jsx`
- [ ] "Location" Typography label has no extra margin — gap alone provides the spacing
- [ ] Top 3 fields (Name, Number, Type) span the full dialog width
- [ ] Location fields are in a Grid: Street Address full-width, City+County side by side, State+ZIP side by side
- [ ] Focused "Project Name" label floats above the input without clipping into the dialog title
- [ ] On a 1280×720 viewport: title and action buttons stay fixed; form content scrolls independently
- [ ] Cancel button is bottom-left, Create button is bottom-right
- [ ] "Create" button disabled until name + type filled — behavior unchanged
- [ ] Submitting the form navigates to the project page — behavior unchanged
- [ ] No React warnings in browser DevTools Console
- [ ] `NewProjectDialog.jsx` has zero `sx` props
- [ ] `src/utils/validation/projectValidation.js` exists with all five exports: `validateProjectName`, `validateProjectTypes`, `validateZip`, `validateState`, `isProjectFormValid`
