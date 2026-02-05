import styled from '@emotion/styled';
import { Dialog as _Dialog, DialogTitle } from '@mui/material';

const DefaultDialog = styled(_Dialog)``;

const Dialog = ({ dialogTitle, onClose, open }) => {
	const handleClose = () => {};
	return (
		<DefaultDialog
			open={open}
			onClose={handleClose}>
			<DialogTitle>{dialogTitle}</DialogTitle>
		</DefaultDialog>
	);
};

export default Dialog;
