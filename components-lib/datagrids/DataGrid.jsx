import styled from '@emotion/styled';
import { DataGrid as _DataGrid } from '@mui/x-data-grid';

const DefaultDataGrid = styled(_DataGrid)``;

const DataGrid = ({ rows, columns, ...props }) => {
	return (
		<DefaultDataGrid
			rows={rows}
			columns={columns}
			disableColumnMenu={true}
			{...props}
		></DefaultDataGrid>
	);
};

export default DataGrid;
