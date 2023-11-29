<template>
  <div class="overflow-hidden">
    <div fixed left-0 top-0 bg-yellow z-1 text-25px>
      <div flex justify-between>
        <label>Show particle text</label
        ><input type="checkbox" v-model="showParticleText" />
      </div>
      <div flex justify-between>
        <label>Blend particles instead of border</label
        ><input type="checkbox" v-model="blendParticles" />
      </div>
      <div flex justify-between>
        <label>Particle color</label
        ><input text-25px type="text" v-model="particleColor" />
      </div>
      <div flex justify-between>
        <label>Storage color</label
        ><input text-25px type="text" v-model="storageColor" />
      </div>
      <div flex justify-between>
        <label>Background color</label
        ><input text-25px type="text" v-model="backgroundColor" />
      </div>
      <div flex justify-between>
        <label>Split factor</label
        ><input text-25px type="text" v-model="splitFactor" />
      </div>
      <div flex justify-between>
        <label>Show border</label><input type="checkbox" v-model="showBorder" />
      </div>
    </div>
    <!-- <div
      class="text-16px text-white fixed left-0 top-0"
      :style="{
        transform: `translate(${500}px, ${500}px)`,
      }"
    >
      30 Gt Potential Storage Above Ground
    </div> -->
    <svg
      id="mySvg"
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
      <g v-for="n in 9">
        <g filter="url(#metaballFilter)">
          <circle
            v-show="data[n - 1].potential !== 200"
            ref="el"
            id="circle"
            :cx="(windowWidth / 9) * n - windowWidth / 18"
            :cy="ecosystems[n - 1].y"
            :r="
              ecosystems[n - 1].split
                ? data[n - 1].potentialAbove / 2
                : data[n - 1].potential / 2
            "
            :fill="
              ecosystems[n - 1].split
                ? aboveColor
                : ecosystems[n - 1].showAboveBelow
                ? storageColor
                : particleColor
            "
            :stroke="ecosystems[n - 1].showAboveBelow ? 'white' : 'transparent'"
            :style="{
              transitionProperty: 'all',
              transitionDuration: '3500ms',
              transitionTimingFunction: 'ease-out',
            }"
          />
          <circle
            v-show="data[n - 1].potential !== 200"
            ref="el"
            id="circle"
            :cx="(windowWidth / 9) * n - windowWidth / 18"
            :cy="
              ecosystems[n - 1].split
                ? ecosystems[n - 1].y + 200
                : ecosystems[n - 1].y
            "
            :r="
              ecosystems[n - 1].showAboveBelow
                ? (data[n - 1].potentialBelow / 2) * splitFactor
                : 0
            "
            :fill="
              ecosystems[n - 1].split
                ? belowColor
                : ecosystems[n - 1].showAboveBelow
                ? storageColor
                : particleColor
            "
            :stroke="ecosystems[n - 1].showAboveBelow ? 'white' : 'transparent'"
            :style="{
              transitionProperty: 'all',
              transitionDuration: '3500ms',
              transitionTimingFunction: 'ease-out',
            }"
          />
          <circle
            :id="'circle-' + ecosystems[n - 1].name"
            :cx="(windowWidth / 9) * n - windowWidth / 18"
            :cy="windowHeight / 2"
            :r="
              ecosystems[n - 1].showPotential
                ? data[n - 1].potential === 200
                  ? data[n - 1].totalCurrent / 2 + 7
                  : (data[n - 1].totalPotential * magicScale) / 2 + 7
                : ecosystems[n - 1].showCurrent
                ? data[n - 1].totalCurrent / 2 + 7
                : 0
            "
            :fill="n - 1 ? storageColor : '#122612'"
            :style="{
              transitionProperty: 'all',
              transitionDelay: ecosystems[n - 1].showPotential
                ? '1500ms'
                : ecosystems[n - 1].split
                ? '7000ms'
                : '0ms',
              transitionDuration: ecosystems[n - 1].showPotential
                ? '500ms'
                : '2000ms',
              transitionTimingFunction: 'ease-out',
            }"
          />
        </g>
        <circle
          :cx="(windowWidth / 9) * n - windowWidth / 18"
          :cy="windowHeight / 2"
          :r="data[n - 1].totalCurrent / 2"
          fill="transparent"
          stroke="white"
          :style="{
            mixBlendMode: ecosystems[n - 1].showCurrent
              ? 'normal'
              : 'difference',
          }"
        />
        <circle
          v-show="data[n - 1].potential !== 200"
          :cx="(windowWidth / 9) * n - windowWidth / 18"
          :cy="windowHeight / 2"
          :r="(data[n - 1].totalPotential * magicScale) / 2"
          fill="transparent"
          stroke="white"
          :style="{
            mixBlendMode: ecosystems[n - 1].showPotential
              ? 'normal'
              : 'difference',
          }"
        />
        <circle
          v-for="n in particles.length"
          :cx="particles[n - 1].x"
          :cy="particles[n - 1].y"
          :r="particles[n - 1].r / 2"
          :fill="particleColor"
          :stroke="blendParticles ? 'transparent' : 'black'"
          :style="{
            transitionDuration: `${60000}ms`,
            mixBlendMode: blendParticles ? 'difference' : 'normal',
          }"
        />
      </g>
    </svg>
    <div class="w-screen h-screen overflow-hidden grid grid-cols-9 grid-rows-9">
      <TokenNew
        v-for="n in 9"
        @showCurrent="showCurrent"
        @showPotential="showPotential"
        @showAboveBelow="showAboveBelow"
        @exit="exit"
        :ecosystem="ecosystems[n - 1]"
        class="row-start-5 self-center justify-self-center"
      />
    </div>
    <div
      class="fixed left-0 top-0 w-screen h-screen flexCenter pointer-events-none"
    >
      <div
        v-show="showBorder"
        class="border-yellow border-solid border-1px w-3840px h-2160px"
      ></div>
    </div>
  </div>
