<script lang="ts">
	// import { Button } from 'demo02-components';
	import { ChainAccessPicker } from '@polysensus-dapper/chainpresence';

	let configs = [
		{ id: 123, name: 'onetwothree' },
		{ id: 321, name: 'threetwoone' },
		{ id: 999, name: 'nineninenine' }
	];
</script>

<h1>Presence Demo: num configs {configs?.length}</h1>
<ChainAccessPicker {configs} />
<!--
<Button name="demo02" />
-->
