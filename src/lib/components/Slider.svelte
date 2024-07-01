<script lang="ts">
  import { RangeSlider } from "@skeletonlabs/skeleton"

  export let value: number = 0
  export let name: string
  export let min = 0
  export let max = 10
  export let step = 1
  export let label: string
</script>

<label class="label"
  ><span>{label}</span>
  <br />
  <input class="input" type="number" data-vaul-no-drag bind:value {step} />
</label>
<RangeSlider {name} data-vaul-no-drag bind:value {min} {max} {step} />

<style>
  .input {
    width: 5.5em;
  }
</style>
