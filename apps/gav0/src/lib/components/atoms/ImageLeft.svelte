<script lang="ts">

// For images placed on the left of content
// Specifies padding appropriate for content following after (to the right)

import {twMerge} from 'tailwind-merge';

export let image: {src: string, alt: string, styles?:{size?:string, shape?:string}};
export let sizeStyles=image?.styles?.size ?? 'w-64 h-64';
export let shapeStyles=image?.styles?.shape ?? ''; // 'rounded-full';

// --- component state properties
let styles = twMerge(sizeStyles, shapeStyles);
</script>
<img class={styles} src={image.src} alt={image.alt} />
<style>
</style>