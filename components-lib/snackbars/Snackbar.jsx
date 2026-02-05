import styled from '@emotion/styled';
import { Snackbar as _Snackbar } from '@mui/material';

const DefaultSnackbar = styled(_Snackbar)``;

const Snackbar = ({ message, ...props }) => {
	return (
		<DefaultSnackbar
			open
			message={message}
			autoHideDuration={5000}
			{...props}></DefaultSnackbar>
	);
};

export default Snackbar;
