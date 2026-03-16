import { FlexContainer } from '../../components-lib/containers/Containers';
import DataGrid from '../../components-lib/datagrids/DataGrid';
import SearchBar from '../../components-lib/inputs/textfields/SearchBar';
import Dialog from '../../components-lib/dialogs/Dialog';

const columns = [
	{ field: 'itemNumber', headerName: 'Item #', width: 100 },
	{ field: 'description', headerName: 'Description', flex: 1 },
	{ field: 'unit', headerName: 'Unit', width: 80 },
	{ field: 'quantity', headerName: 'Qty', type: 'number', width: 100 },
	{ field: 'unitCost', headerName: 'Unit Cost', type: 'number', width: 120 },
	{ field: 'cost', headerName: 'Cost', type: 'number', width: 120 },
];

const DashboardView = ({ rows }) => {
	return (
		<FlexContainer style={{ justifyContent: 'center' }}>
			<SearchBar />
			<DataGrid
				rows={rows}
				columns={columns}
				checkboxSelection
			/>
			{/* <Dialog
				open
				dialogTitle='I am a Dialog'
			></Dialog> */}
		</FlexContainer>
	);
};

export default DashboardView;
