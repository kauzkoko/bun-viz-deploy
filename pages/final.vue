<template>
  <div
    v-for="n in particles.length"
    class="aspect-1 bg-gray fixed left-0 top-0 rounded-full transition-all ease-linear z--1"
    :style="{
      transitionDuration: `${60000}ms`,
      width: `${particles[n - 1].r}px`,
      transform: `translate(${particles[n - 1].x}px, ${particles[n - 1].y}px)`,
    }"
  ></div>
  <div class="w-screen h-screen overflow-hidden grid grid-cols-9 grid-rows-9">
    <Token
      v-for="n in 9"
      :ecosystem="ecosystems[n - 1]"
      class="row-start-5 self-center justify-self-center"
    />
  </div>
</template>

<script setup>
import "animate.css";
const { width: windowWidth, height: windowHeight } = useWindowSize();
const particles = ref([]);
const ecosystems = ref([]);

for (let i = 0; i < 50; i++) {
  particles.value.push({
    x: Math.random() * windowWidth.value,
    y: Math.random() * windowHeight.value,
    r: Math.random() * 300,
  });
}

for (let i = 0; i < 9; i++) {
  let temp = Math.random() * 500 + 220;
  ecosystems.value.push({
    currentRadius: temp,
    potentialRadius: temp + Math.random() * 100,
  });
}

function setParticlePositions() {
  particles.value.forEach((particle, index) => {
    particles.value[index].x = Math.random() * windowWidth.value;
    particles.value[index].y = Math.random() * windowHeight.value;
  });
}

onMounted(() => {
  setInterval(() => {
    setParticlePositions();
  }, 60000);
  setTimeout(() => {
    setParticlePositions();
  }, 1000);
});
</script>

<style>
html {
  background-color: black;
  font-family: "Helvetica Neue" !important;
}
</style>
