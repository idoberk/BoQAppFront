import { ThemeProvider } from '@mui/material';
import DemoPage from './demo-page';
import theme from './utils/palettes/defaultPalette';
import { NavBar, NavItem, NavSection } from '../components-lib/navigation';

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<div
				style={{
					display: 'flex',
					height: '100vh',
					overflow: 'hidden',
				}}
			>
				<NavBar>
					<NavItem
						href='#'
						selected
					>
						Home
					</NavItem>
					<NavSection title='Management'>
						<NavItem href='#'>Projects</NavItem>
					</NavSection>
				</NavBar>
				<main style={{ flex: 1, overflowY: 'auto' }}>
					<DemoPage />
				</main>
			</div>
		</ThemeProvider>
	);
};

export default App;
