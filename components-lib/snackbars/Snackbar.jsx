import styled from '@emotion/styled';
import { Snackbar as _Snackbar } from '@mui/material';

const DefaultSnackbar = styled(_Snackbar)``;
// TODO: Needs a button and useState to be operated. Ask Barak what to do.
// Can be used for on-screen notifications.
const Snackbar = ({ ...props }) => {
	return <DefaultSnackbar></DefaultSnackbar>;
};

export default Snackbar;
