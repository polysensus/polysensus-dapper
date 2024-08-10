<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { popup, PopupSettings } from '@skeletonlabs/skeleton';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	type ConfigLike = {
		id: number;
		name: string;
	};

	const dispatch = createEventDispatcher();

	export let configs: ConfigLike[] = [];
	export let selected: ConfigLike | undefined = undefined;

	// style props
	export let btnStyle = 'btn variant-filled w-48 justify-between';
	export let btnSelectedStyle = 'btn variant-ghost w-48 justify-between';
	export let btnBadgeStyle = 'badge bg-primary-500 capitalize';
	export let cardStyle = 'card w-48 py-2 shadow-xl';
	export let idBadgeStyle = 'badge bg-primary-500';
	export let popArrowStyle = 'bg-surface-100-800-token arrow';

	let btnClass = undefined;
	let lastName = undefined;

	$: btnClass = selected?.name ? btnSelectedStyle : btnStyle;

	const popupCombobox: PopupSettings = {
		//event: 'focus-click', // apparently not on safari
		event: 'click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	function onClick<T extends ConfigLike>(event: MouseEvent, item: T) {
		lastName = item?.name;
		dispatch('providerSelected', item);
	}
</script>

<button class={btnClass} use:popup={popupCombobox}>
	<div class="flex flex-row">
		{#if selected?.id}
			<span class={btnBadgeStyle}>{selected?.id}</span>
		{/if}
		<span class="px-1.5 capitalize">{selected?.name ?? 'Connect'}</span>
		{#if configs}
			<span>↓</span>
		{/if}
	</div>
</button>

<div class={cardStyle} data-popup="popupCombobox">
	{#if configs}
		<ListBox rounded="rounded-none">
			{#each configs as item}
				<ListBoxItem
					bind:group={selected}
					name="medium"
					value={item}
					on:click={(event) => onClick(event, item)}
				>
					<div class="flex flex-row">
						<span class={idBadgeStyle}>{item.id}</span>
						<span class="px-1.5">{item.id}</span>
					</div>
				</ListBoxItem>
			{/each}
		</ListBox>
		<div class={popArrowStyle} />
	{/if}
</div>
