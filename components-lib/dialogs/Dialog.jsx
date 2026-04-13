import styled from '@emotion/styled';
import {
	Dialog as _Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';

const DefaultDialog = styled(_Dialog)``;

const Dialog = ({
	dialogTitle,
	onClose,
	open,
	children,
	actions,
	...props
}) => {
	return (
		<DefaultDialog
			open={open}
			onClose={onClose}
			{...props}
		>
			<DialogTitle>{dialogTitle}</DialogTitle>
			{children && <DialogContent>{children}</DialogContent>}
			{actions && <DialogActions>{actions}</DialogActions>}
		</DefaultDialog>
	);
};

export default Dialog;
