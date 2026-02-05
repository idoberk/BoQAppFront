import styled from '@emotion/styled';
import { List as _List, ListSubheader } from '@mui/material';

const DefaultNavSection = styled(_List)``;

const NavSection = ({ title, children, ...props }) => {
	return (
		<DefaultNavSection
			subheader={<ListSubheader>{title}</ListSubheader>}
			{...props}
		>
			{children}
		</DefaultNavSection>
	);
};

export default NavSection;
