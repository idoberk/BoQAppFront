# New Project Dialog Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "New" nav item that opens a project creation dialog, and on submit navigates to a new Project page showing that project's BoQ list and metadata.

**Architecture:** A `ProjectActionsContext` (in `src/context/`) holds shared state (dialog open, active view, created project) and is consumed by the Sidebar trigger, the dialog form, and the App-level view switcher. App.jsx is split into `App` (providers only) and `AppContent` (context consumer). The project page follows the existing Engine/View pattern.

**Tech Stack:** React 19, MUI v7, Emotion, Vite, pnpm. No test framework is configured — all verification is done via `pnpm dev` in the browser.

**Spec:** `docs/superpowers/specs/2026-03-16-new-project-dialog-design.md`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `components-lib/navigation/NavItem.jsx` | Support `onClick`-only mode (no `href`) |
| Modify | `components-lib/dialogs/Dialog.jsx` | Accept `children`, `actions`, fix `onClose` |
| Modify | `components-lib/cards/Card.jsx` | Pass `children` through without Typography wrapper |
| Create | `src/context/ProjectActionsContext.jsx` | Context, Provider, `useProjectActionsContext` hook |
| Create | `src/dashboard/components/NewProjectDialog.jsx` | New project form dialog |
| Create | `src/project/ProjectEngine.jsx` | Mock BoQ data + passes to view |
| Create | `src/project/ProjectView.jsx` | SearchBar + DataGrid + project metadata Card |
| Modify | `src/App.jsx` | Split into `App` + `AppContent`; add "New" nav item; wire provider |

---

## Chunk 1: Component Library Changes

### Task 1: Update NavItem to support onClick-only mode

**Files:**
- Modify: `components-lib/navigation/NavItem.jsx`

**Why:** `NavItem` hardcodes `component='a'` and always passes `href`. The "New" and "Home" nav items need to call functions, not navigate. Passing `href` to a `<button>` is invalid HTML.

- [ ] **Step 1: Edit NavItem.jsx**

Replace the entire file content with:

```jsx
import styled from '@emotion/styled';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

const DefaultNavItem = styled(ListItemButton)``;

const NavItem = ({ href, icon, selected = false, children, ...props }) => {
	return (
		<DefaultNavItem
			component={href ? 'a' : 'button'}
			{...(href ? { href } : {})}
			selected={selected}
			{...props}
		>
			{icon && <ListItemIcon>{icon}</ListItemIcon>}
			<ListItemText
				primary={children}
				slotProps={{ primary: { noWrap: true } }}
			/>
		</DefaultNavItem>
	);
};

export default NavItem;
```

Key changes:
- `component={href ? 'a' : 'button'}` — renders as anchor when href provided, button otherwise
- `{...(href ? { href } : {})}` — only forwards `href` to the DOM element when defined
- `...props` still passes `onClick` through as before

- [ ] **Step 2: Start dev server and verify no errors**

```bash
pnpm dev
```

Open `http://localhost:5173`. The app should load without console errors. The existing sidebar nav items ("Home", "All Projects", "Estimates") should still look and behave the same as before.

- [ ] **Step 3: Commit**

```bash
git add components-lib/navigation/NavItem.jsx
git commit -m "feat(nav): support onClick-only mode on NavItem"
```

---

### Task 2: Update Dialog to support children, actions, and fix onClose

**Files:**
- Modify: `components-lib/dialogs/Dialog.jsx`

**Why:** The current Dialog renders only a title and ignores `onClose`. The `NewProjectDialog` needs to render form fields inside it and Cancel/Create buttons at the bottom.

- [ ] **Step 1: Edit Dialog.jsx**

Replace the entire file content with:

