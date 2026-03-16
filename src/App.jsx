import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
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
