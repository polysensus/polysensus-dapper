<script lang="ts">
	// import { Button } from 'demo02-components';
	import { ChainAccessPicker } from '@polysensus-dapper/chainpresence';
	/** @type {import('./$types').LayoutData} */
	export let data;

	let configs = [
		{ id: 123, name: 'onetwothree' },
		{ id: 321, name: 'threetwoone' },
		{ id: 999, name: 'nineninenine' }
	];
</script>

<h1>Presence Demo: num configs {configs?.length}</h1>
<ChainAccessPicker {configs} />
<h2>More posts</h2>
<ul>
	{#each data.infra as infra}
		<li>
			<p>{infra.dapper.serviceName}</p>
		</li>
	{/each}
</ul>
<!--
<Button name="demo02" />
-->
