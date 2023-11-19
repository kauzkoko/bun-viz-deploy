<template>
  <div>
    <VitePwaManifest />
    <slot />
    <div>
      <NuxtLink
        class="w-20px h-20px bg-yellow rounded-full fixed left-10px bottom-10px"
        to="/"
      ></NuxtLink>
    </div>
  </div>
</template>

<script setup>
import "@unocss/reset/eric-meyer.css";
</script>
