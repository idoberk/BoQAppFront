import ButtonDefault from '../components-lib/buttons/ButtonDefault';

const DemoPage = () => {
	return (
		<div style={{ padding: '2rem' }}>
			<h1>Component Library Demo</h1>
			<section style={{ marginBottom: '2rem' }}>
				<h2>Buttons:</h2>
				<div style={{ display: 'flex', gap: '1rem' }}>
					<ButtonDefault>Default</ButtonDefault>
				</div>
			</section>
		</div>
	);
};

export default DemoPage;
