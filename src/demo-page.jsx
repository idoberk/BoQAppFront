import styled from '@emotion/styled';
import Button from '../components-lib/buttons/Button';
import {
	CenteredContainer,
	FlexContainer,
} from '../components-lib/containers/Containers';
import TextField from '../components-lib/inputs/textfields/TextField';
import DataGrid from '../components-lib/datagrids/DataGrid';
import Card from '../components-lib/cards/Card';
import SearchBar from '../components-lib/inputs/textfields/SearchBar';
import Snackbar from '../components-lib/snackbars/Snackbar';
import Dialog from '../components-lib/dialogs/Dialog';

const ButtonContainer = styled(FlexContainer)`
	gap: 30px;
`;

const columns = [
	{ field: 'itemNumber', headerName: 'Item #', width: 100 },
	{ field: 'description', headerName: 'Description', flex: 1 },
	{ field: 'unit', headerName: 'Unit', width: 80 },
	{ field: 'quantity', headerName: 'Qty', type: 'number', width: 100 },
	{ field: 'unitCost', headerName: 'Unit Cost', type: 'number', width: 120 },
	{ field: 'cost', headerName: 'Cost', type: 'number', width: 120 },
];

const rows = [
	{
		id: 1,
		itemNumber: '1.1',
		description: 'Concrete',
		unit: 'CY',
		quantity: 100,
		unitCost: 150,
		cost: 15000,
	},
	{
		id: 2,
		itemNumber: '1.2',
		description: 'Rebar',
		unit: 'LB',
		quantity: 5000,
		unitCost: 0.75,
		cost: 3750,
	},
];

const DemoPage = () => {
	return (
		<div style={{ padding: '2rem' }}>
			<h1>Component Library Demo</h1>
			<section style={{ marginBottom: '2rem' }}>
				<h2>Search bar:</h2>
				<CenteredContainer $width='75%'>
					<SearchBar />
				</CenteredContainer>
				<h2>Buttons:</h2>
				<FlexContainer $gap='30px'>
					<Button>Default</Button>
					<Button role='cancel'>Default</Button>
					<h2>Text Inputs:</h2>
					<TextField
						label='Filled variant'
						helperText='This is a helper text'
						variant='filled'
					></TextField>
					<TextField label='Outlined variant (default)'></TextField>
				</FlexContainer>
				<h2>DataGrid:</h2>
				<DataGrid
					rows={rows}
					columns={columns}
					checkboxSelection
				></DataGrid>
				<h2>Card:</h2>
				<Card>
					This is a Typography inside a Card. Maybe could be used for
					the Home Dashboard Menu Panel
				</Card>
				<Snackbar message='I am a Snackbar' />
				<Dialog dialogTitle='I am a Dialog'></Dialog>
			</section>
			{/* <div
				style={{
					display: 'flex',
					height: '400px',
					border: '1px solid #ccc',
				}}
			>
				<NavBar width={250}>
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
			</div> */}
		</div>
	);
};

export default DemoPage;
