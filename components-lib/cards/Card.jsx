import styled from '@emotion/styled';
import { Card as _Card, CardContent } from '@mui/material';
import Typography from '../typographies/Typography';

const DefaultCard = styled(_Card)``;

const Card = ({ children, ...props }) => {
	return (
		<DefaultCard>
			<CardContent>
				<Typography variant='body1'>{children}</Typography>
			</CardContent>
		</DefaultCard>
	);
};

export default Card;
