<script>
  import "../app.css"
</script>

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
