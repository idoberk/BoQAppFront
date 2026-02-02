import styled from '@emotion/styled';
import Button from '../components-lib/buttons/Button';
import { FlexContainer } from '../components-lib/containers/FlexContainer';
import TextField from '../components-lib/inputs/textfields/TextField';
import DataGrid from '../components-lib/datagrids/DataGrid';

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
				<h2>Buttons:</h2>
				<ButtonContainer>
					<Button>Default</Button>
					<Button role='cancel'>Default</Button>
					<TextField
						label={'Filled variant'}
						helperText={'This is a helper text'}
						variant={'filled'}></TextField>
					<TextField label={'Outlined variant (default)'}></TextField>
					<DataGrid
						rows={rows}
						columns={columns}
						checkboxSelection></DataGrid>
				</ButtonContainer>
			</section>
		</div>
	);
};

export default DemoPage;
