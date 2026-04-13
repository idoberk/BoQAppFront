# Barrel Import Fixes — New Project Dialog Feature

**Date:** 2026-03-17
**Scope:** Fix all `@mui/material` barrel imports and internal `components-lib/navigation` barrel imports across every file touched during the New Project Dialog feature.
**Rule:** `bundle-barrel-imports` (CRITICAL) — `@mui/material` barrel loads 2,225 modules. Direct imports load only what is used.

---

## Status of Already-Completed Work

The following feature changes were implemented in a prior session and do **not** need to be redone. Only the barrel import fixes below are outstanding.

| File | Feature Status | Import Status |
|------|---------------|---------------|
| `components-lib/navigation/NavItem.jsx` | ✅ onClick/button support done | ❌ barrel import remains |
| `components-lib/dialogs/Dialog.jsx` | ✅ children/actions/onClose/...props done | ❌ barrel import remains |
| `src/utils/palettes/DefaultPalette.js` | ✅ MuiDialog* theme overrides done | ❌ `createTheme` barrel import remains |
| `src/context/ProjectActionsContext.jsx` | ✅ complete | ✅ clean (React only) |
| `src/project/ProjectEngine.jsx` | ✅ complete | ✅ clean (no MUI) |
| `src/dashboard/components/NewProjectDialog.jsx` | ✅ complete | ❌ barrel imports remain |
| `src/project/ProjectView.jsx` | ✅ complete | ❌ barrel import remains |
| `src/App.jsx` | ✅ App/AppContent split done | ❌ barrel imports remain |

---

## Chunk 1 — Component Library Barrel Import Fixes

### Task 1 — Fix `components-lib/cards/Card.jsx`

Two changes: fix barrel import, remove dead `Typography` wrapper (Card should render `children` directly so callers control their own typography).

**File:** `components-lib/cards/Card.jsx`

```jsx
import styled from '@emotion/styled';
import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const DefaultCard = styled(MuiCard)``;

const Card = ({ children, ...props }) => {
	return (
		<DefaultCard {...props}>
			<CardContent>{children}</CardContent>
		</DefaultCard>
	);
};

export default Card;
```

Changes from current:
- `import { Card as _Card, CardContent } from '@mui/material'` → two direct imports (`MuiCard`, `CardContent`)
- `import Typography from '../typographies/Typography'` → **removed** (dead import after unwrapping)
- `<Typography>{children}</Typography>` → `{children}` (Card no longer forces Typography on content)
- `...props` spread added to `<DefaultCard>` so callers can pass MUI Card props

---

### Task 2 — Fix `components-lib/navigation/NavItem.jsx` (imports only)

Feature code (`onClick`/button support) is already correct. Only the import line changes.

**File:** `components-lib/navigation/NavItem.jsx`

Change line 2:
```jsx
// Before
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// After
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
```

