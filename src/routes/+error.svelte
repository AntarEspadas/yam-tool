<script lang="ts">
  import { page } from "$app/stores"
</script>

<div>
  <h1 class="text-surface-700-200-token h1">
    {$page.error?.message}
  </h1>
  <h2 class="text-surface-700-200-token h2">
    {$page.status}
  </h2>
  <a href="/maps">
    <button class="variant-soft-primary btn">Back to maps</button>
  </a>
</div>

<style>
  div {
    text-align: center;
  }
  h2 {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
</style>
