import { createContext, useContext, useState } from 'react';

const ProjectActionsContext = createContext(null);

export const ProjectActionsProvider = ({ children }) => {
	const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
	const [activeView, setActiveView] = useState('dashboard');
	const [createdProject, setCreatedProject] = useState(null);

	const openNewProjectDialog = () => setIsNewProjectOpen(true);
	const closeNewProjectDialog = () => setIsNewProjectOpen(false);

	const createProject = (formData) => {
		setCreatedProject(formData);
		setActiveView('project');
		setIsNewProjectOpen(false);
	};

	const goToDashboard = () => setActiveView('dashboard');

	return (
		<ProjectActionsContext.Provider
			value={{
				isNewProjectOpen,
				activeView,
				createdProject,
				openNewProjectDialog,
				closeNewProjectDialog,
				createProject,
				goToDashboard,
			}}
		>
			{children}
		</ProjectActionsContext.Provider>
	);
};

export const useProjectActionsContext = () => {
	const context = useContext(ProjectActionsContext);
	if (!context) {
		throw new Error(
			'useProjectActionsContext must be used within ProjectActionsProvider',
		);
	}
	return context;
};
