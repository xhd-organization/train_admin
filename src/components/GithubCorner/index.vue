<template>
  <a href="http://localhost:7001" target="_blank" class="github-corner" aria-label="优学院">
    <img :src="default_site_img">
  </a>
</template>
<script>
export default {
  name: 'GithubCorner',
  data() {
    return {
      default_site_img: require('@/assets/images/header.png')
    }
  }
}
</script>
<style scoped>
.github-corner:hover .octo-arm {
  animation: octocat-wave 560ms ease-in-out
}

@keyframes octocat-wave {
  0%,
  100% {
    transform: rotate(0)
  }
  20%,
  60% {
    transform: rotate(-25deg)
  }
  40%,
  80% {
    transform: rotate(10deg)
  }
}

@media (max-width:500px) {
  .github-corner:hover .octo-arm {
    animation: none
  }
  .github-corner .octo-arm {
    animation: octocat-wave 560ms ease-in-out
  }
}
</style>