Full file after fix:
```jsx
import styled from '@emotion/styled';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

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

---

### Task 3 — Fix `components-lib/dialogs/Dialog.jsx` (imports only)

Feature code (`children`/`actions`/`onClose`/`...props`) is already correct. Only the import line changes.

**File:** `components-lib/dialogs/Dialog.jsx`

Change lines 2–7:
```jsx
// Before
import {
	Dialog as _Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';

// After
import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
```

Full file after fix:
```jsx
import styled from '@emotion/styled';
import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const DefaultDialog = styled(MuiDialog)``;

const Dialog = ({
	dialogTitle,
	onClose,
	open,
	children,
	actions,
	...props
}) => {
	return (
		<DefaultDialog
			open={open}
			onClose={onClose}
			{...props}
		>
			<DialogTitle>{dialogTitle}</DialogTitle>
			{children && <DialogContent>{children}</DialogContent>}
			{actions && <DialogActions>{actions}</DialogActions>}
		</DefaultDialog>
	);
};

export default Dialog;
```

---

## Chunk 2 — Theme & App Barrel Import Fixes

### Task 4 — Fix `src/utils/palettes/DefaultPalette.js` (imports only)

`createTheme` must come from `@mui/material/styles`, not the root barrel. The colors imports (`@mui/material/colors`) are already direct paths and do not need to change.

**File:** `src/utils/palettes/DefaultPalette.js`

Change line 1:
```js
// Before
import { createTheme } from '@mui/material';

// After
import { createTheme } from '@mui/material/styles';
```

No other changes to this file.

---

### Task 5 — Fix `src/App.jsx`

Three barrel imports to fix, plus remove the large commented-out old `App` implementation (lines 1–48 of the current file).

**File:** `src/App.jsx`

```jsx
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import DashboardEngine from './dashboard/DashboardEngine';
import NewProjectDialog from './dashboard/components/NewProjectDialog';
import ProjectEngine from './project/ProjectEngine';
import theme from './utils/palettes/defaultPalette';
import CssClasses from './utils/CssClasses';
import {
	ProjectActionsProvider,
	useProjectActionsContext,
} from './context/ProjectActionsContext';
import NavItem from '../components-lib/navigation/NavItem';
import NavSection from '../components-lib/navigation/NavSection';
import Sidebar from '../components-lib/navigation/Sidebar';

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

Changes from current:
- `import { CssBaseline, ThemeProvider, Typography } from '@mui/material'` → three separate direct imports
- `ThemeProvider` moved to `@mui/material/styles`
- `import { NavItem, NavSection, Sidebar } from '../components-lib/navigation'` → three separate direct imports from individual files
- Old commented-out code block (lines 1–48) removed

---

## Chunk 3 — New Feature File Barrel Import Fixes

### Task 6 — Fix `src/dashboard/components/NewProjectDialog.jsx` (imports only)

Feature code is correct. Only line 2 changes.

**File:** `src/dashboard/components/NewProjectDialog.jsx`

Change line 2:
```jsx
// Before
import { Autocomplete, Grid, Typography } from '@mui/material';

// After
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
```

Full file after fix:
```jsx
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
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
			dialogTitle='Create New Project'
			onClose={closeNewProjectDialog}
			fullWidth
			maxWidth='sm'
			actions={
				<>
					<Button
						role='cancel'
						onClick={closeNewProjectDialog}
					>
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
			<Typography variant='subtitle2'>Location</Typography>
			<Grid
				container
				spacing={2}
			>
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
		</Dialog>
	);
};

export default NewProjectDialog;
```

---

### Task 7 — Fix `src/project/ProjectView.jsx` (imports only)

Feature code is correct. Only line 1 changes.

**File:** `src/project/ProjectView.jsx`

Change line 1:
```jsx
// Before
import { Typography } from '@mui/material';

// After
import Typography from '@mui/material/Typography';
```

Full file after fix:
```jsx
import Typography from '@mui/material/Typography';
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

---

## Verification Checklist

After all tasks are applied:

- [ ] `components-lib/cards/Card.jsx` — no `@mui/material` barrel; no Typography import; children rendered directly
- [ ] `components-lib/navigation/NavItem.jsx` — no `@mui/material` barrel; direct imports for ListItemButton, ListItemIcon, ListItemText
- [ ] `components-lib/dialogs/Dialog.jsx` — no `@mui/material` barrel; direct imports for Dialog, DialogActions, DialogContent, DialogTitle
- [ ] `src/utils/palettes/DefaultPalette.js` — `createTheme` from `@mui/material/styles`
- [ ] `src/App.jsx` — no `@mui/material` barrel; no navigation barrel; old commented-out block removed
- [ ] `src/dashboard/components/NewProjectDialog.jsx` — no `@mui/material` barrel; direct imports for Autocomplete, Grid, Typography
- [ ] `src/project/ProjectView.jsx` — no `@mui/material` barrel; Typography direct import
- [ ] `pnpm dev` starts without errors
- [ ] Clicking "New" in sidebar opens the Create New Project dialog
- [ ] Cancel closes dialog
- [ ] Filling in Project Name + at least one Type enables Create button
- [ ] Clicking Create navigates to Project page with correct metadata in Card
- [ ] Clicking Home navigates back to Dashboard
