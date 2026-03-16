import { createTheme } from '@mui/material';
import { blue, green, grey, red } from '@mui/material/colors';

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
		success: {
			main: green[400],
			dark: green[600],
		},
		cancel: {
			main: grey[400],
			dark: grey[600],
		},
		divider: blue[400],
		sidebar: {
			background: '#584848ff',
		},
	},
	shape: {
		borderRadius: 10,
	},
	shadows: [
		'none', // shadows[0]
		'0 2px 4px rgba(0, 0, 0, 0.1)', // shadows[1]
		'0 4px 6px rgba(0, 0, 0, 0.15)', // shadows[2]
		'2px 4px 8px rgba(0, 0, 0, 0.7)', // shadows[3]
	],
	components: {
		// Targets all MUI Button components
		MuiButton: {
			// Custom variants: apply styles when specific props match
			variants: [
				{
					props: { role: 'confirm' }, // When role = 'confirm', apply these styles
					style: ({ theme }) => ({
						backgroundColor: theme.palette.success.main,
						'&:hover': {
							backgroundColor: theme.palette.success.dark,
						},
					}),
				},
				{
					props: { role: 'cancel' }, // When role = 'cancel', apply these styles
					style: ({ theme }) => ({
						backgroundColor: theme.palette.cancel.main,
						'&:hover': {
							backgroundColor: theme.palette.cancel.dark,
						},
					}),
				},
			],
			// Apply to ALL buttons regardless of props
			styleOverrides: {
				// "root" = the button's outer element
				root: ({ theme }) => ({
					borderRadius: `${theme.shape.borderRadius}px`,
					boxShadow: theme.shadows[3],
				}),
			},
		},
		// Targets all base input elements (used by TextField, Select, etc...)
		MuiInputBase: {
			styleOverrides: {
				// "input" = the actual <input> element
				input: ({ theme }) => ({
					backgroundColor: theme.palette.secondary.main,
				}),
			},
		},
		// Targets outlined variant inputs specifically (more specific than MuiInputBase)
		MuiOutlinedInput: {
			styleOverrides: {
				// The wrapper element
				root: {
					backgroundColor: 'transparent',
				},
				// The <input> inside
				input: {
					backgroundColor: 'transparent', // Transparent so root color shows
				},
			},
		},
		// Targets helper text below inputs
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					backgroundColor: green[300],
					margin: '3px',
				},
			},
		},
		MuiDataGrid: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: `${theme.shape.borderRadius}px`,
					boxShadow: theme.shadows[2],
					// '& .MuiDataGrid-columnHeader': {
					// 	backgroundColor: theme.palette.primary.light,
					// },
					// // Increase specificity with && or more specific selector
					// '&& .MuiDataGrid-row:hover': {
					// 	backgroundColor: 'rgba(223, 10, 10, 0.4)',
					// },
				}),
			},
		},
		MuiSnackbar: {
			defaultProps: {
				slotProps: {
					content: { elevation: 2 },
				},
			},
			styleOverrides: {
				root: ({ theme }) => ({
					boxShadow: theme.shadows[2],
				}),
			},
		},
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
		MuiDrawer: {
			styleOverrides: {
				paper: ({ theme }) => ({
					backgroundColor: theme.palette.background.paper,
					borderInlineEnd: `2px solid ${theme.palette.divider}`,
					width: 'fit-content',
					position: 'relative',
					paddingInlineEnd: '15px',
				}),
			},
		},
	},
});

export default theme;