</template>

<script setup>
import "animate.css";
import { SVG } from "@svgdotjs/svg.js";
const { x, y: mouseY } = useMouse();
const { width: windowWidth, height: windowHeight } = useWindowSize();
const particles = ref([]);
const ecosystems = ref([]);

const showParticleText = ref(false);
const blendParticles = ref(true);
const particleColor = ref("gray");
const storageColor = ref("rgb(0, 50,0)");
const aboveColor = ref("rgb(0, 90,0)");
const belowColor = ref("rgb(0, 70,0)");
const showBorder = ref(true);
const backgroundColor = ref("black");
const splitFactor = ref(2);

// let setParticles = 0;
for (let i = 0; i < 40; i++) {
  particles.value.push({
    x: Math.random() * windowWidth.value,
    y: Math.random() * windowHeight.value,
    r: Math.random() * 200,
  });
  // useTextEllipse({
  //   text: particles.value[i].r.toFixed(0) + " Gt",
  //   x: particles.value[i].x,
  //   y: particles.value[i].y,
  //   r: particles.value[i].r,
  //   color: "white",
  //   svgSelector: "#mySvg",
  //   offset: Math.floor(Math.random() * 50),
  // });
}
// setParticles = 1;

let magicScale = 1.1;
let data = [
  {
    ecosystem: "Open Ocean",
    shortName: "ope",
    currentAbove: 4763,
    potentialAbove: 0,
    currentBelow: 982,
    potentialBelow: 0,
    totalPotential: 5063,
    totalCurrent: 5063,
    potential: 200,
  },
  {
    ecosystem: "Blue Carbon Ecosystems",
    shortName: "bce",
    currentAbove: 42,
    potentialAbove: 0,
    currentBelow: 99,
    potentialBelow: 0,
    totalPotential: 308,
    totalCurrent: 308,
    potential: 200,
  },
  {
    ecosystem: "Savanna",
    shortName: "sav",
    currentAbove: 101,
    potentialAbove: 81,
    currentBelow: 339,
    potentialBelow: 133,
    totalPotential: 587,
    totalCurrent: 554,
    potential: 356,
  },
  {
    ecosystem: "Grassland",
    shortName: "gra",
    currentAbove: 58,
    potentialAbove: 78,
    currentBelow: 646,
    potentialBelow: 117,
    totalPotential: 864,
    totalCurrent: 849,
    potential: 341,
    // guessedPotential: 550,
  },
  {
    ecosystem: "Shrublands",
    shortName: "shr",
    currentAbove: 85,
    potentialAbove: 69,
    currentBelow: 438,
    potentialBelow: 133,
    totalPotential: 671,
    totalCurrent: 646,
    potential: 350,
  },

  {
    ecosystem: "Wetlands",
    shortName: "wet",
    currentAbove: 29,
    potentialAbove: 22,
    currentBelow: 162,
    potentialBelow: 21,
    totalPotential: 367,
    totalCurrent: 365,
    potential: 231,
  },
  {
    ecosystem: "Forest",
    shortName: "for",
    currentAbove: 432,
    potentialAbove: 247,
    currentBelow: 1003,
    potentialBelow: 277,
    totalPotential: 1353,
    totalCurrent: 1292,
    potential: 571,
  },
  {
    ecosystem: "Desert",
    shortName: "des",
    currentAbove: 10,
    potentialAbove: 13,
    currentBelow: 287,
    potentialBelow: 56,
    totalPotential: 493,
    totalCurrent: 488,
    potential: 258,
  },

  {
    ecosystem: "Continental Margins",
    shortName: "con",
    currentAbove: 733,
    potentialAbove: 0,
    currentBelow: 549,
    potentialBelow: 0,
    totalPotential: 1116,
    totalCurrent: 1116,
    potential: 200,
  },
];