```jsx
import styled from '@emotion/styled';
import {
	Dialog as _Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';

const DefaultDialog = styled(_Dialog)``;

const Dialog = ({ dialogTitle, onClose, open, children, actions }) => {
	return (
		<DefaultDialog
			open={open}
			onClose={onClose}
		>
			<DialogTitle>{dialogTitle}</DialogTitle>
			{children && <DialogContent>{children}</DialogContent>}
			{actions && <DialogActions>{actions}</DialogActions>}
		</DefaultDialog>
	);
};

export default Dialog;
```

Key changes:
- Removed empty `handleClose` stub — `onClose` is now passed directly to `DefaultDialog`
- Added `children` rendered inside `DialogContent`
- Added `actions` prop rendered inside `DialogActions`
- Added `DialogContent` and `DialogActions` to MUI imports

- [ ] **Step 2: Verify dev server**

The app should still load without errors. The Dialog component is not currently rendered in the live app (the demo-page Dialog usage is commented out in `DashboardView.jsx`), so there is nothing to visually verify yet — that's expected.

- [ ] **Step 3: Commit**

```bash
git add components-lib/dialogs/Dialog.jsx
git commit -m "feat(dialog): add children/actions support, fix onClose wiring"
```

---

### Task 3: Update Card to remove Typography wrapper

**Files:**
- Modify: `components-lib/cards/Card.jsx`

**Why:** The current Card wraps all children in a single `<Typography>`, which prevents rendering multiple labeled fields inside it. The project metadata Card in `ProjectView` needs to render several separate `<Typography>` nodes.

- [ ] **Step 1: Edit Card.jsx**

Replace the entire file content with:

```jsx
import styled from '@emotion/styled';
import { Card as _Card, CardContent } from '@mui/material';

const DefaultCard = styled(_Card)``;

const Card = ({ children, ...props }) => {
	return (
		<DefaultCard>
			<CardContent>{children}</CardContent>
		</DefaultCard>
	);
};

export default Card;
```

Key changes:
- Removed `<Typography variant='body1'>` wrapper
- Removed the unused `import Typography from '../typographies/Typography'`
- `children` now render directly inside `CardContent`

- [ ] **Step 2: Verify dev server**

The app should load without errors. The demo-page is not currently rendered in the app, but if it were, the Card would now render its children as-is rather than wrapping them in Typography.

- [ ] **Step 3: Commit**

```bash
git add components-lib/cards/Card.jsx
git commit -m "feat(card): pass children through CardContent without Typography wrapper"
```

---

## Chunk 2: State Management + New Project Dialog

### Task 4: Create ProjectActionsContext

**Files:**
- Create: `src/context/ProjectActionsContext.jsx`

**Why:** The Sidebar "New" item and the dialog form are siblings in the component tree. A context at the App level provides shared state and actions to both without prop drilling.

- [ ] **Step 1: Create the directory and file**

Create `src/context/ProjectActionsContext.jsx`:

```jsx
import { createContext, useContext, useState } from 'react';

const ProjectActionsContext = createContext(null);

export const ProjectActionsProvider = ({ children }) => {
	const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
	const [activeView, setActiveView] = useState('dashboard');
	const [createdProject, setCreatedProject] = useState(null);

	const openNewProjectDialog = () => setIsNewProjectOpen(true);
	const closeNewProjectDialog = () => setIsNewProjectOpen(false);

	const createProject = (formData) => {
		setCreatedProject(formData);
		setActiveView('project');
		setIsNewProjectOpen(false);
	};

	const goToDashboard = () => setActiveView('dashboard');

	return (
		<ProjectActionsContext.Provider
			value={{
				isNewProjectOpen,
				activeView,
				createdProject,
				openNewProjectDialog,
				closeNewProjectDialog,
				createProject,
				goToDashboard,
			}}
		>
			{children}
		</ProjectActionsContext.Provider>
	);
};

export const useProjectActionsContext = () => {
	const context = useContext(ProjectActionsContext);
	if (!context) {
		throw new Error(
			'useProjectActionsContext must be used within ProjectActionsProvider'
		);
	}
	return context;
};
```

