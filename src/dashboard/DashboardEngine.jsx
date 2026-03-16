import DashboardView from './DashboardView';

const rows = [
	{
		id: 1,
		itemNumber: '1.1',
		description: 'Concrete',
		unit: 'CY',
		quantity: 100,
		unitCost: 150,
		cost: 15000,
	},
	{
		id: 2,
		itemNumber: '1.2',
		description: 'Rebar',
		unit: 'LB',
		quantity: 5000,
		unitCost: 0.75,
		cost: 3750,
	},
];

const DashboardEngine = () => {
	const viewProps = {
		rows,
	};

	return <DashboardView {...viewProps} />;
};

export default DashboardEngine;
