import type { Meta, StoryObj } from '@storybook/svelte';
// import FabricatorPage from '$lib/components/pages/FabricatorPage.svelte';
// import FabricatorPage from '../../components/pages/FabricatorPage.svelte';
import FabricatorPage from '$lib/components/pages/FabricatorPage.svelte';

import { singleGameSelector as selector } from '$lib/placeholders/gamediscoveryselectors';
import { fabricatorData } from '$lib/placeholders/fabricators';
const meta = {
	title: 'Pages/FabricatorPage',
	component: FabricatorPage,
	tags: ['autodocs'],
	argTypes: {
		backgroundColor: { control: 'color' },
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		}
	}
} satisfies Meta<FabricatorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Graffiti: Story = (args) => ({
	Component: FabricatorPage,
	props: {...args, pathname: "/fabricator/biomes-2024/graffiti", data: fabricatorData('biomes-2024', 'graffiti')}
});

export const Blueprints: Story = (args) => ({
	Component: FabricatorPage,
	props: {...args, pathname: "/fabricator/biomes-2024/blueprints", data: fabricatorData('biomes-2024', 'blueprints')}
});