Initial values: `isNewProjectOpen = false`, `activeView = 'dashboard'`, `createdProject = null`.

- [ ] **Step 2: Verify the file compiles**

Save the file. If the dev server is running, it should hot-reload without errors. No visible change in the browser yet (the context is not wired into the app until Task 7).

- [ ] **Step 3: Commit**

```bash
git add src/context/ProjectActionsContext.jsx
git commit -m "feat(context): add ProjectActionsContext with provider and hook"
```

---

### Task 5: Create NewProjectDialog

**Files:**
- Create: `src/dashboard/components/NewProjectDialog.jsx`

**Why:** The form dialog for creating a new project. It consumes the context directly for its actions, and manages its own ephemeral form state locally.

- [ ] **Step 1: Create the directory**

```bash
mkdir -p "c:/BoQApp/Front/src/dashboard/components"
```

- [ ] **Step 2: Create NewProjectDialog.jsx**

Create `src/dashboard/components/NewProjectDialog.jsx`:

```jsx
import { useState } from 'react';
import { Autocomplete, Typography } from '@mui/material';
import Button from '../../../components-lib/buttons/Button';
import Dialog from '../../../components-lib/dialogs/Dialog';
import TextField from '../../../components-lib/inputs/textfields/TextField';
import { useProjectActionsContext } from '../../context/ProjectActionsContext';

const PROJECT_TYPES = [
	'Residential',
	'Commercial',
	'Industrial',
	'Infrastructure',
	'Renovation',
	'Healthcare',
	'Educational',
	'Mixed-Use',
];

const NewProjectDialog = () => {
	const { closeNewProjectDialog, createProject } = useProjectActionsContext();

	const [name, setName] = useState('');
	const [types, setTypes] = useState([]);
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [county, setCounty] = useState('');
	const [state, setState] = useState('');
	const [zip, setZip] = useState('');

	const isValid = name.trim() !== '' && types.length > 0;

	const handleCreate = () => {
		createProject({
			name: name.trim(),
			number: 'Auto-assigned',
			types,
			address,
			city,
			county,
			state,
			zip,
		});
	};

	return (
		<Dialog
			open={true}
			dialogTitle='New Project'
			onClose={closeNewProjectDialog}
			actions={
				<>
					<Button role='cancel' onClick={closeNewProjectDialog}>
						Cancel
					</Button>
					<Button
						role='confirm'
						disabled={!isValid}
						onClick={handleCreate}
					>
						Create
					</Button>
				</>
			}
		>
			<TextField
				label='Project Name'
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
				fullWidth
			/>
			<TextField
				label='Project Number'
				value='Auto-assigned'
				disabled
				fullWidth
			/>
			<Autocomplete
				multiple
				options={PROJECT_TYPES}
				value={types}
				onChange={(_, newValue) => setTypes(newValue)}
				renderInput={(params) => (
					<TextField
						{...params}
						label='Project Type(s)'
						required
					/>
				)}
			/>
			<Typography
				variant='subtitle2'
				sx={{ mt: 1 }}
			>
				Location
			</Typography>
			<TextField
				label='Street Address'
				value={address}
				onChange={(e) => setAddress(e.target.value)}
				fullWidth
			/>
			<TextField
				label='City / Town'
				value={city}
				onChange={(e) => setCity(e.target.value)}
				fullWidth
			/>
			<TextField
				label='County'
				value={county}
				onChange={(e) => setCounty(e.target.value)}
				fullWidth
			/>
			<TextField
				label='State'
				value={state}
				onChange={(e) => setState(e.target.value)}
				fullWidth
			/>
			<TextField
				label='ZIP'
				value={zip}
				onChange={(e) => setZip(e.target.value)}
				fullWidth
			/>
		</Dialog>
	);
};

export default NewProjectDialog;
```

Import paths from `src/dashboard/components/`:
- `../../../components-lib/` — 3 levels up to project root, then into `components-lib`
- `../../context/ProjectActionsContext` — 2 levels up to `src/`, then into `context/`

