import styled from '@emotion/styled';

const CssClasses = styled.div`
	display: flex;
	flex-direction: row;
	height: 100vh;
	padding: 20px;
	width: 100vw;
	overflow: hidden;

	.fc-main {
		color: ${({ theme }) => theme.palette.primary.main};
	}

	.fc-main-dark {
		color: ${({ theme }) => theme.palette.primary.dark};
	}

	.fc-tertiary {
		color: ${({ theme }) => theme.palette.text.primary};
	}

	.fc-grey-500 {
		color: ${({ theme }) => theme.palette.grey[500]};
	}

	.fc-error {
		color: ${({ theme }) => theme.palette.error.main};
	}

	.fc-error-dark {
		color: ${({ theme }) => theme.palette.error.dark};
	}

	.fc-success-dark {
		color: ${({ theme }) => theme.palette.success.dark};
	}

	.fc-secondary {
		color: ${({ theme }) => theme.palette.text.secondary};
	}
`;

export default CssClasses;
