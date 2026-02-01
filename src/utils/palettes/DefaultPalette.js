import { createTheme } from '@mui/material';
import { blue, green, red } from '@mui/material/colors';

const theme = createTheme({
	palette: {
		primary: {
			main: blue[400],
			light: blue[200],
			dark: blue[700],
		},
		secondary: {
			main: red[300],
		},
	},
	shape: {
		borderRadius: 10,
	},
	shadows: [
		'none', // shadows[0]
		'0 2px 4px rgba(0, 0, 0, 0.1)', // shadows[1]
		'0 2px 4px rgba(0, 0, 0, 0.1)', // shadows[2]
		'2px 4px 8px rgba(0, 0, 0, 0.7)', // shadows[3]
	],
	components: {
		MuiButton: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: `${theme.shape.borderRadius}px`,
					boxShadow: theme.shadows[3],
				}),
			},
		},
		MuiInputBase: {
			styleOverrides: {
				input: ({ theme }) => ({
					backgroundColor: theme.palette.secondary.main,
				}),
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					backgroundColor: red[700],
				},
				input: {
					backgroundColor: 'transparent',
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					backgroundColor: green[300],
					margin: '3px',
				},
			},
		},
	},
});

export default theme;
