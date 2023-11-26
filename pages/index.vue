<template>
  <div>
    <div v-for="route in routes">
      <NuxtLink
        class="text-20px"
        :to="route.path"
        v-if="route.name !== 'index'"
        >{{
          route.name.split("-")[0] + "/" + route.name.split("-")[1]
        }}</NuxtLink
      >
    </div>
  </div>
</template>

<script setup>
const routes = useRouter().getRoutes();
</script>
