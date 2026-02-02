import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Button as _Button } from '@mui/material';

const DefaultButton = styled(_Button)`
	/* background-color: ${({ theme }) => theme.palette.primary.main};
	&:hover {
		background-color: ${({ theme }) => theme.palette.primary.dark};
	} */
`;

const Button = ({
	children,
	variant = 'contained',
	role = 'confirm',
	...props
}) => {
	//const theme = useTheme();

	return (
		<DefaultButton
			variant={variant}
			role={role}
			{...props}>
			{children}
		</DefaultButton>
	);
};

export default Button;
