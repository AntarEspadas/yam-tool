<script lang="ts">
  import { Modal, initializeStores } from "@skeletonlabs/skeleton"
  import "../app.css"

  initializeStores()
</script>

<Modal />

<div class="app-container">
  <slot></slot>
</div>

<style>
  :global(body) {
    margin: 0;
  }

  .app-container {
    width: 100vw;
    height: 100vh;
  }
</style>