- [ ] **Step 3: Verify the file compiles**

The dev server should hot-reload without errors. The dialog is not yet reachable in the UI (App.jsx hasn't been updated yet).

- [ ] **Step 4: Commit**

```bash
git add src/dashboard/components/NewProjectDialog.jsx
git commit -m "feat(dialog): create NewProjectDialog form component"
```

---

## Chunk 3: Project Page + App Wiring

### Task 6: Create ProjectEngine and ProjectView

**Files:**
- Create: `src/project/ProjectEngine.jsx`
- Create: `src/project/ProjectView.jsx`

**Why:** The destination page after a project is created. Follows the same Engine/View pattern as the Dashboard.

- [ ] **Step 1: Create ProjectEngine.jsx**

Create `src/project/ProjectEngine.jsx`:

```jsx
import ProjectView from './ProjectView';

const mockRows = [
	{
		id: 1,
		name: 'BoQ 1',
		status: 'Draft',
		lastEdited: '2026-03-15 09:30 · John D',
	},
	{
		id: 2,
		name: 'BoQ 2',
		status: 'Approved',
		lastEdited: '2026-03-14 14:00 · John D',
	},
];

const ProjectEngine = ({ project }) => {
	return (
		<ProjectView
			rows={mockRows}
			project={project}
		/>
	);
};

export default ProjectEngine;
```

Each row has an `id` field as required by MUI DataGrid.

- [ ] **Step 2: Create ProjectView.jsx**

Create `src/project/ProjectView.jsx`:

```jsx
import { Typography } from '@mui/material';
import Card from '../../components-lib/cards/Card';
import { FlexContainer } from '../../components-lib/containers/Containers';
import DataGrid from '../../components-lib/datagrids/DataGrid';
import SearchBar from '../../components-lib/inputs/textfields/SearchBar';

const columns = [
	{ field: 'name', headerName: '', flex: 1 },
	{ field: 'status', headerName: 'Status', width: 120 },
	{ field: 'lastEdited', headerName: 'Last Edited', width: 220 },
];

const ProjectView = ({ rows, project }) => {
	return (
		<FlexContainer style={{ justifyContent: 'center' }}>
			<SearchBar />
			<DataGrid
				rows={rows}
				columns={columns}
			/>
			<Card>
				<Typography>Project: {project.name}</Typography>
				<Typography>Number: {project.number}</Typography>
				{(project.address || project.city || project.county) && (
					<Typography>
						{[project.address, project.city, project.county]
							.filter(Boolean)
							.join(', ')}
					</Typography>
				)}
				{(project.state || project.zip) && (
					<Typography>
						{[project.state, project.zip].filter(Boolean).join(' ')}
					</Typography>
				)}
			</Card>
		</FlexContainer>
	);
};

export default ProjectView;
```

Import paths from `src/project/`:
- `../../components-lib/` — 2 levels up to project root, same as `DashboardView`

- [ ] **Step 3: Verify the files compile**

The dev server should hot-reload without errors. The project page is not yet reachable in the UI.

- [ ] **Step 4: Commit**

```bash
git add src/project/ProjectEngine.jsx src/project/ProjectView.jsx
git commit -m "feat(project): create ProjectEngine and ProjectView components"
```

---

### Task 7: Update App.jsx — wire everything together

**Files:**
- Modify: `src/App.jsx`

**Why:** `App` needs to be split into `App` (providers) and `AppContent` (context consumer) because `useProjectActionsContext()` must be called inside a descendant of `ProjectActionsProvider`. The "New" nav item is added, view switching is wired up, and `NewProjectDialog` is conditionally rendered.

- [ ] **Step 1: Replace App.jsx**

Replace the entire content of `src/App.jsx` with:

```jsx
import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
import DashboardEngine from './dashboard/DashboardEngine';
import NewProjectDialog from './dashboard/components/NewProjectDialog';
import ProjectEngine from './project/ProjectEngine';
import theme from './utils/palettes/defaultPalette';
import CssClasses from './utils/CssClasses';
import {
	ProjectActionsProvider,
	useProjectActionsContext,
} from './context/ProjectActionsContext';
import {
	NavItem,
	NavSection,
	Sidebar,
} from '../components-lib/navigation';

const AppContent = () => {
	const {
		activeView,
		createdProject,
		isNewProjectOpen,
		openNewProjectDialog,
		goToDashboard,
	} = useProjectActionsContext();

	return (
		<CssClasses>
			<Sidebar
				header={
					<Typography
						variant='h6'
						fontWeight='bold'
					>
						BoQApp
					</Typography>
				}
			>
				<NavItem
					onClick={goToDashboard}
					selected={activeView === 'dashboard'}
				>
					Home
				</NavItem>
				<NavSection title='Projects'>
					<NavItem onClick={openNewProjectDialog}>New</NavItem>
					<NavItem href='#'>All Projects</NavItem>
					<NavItem href='#'>Estimates</NavItem>
				</NavSection>
			</Sidebar>

			<main style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
				{activeView === 'dashboard' ? (
					<DashboardEngine />
				) : (
					<ProjectEngine project={createdProject} />
				)}
			</main>

			{isNewProjectOpen && <NewProjectDialog />}
		</CssClasses>
	);
};

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<ProjectActionsProvider>
				<AppContent />
			</ProjectActionsProvider>
		</ThemeProvider>
	);
};

export default App;
```

Removed from original `App.jsx`:
- `import DemoPage from './demo-page'` — unused import
- `import { NavBar, ... }` — `NavBar` was imported but unused; removed from the destructure
- The hardcoded `selected` prop on "Home" is now dynamic

- [ ] **Step 2: Verify the app loads correctly**

```bash
pnpm dev
```

Open `http://localhost:5173`. Verify:
1. The sidebar renders with Home, and a Projects section containing New, All Projects, Estimates
2. The dashboard (DataGrid) is visible on initial load
3. The "Home" nav item is visually selected (highlighted)
4. No console errors

- [ ] **Step 3: Test the full "New Project" flow**

In the browser:

1. Click **"New"** in the sidebar
   - Expected: "New Project" dialog opens with all form fields visible
   - Expected: the "Create" button is disabled (greyed out)

2. Type a name in "Project Name"
   - Expected: "Create" remains disabled (no types selected yet)

3. Click the "Project Type(s)" field and select at least one type (e.g. "Residential")
   - Expected: "Create" button becomes enabled

4. Fill in some location fields (optional)

5. Click **"Create"**
   - Expected: dialog closes, view switches to the Project page
   - Expected: DataGrid shows "BoQ 1 (Draft)" and "BoQ 2 (Approved)" rows
   - Expected: Card below shows the project name, number, and any entered location

6. Click **"Home"** in the sidebar
   - Expected: view switches back to the dashboard (DataGrid with Concrete/Rebar rows)
   - Expected: "Home" nav item is visually selected again

7. Click **"New"** again and click **"Cancel"** (or press Escape, or click the backdrop)
   - Expected: dialog closes, form is empty (no previously entered values)

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(app): wire ProjectActionsContext, new project dialog, and project page"
```

---

## Verification Checklist

After all tasks are complete, do a final pass through the app:

- [ ] Sidebar "Home" is selected on load, deselects when on the project page
- [ ] Clicking "New" opens the dialog; clicking it again after returning to dashboard resets the form
- [ ] Create button disabled until both Project Name and at least one Project Type are filled
- [ ] Cancel, Escape, and backdrop click all close the dialog without navigating
- [ ] After Create: project page shows correct name in the Card
- [ ] After Create: location fields in Card only show non-empty values
- [ ] "Home" returns to the dashboard from the project page
- [ ] No React console warnings (check browser DevTools > Console)
