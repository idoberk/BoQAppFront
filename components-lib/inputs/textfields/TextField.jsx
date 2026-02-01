import styled from '@emotion/styled';
import { TextField as _TextField } from '@mui/material';

const DefaultTextField = styled(_TextField)`
	background-color: ${({ theme }) => theme.palette.primary.main};
`;

const TextField = ({ variant = 'outlined', ...props }) => {
	return (
		<DefaultTextField
			variant={variant}
			{...props}></DefaultTextField>
	);
};

export default TextField;
