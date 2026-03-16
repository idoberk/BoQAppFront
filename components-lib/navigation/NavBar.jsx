import styled from '@emotion/styled';
import { Drawer as _Drawer, List } from '@mui/material';

const DefaultNavBar = styled(_Drawer)``;

const NavBar = ({ width = 250, children, ...props }) => {
	return (
		<DefaultNavBar
			variant='permanent'
			sx={{
				'& .MuiDrawer-paper': {
					position: 'relative',
					width,
					height: '100%',
					overflowY: 'auto',
				},
			}}
			{...props}
		>
			<List>{children}</List>
		</DefaultNavBar>
	);
};

export default NavBar;