//init ecosystems
for (let i = 0; i < 9; i++) {
  ecosystems.value.push({
    shortName: data[i].shortName,
    name: data[i].ecosystem,
    y: -100,
    index: i,
    currentRadius: data[i].totalCurrent,
    potentialRadius: data[i].totalPotential * magicScale,
    noPotential: data[i].potential === 200,
  });
  useTextEllipse({
    text: data[i].ecosystem,
    x: (windowWidth.value / 9) * (i + 1) - windowWidth.value / 18,
    y: windowHeight.value / 2,
    r: 220 / 2 + 3,
    color: "white",
    svgSelector: "#mySvg",
    offset: Math.floor(Math.random() * 50),
    front: true,
    blend: false,
  });
  useTextEllipse({
    text: "XY Gt Current Storage",
    x: (windowWidth.value / 9) * (i + 1) - windowWidth.value / 18,
    y: windowHeight.value / 2,
    r: data[i].totalCurrent / 2 + 3,
    color: "white",
    svgSelector: "#mySvg",
    offset: Math.floor(Math.random() * 50),
    blend: true,
  });
  if (data[i].potential !== 200) {
    useTextEllipse({
      text: "XY Gt Potential Storage",
      x: (windowWidth.value / 9) * (i + 1) - windowWidth.value / 18,
      y: windowHeight.value / 2,
      r: (data[i].totalPotential * magicScale) / 2 + 3,
      color: "white",
      svgSelector: "#mySvg",
      offset: Math.floor(Math.random() * 50),
      blend: true,
    });
  }
}

function setParticlePositions() {
  particles.value.forEach((particle, i) => {
    // particles.value[i].lastX = particles.value[i].x;
    // particles.value[i].lastY = particles.value[i].y;
    particles.value[i].x = Math.random() * windowWidth.value;
    particles.value[i].y = Math.random() * windowHeight.value;
  });
}

// text for every particle
// useRafFn(() => {
//   particles.value.forEach((particle, i) => {
//     useTextEllipse({
//       text: particles.value[i].r.toFixed(0) + " Gt",
//       x: particles.value[i].lastX - particles.value[i].x / 60000,
//       x: particles.value[i].lastY - particles.value[i].y / 60000,
//       r: particles.value[i].r,
//       color: "white",
//       svgSelector: "#mySvg",
//       offset: Math.floor(Math.random() * 50),
//     });
//   });
// });

function showPotential(index) {
  ecosystems.value[index].showPotential = true;
  ecosystems.value[index].y = windowHeight.value / 2;
}

function showCurrent(index) {
  ecosystems.value[index].showCurrent = true;
}

function showAboveBelow(index) {
  ecosystems.value[index].showAboveBelow = true;
  ecosystems.value[index].showPotential = false;
  ecosystems.value[index].y = 700;
  setTimeout(() => {
    ecosystems.value[index].showCurrent = false;
    ecosystems.value[index].y = 500;
    ecosystems.value[index].split = true;
  }, 3000);
}

function exit(index) {
  setTimeout(() => {
    ecosystems.value[index].y = -100;
    setTimeout(() => {
      ecosystems.value[index].showAboveBelow = false;
      ecosystems.value[index].split = false;
    }, 2000);
  }, 1000);
}

onMounted(() => {
  setInterval(() => {
    setParticlePositions();
  }, 60000);
  setTimeout(() => {
    setParticlePositions();
  }, 1000);

  // //set zindex of circles
  // for (let i = 0; i < 6; i++) {
  //   var element = SVG("#circle-" + ecosystems.value[i].name);
  //   element.back();
  // }
});
</script>

<style lang="scss">
html {
  background-color: black;
  font-family: Arial, "Helvetica Neue", Helvetica !important;
}

label {
  font-size: 25px;
}

input[type="text"] {
  font-size: 25px;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

img {
  object-fit: cover;
}
</style>
