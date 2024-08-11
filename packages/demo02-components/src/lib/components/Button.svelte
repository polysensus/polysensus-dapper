<script lang="ts">
	export let name = 'button';
	// style props
	export let btnStyle = 'btn variant-filled w-48 justify-between';
</script>

<button class={btnStyle}>
	<div class="flex flex-row">
		<span class="px-1.5 capitalize">{name}</span>
	</div>
</button>
