/* import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
import DemoPage from './demo-page';
import theme from './utils/palettes/defaultPalette';
import {
	NavBar,
	NavItem,
	NavSection,
	Sidebar,
} from '../components-lib/navigation';
import DashboardEngine from './dashboard/DashboardEngine';
import CssClasses from './utils/CssClasses';

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
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
						href='#'
						selected
					>
						Home
					</NavItem>
					<NavSection title='Projects'>
						<NavItem href='#'>All Projects</NavItem>
						<NavItem href='#'>Estimates</NavItem>
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
 */

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
import { NavItem, NavSection, Sidebar } from '../components-lib/navigation';

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
