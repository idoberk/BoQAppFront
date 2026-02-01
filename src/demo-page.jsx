import styled from '@emotion/styled';
import Button from '../components-lib/buttons/Button';
import { FlexContainer } from '../components-lib/containers/FlexContainer';
import TextField from '../components-lib/inputs/textfields/TextField';

const ButtonContainer = styled(FlexContainer)`
	gap: 30px;
`;

const DemoPage = () => {
	return (
		<div style={{ padding: '2rem' }}>
			<h1>Component Library Demo</h1>
			<section style={{ marginBottom: '2rem' }}>
				<h2>Buttons:</h2>
				<ButtonContainer>
					<Button>Default</Button>
					<Button>Default</Button>
					<TextField
						label={'Filled variant'}
						helperText={'This is a helper text'}
						variant={'filled'}></TextField>
					<TextField label={'Outlined variant (default)'}></TextField>
				</ButtonContainer>
			</section>
		</div>
	);
};

export default DemoPage;
