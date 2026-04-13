import styled from '@emotion/styled';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

const DefaultNavItem = styled(ListItemButton)``;

const NavItem = ({ href, icon, selected = false, children, ...props }) => {
	return (
		<DefaultNavItem
			component={href ? 'a' : 'button'}
			{...(href ? { href } : {})}
			selected={selected}
			{...props}
		>
			{icon && <ListItemIcon>{icon}</ListItemIcon>}
			<ListItemText
				primary={children}
				slotProps={{ primary: { noWrap: true } }}
			/>
		</DefaultNavItem>
	);
};

export default NavItem;
