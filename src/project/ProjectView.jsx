import { Typography } from '@mui/material';
import Card from '../../components-lib/cards/Card';
import { FlexContainer } from '../../components-lib/containers/Containers';
import DataGrid from '../../components-lib/datagrids/DataGrid';
import SearchBar from '../../components-lib/inputs/textfields/SearchBar';

const columns = [
	{ field: 'name', headerName: '', flex: 1 },
	{ field: 'status', headerName: 'Status', width: 120 },
	{ field: 'lastEdited', headerName: 'Last Edited', width: 220 },
];

const ProjectView = ({ rows, project }) => {
	return (
		<FlexContainer style={{ justifyContent: 'center' }}>
			<SearchBar />
			<DataGrid
				rows={rows}
				columns={columns}
			/>
			<Card>
				<Typography>Project: {project.name}</Typography>
				<Typography>Number: {project.number}</Typography>
				{(project.address || project.city || project.county) && (
					<Typography>
						{[project.address, project.city, project.county]
							.filter(Boolean)
							.join(', ')}
					</Typography>
				)}
				{(project.state || project.zip) && (
					<Typography>
						{[project.state, project.zip].filter(Boolean).join(' ')}
					</Typography>
				)}
			</Card>
		</FlexContainer>
	);
};

export default ProjectView;
