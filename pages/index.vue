<template>
  <div class="p-5 text-white">
    <h1 class="text-40px font-bold text-white uppercase">
      Data Visualisation Module – ZHdK x Crowther Lab
    </h1>
    <h2 class="text-30px mt-10 mb-2 font-bold">
      Interactive prototype as shown in final presentation, designed for 4K
      touchscreen in fullscreen, <br />on smaller screens use browser zoom or
      responsive mode in devtools to recreate the experience
    </h2>
    <NuxtLink to="/Final">Final</NuxtLink>
    <h2 class="text-30px mt-10 mb-2 font-bold">
      Prototypes / experiments / dev pages
    </h2>
    <div v-for="route in routes" class="mb-1">
      <NuxtLink
        :to="route.path"
        v-if="route.name !== 'index' && route.name !== 'Final'"
        >{{ route.name.split("-")[0] }}</NuxtLink
      >
    </div>
  </div>
</template>

<script setup>
const routes = useRouter().getRoutes();
</script>

<style scoped>
a {
  font-size: 30px;
  color: white;
}
</style>
