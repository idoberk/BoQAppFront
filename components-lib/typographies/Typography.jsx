import styled from '@emotion/styled';
import { Typography as _Typography } from '@mui/material';

const DefaultTypography = styled(_Typography)``;

const Typography = ({ children, variant = 'h3', ...props }) => {
	return <DefaultTypography variant={variant}>{children}</DefaultTypography>;
};

export default Typography;
