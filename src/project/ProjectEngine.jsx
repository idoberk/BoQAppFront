import ProjectView from './ProjectView';

const mockRows = [
	{
		id: 1,
		name: 'BoQ 1',
		status: 'Draft',
		lastEdited: '2026-03-15 09:30 · John D',
	},
	{
		id: 2,
		name: 'BoQ 2',
		status: 'Approved',
		lastEdited: '2026-03-14 14:00 · John D',
	},
];

const ProjectEngine = ({ project }) => {
	return (
		<ProjectView
			rows={mockRows}
			project={project}
		/>
	);
};

export default ProjectEngine;
