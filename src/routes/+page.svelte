<script lang="ts">
</script>

<div class="main-container">
  <h1 class="title text-surface-700-200-token h1">
    <strong class="text-primary-500">Y</strong>et <strong class="text-primary-500">A</strong>nother
    <strong class="text-primary-500">M</strong>ap Tool
  </h1>
  <p class="text-surface-700-200-token">Easily create beautiful, interactive TTRPG maps</p>
  <a href="/maps">
    <button class="variant-filled-primary btn">Get started</button>
  </a>
</div>

<style lang="scss">
  .main-container {
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .title {
    margin-top: 25vh;
    margin-bottom: 4rem;
    @include xs {
      font-size: 2rem;
      line-height: 2rem;
    }
    @include sm {
      font-size: 4rem;
      line-height: 4rem;
    }
    @include md {
      font-size: 5rem;
      line-height: 5rem;
    }
  }

  p {
    margin-bottom: 1.5rem;

    @include xs {
      font-size: 1rem;
    }
    @include sm {
      font-size: 1.5rem;
    }
    @include md {
      font-size: 1.5rem;
    }
  }
</style>
