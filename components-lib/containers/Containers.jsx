import styled from '@emotion/styled';

export const FlexContainer = styled.div`
	display: flex;
	flex-direction: ${({ $row }) => ($row ? 'row' : 'column')};
	${({ $flex }) => $flex !== undefined && `flex: ${$flex};`}
	gap: ${({ $gap }) => $gap || '0'}
`;

export const CenteredContainer = styled.div`
	display: flex;
	justify-content: center;
	width: ${({ $width }) => $width || '100%'};
	margin: 0 auto;
`;
