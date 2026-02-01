import { ThemeProvider } from '@mui/material';
import DemoPage from './demo-page';
import theme from './utils/palettes/defaultPalette';

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<DemoPage />
		</ThemeProvider>
	);
};

export default App;
