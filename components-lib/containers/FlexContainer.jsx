import styled from '@emotion/styled';

export const FlexContainer = styled.div`
	display: flex;
	flex-direction: ${({ $row }) => ($row ? 'row' : 'column')};
	${({ $flex }) => $flex !== undefined && `flex: ${$flex};`}
`;
