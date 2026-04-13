import { useState } from 'react';
import { Autocomplete, Grid, Typography } from '@mui/material';
import Button from '../../../components-lib/buttons/Button';
import Dialog from '../../../components-lib/dialogs/Dialog';
import TextField from '../../../components-lib/inputs/textfields/TextField';
import { useProjectActionsContext } from '../../context/ProjectActionsContext';

const PROJECT_TYPES = [
	'Residential',
	'Commercial',
	'Industrial',
	'Infrastructure',
	'Renovation',
	'Healthcare',
	'Educational',
	'Mixed-Use',
];

const NewProjectDialog = () => {
	const { closeNewProjectDialog, createProject } = useProjectActionsContext();

	const [name, setName] = useState('');
	const [types, setTypes] = useState([]);
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [county, setCounty] = useState('');
	const [state, setState] = useState('');
	const [zip, setZip] = useState('');

	const isValid = name.trim() !== '' && types.length > 0;

	const handleCreate = () => {
		createProject({
			name: name.trim(),
			number: 'Auto-assigned',
			types,
			address,
			city,
			county,
			state,
			zip,
		});
	};

	return (
		<Dialog
			open={true}
			dialogTitle='Create New Project'
			onClose={closeNewProjectDialog}
			fullWidth
			maxWidth='sm'
			actions={
				<>
					<Button
						role='cancel'
						onClick={closeNewProjectDialog}
					>
						Cancel
					</Button>
					<Button
						role='confirm'
						disabled={!isValid}
						onClick={handleCreate}
					>
						Create
					</Button>
				</>
			}
		>
			<TextField
				label='Project Name'
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
				fullWidth
			/>
			<TextField
				label='Project Number'
				value='Auto-assigned'
				disabled
				fullWidth
			/>
			<Autocomplete
				multiple
				options={PROJECT_TYPES}
				value={types}
				onChange={(_, newValue) => setTypes(newValue)}
				renderInput={(params) => (
					<TextField
						{...params}
						label='Project Type(s)'
						required
					/>
				)}
			/>
			<Typography variant='subtitle2'>Location</Typography>
			<Grid
				container
				spacing={2}
			>
				<Grid size={12}>
					<TextField
						label='Street Address'
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						fullWidth
					/>
				</Grid>
				<Grid size={7}>
					<TextField
						label='City / Town'
						value={city}
						onChange={(e) => setCity(e.target.value)}
						fullWidth
					/>
				</Grid>
				<Grid size={5}>
					<TextField
						label='County'
						value={county}
						onChange={(e) => setCounty(e.target.value)}
						fullWidth
					/>
				</Grid>
				<Grid size={6}>
					<TextField
						label='State'
						value={state}
						onChange={(e) => setState(e.target.value)}
						fullWidth
					/>
				</Grid>
				<Grid size={6}>
					<TextField
						label='ZIP'
						value={zip}
						onChange={(e) => setZip(e.target.value)}
						fullWidth
					/>
				</Grid>
			</Grid>
		</Dialog>
	);
};

export default NewProjectDialog;
