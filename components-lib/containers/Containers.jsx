import styled from '@emotion/styled';

export const FlexContainer = styled.div`
	display: flex;
	flex-direction: ${({ $row }) => ($row ? 'row' : 'column')};
	width: ${({ $width }) => $width || '100%'};
	gap: ${({ $gap }) => $gap || '0'}
		${({ $flex }) => $flex !== undefined && `flex: ${$flex};`};
`;

export const CenteredContainer = styled.div`
	display: flex;
	width: ${({ $width }) => $width || '100%'};
	justify-content: center;
	margin: 0 auto;
`;
