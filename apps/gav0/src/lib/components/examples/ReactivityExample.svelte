<script lang="ts">
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';

  import { randomImages } from '../../utils';
  const slides = randomImages("teasers", 5);

  // Do not change readonly options later, such as `type`, `preloadPages`, etc.
  const options = {
    perPage: 2,
    gap    : 0,
    height : '10rem',
    rewind : true,
  }

  function onHeightChange( e: Event ): void {
    options.height = `${ ( e.target as HTMLInputElement ).value || 5 }rem`;
  }
</script>

<div class="wrapper">
  <h2 id="reactivity-example-heading">Reactivity Example</h2>

  <div style="margin-bottom: 1rem">
    <label>
      <span>gap:</span>
      <input type="number" min="0" max="20" bind:value={ options.gap }/>
      px
    </label>

    <label>
      <span>perPage:</span>
      <input type="number" min="1" max="5" bind:value={ options.perPage }/>
    </label>

    <label>
      <span>height:</span>
      <input
        type="number"
        min="5"
        max="20"
        value={ typeof options.height === 'string' ? parseInt( options.height ) : 5 }
        on:input={ onHeightChange }
      />
      rem
    </label>
  </div>

  <Splide options={ options } aria-labelledby="reactivity-example-heading">
    { #each slides as slide }
      <SplideSlide>
        <img src={ slide.src } alt={ slide.alt }>
      </SplideSlide>
    { /each }
  </Splide>
</div>

<style>
  label span {
    margin-right: .5rem;
  }

  input {
    height: 1.5rem;
    width: 4rem;
    font-family: inherit;
  }

  label {
    margin-right: 1rem;
  }
</style>