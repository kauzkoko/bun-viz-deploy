<template>
  <div fixed left-0 top-0 text-50px bg-yellow>
    <pre>difference: {{ difference }}</pre>
    <pre>yRef: {{ yRef }}</pre>
    <pre>mouseY: {{ mouseY }}</pre>
    <pre>windowHeight/2: {{ windowHeight / 2 }}</pre>
    <pre>
  abs(mouseY-windowHeight/2): {{ Math.abs(mouseY - windowHeight / 2) }}</pre
    >
    <pre>radius: {{ ecosystems[2].currentRadius }}</pre>
    <pre>radius: {{ ecosystems[2].potentialRadius }}</pre>
    <pre>
  radiusDifference: {{
        ecosystems[2].potentialRadius - ecosystems[2].currentRadius
      }}</pre
    >
  </div>
  <div
    v-for="n in particles.length"
    class="aspect-1 bg-white fixed left-0 top-0 rounded-full transition-all ease-linear z--1 particles"
    :style="{
      transitionDuration: `${60000}ms`,
      width: `${particles[n - 1].r}px`,
      transform: `translate(${particles[n - 1].x}px, ${particles[n - 1].y}px)`,
    }"
  ></div>
  <svg
    :width="windowWidth + 'px'"
    :height="windowHeight + 'px'"
    class="fixed left-0 top-0"
  >
    <defs>
      <filter
        id="metaballFilter"
        width="400%"
        x="-150%"
        height="400%"
        y="-150%"
      >
        <feGaussianBlur
          id="blurElement"
          in="SourceGraphic"
          stdDeviation="20"
          result="blur"
        />
        <feColorMatrix
          id="colorMatrixElement"
          in="blur"
          mode="matrix"
          values="1 0 0 0  0
                                                                                     0 1 0 0  0
                                                                                     0 0 1 0  0
                                                                                     0 0 0 25 -15"
          result="matrix"
        />
      </filter>
    </defs>
    <!-- <g filter="url(#metaballFilter)">
        <circle
          v-for="n in 9"
          :cx="(windowWidth / 9) * n - windowWidth / 18"
          :cy="ecosystems[n - 1].y"
          :r="100"
          fill="red"
          class="transition-all duration-4000"
        />
        <circle
          v-for="n in 9"
          :cx="(windowWidth / 9) * n - windowWidth / 18"
          :cy="windowHeight / 2"
          :r="100"
          fill="blue"
        />
      </g> -->
    <g filter="url(#metaballFilter)">
      <circle
        ref="el"
        id="circle"
        :cx="(windowWidth / 9) * 3 - windowWidth / 18"
        :cy="mouseY"
        :r="100"
        fill="red"
        class="transition-all duration-0"
      />
      <circle
        :cx="(windowWidth / 9) * 3 - windowWidth / 18"
        :cy="windowHeight / 2"
        :r="fakedR"
        fill="blue"
      />
    </g>
  </svg>
  <div class="w-screen h-screen overflow-hidden grid grid-cols-9 grid-rows-9">
    <Token
      v-for="n in 9"
      @showPotential="showPotential"
      :ecosystem="ecosystems[n - 1]"
      class="row-start-5 self-center justify-self-center"
    />
  </div>
</template>

<script setup>
import "animate.css";
const { x, y: mouseY } = useMouse();
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
    y: -30,
    index: i,
    currentRadius: temp,
    potentialRadius: temp + Math.random() * 100,
  });
}

const yRef = ref(0);
onMounted(() => {
  let circle = document.getElementById("circle");
  const { pause, resume } = useRafFn(() => {
    yRef.value = circle.getBoundingClientRect().y;
  });
});

const difference = computed(() =>
  Math.abs(yRef.value - windowHeight.value / 2)
);
let r = ecosystems.value[2].currentRadius / 2;
const fakedR = computed(() => {
  if (difference.value < 360) {
    return (
      r +
      useMap(
        difference.value,
        245,
        0,
        0,
        49
        // Math.sqrt(
        //   Math.PI * Math.pow(r, 2) +
        //     (Math.PI * Math.pow(100, 2)) / Math.PI -
        //     r * 2
        // )
      )
    );
  } else {
    return r;
  }
});

function setParticlePositions() {
  particles.value.forEach((particle, index) => {
    particles.value[index].x = Math.random() * windowWidth.value;
    particles.value[index].y = Math.random() * windowHeight.value;
  });
}

function showPotential(index) {
  ecosystems.value[index].y = windowHeight.value / 2;
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

.particles {
  /* mix-blend-mode: difference; */
  border: 1px solid black;
}
</style>
