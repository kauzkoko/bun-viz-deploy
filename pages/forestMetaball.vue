<template>
  <div w-screen h-screen flexCenter @click="animate()" bg-black>
    <div class="pointer-events-none! fixed" id="p5" />
  </div>
  <div
    bg-hex-1F6100
    aspect-1
    w-440px
    rounded-full
    top-300px
    fixed
    transform-gpu
    class="translate--50%"
    :style="{ left: windowWidth / 2 + 'px' }"
  ></div>
  <div
    aspect-1
    w-200px
    rounded-full
    top-300px
    fixed
    transform-gpu
    class="translate--50%"
    flexCenter
    :style="{
      left: windowWidth / 2 + 'px',
    }"
  >
    <div
      w-full
      h-full
      style="background-image: url('/yellowtoken.png')"
      :style="{
        transform: 'rotate(' + rotation + 'deg)',
        transition: 'transform linear 4s',
      }"
    ></div>
  </div>
  <div left-2 top-2 fixed text-yellow>{{ windowHeight }}</div>
</template>

<script setup>
import { TransitionPresets } from "@vueuse/core";
// const { fragmentShader, vertexShader } = useShaders(5);
const { fragmentShader, vertexShader } = useShadersHardcoded({
  balls: 2,
  color: [0, 0, 0, 1],
});
const { width: windowWidth, height: windowHeight } = useWindowSize();
const y = ref(300);
let width = 800;
let height = windowHeight.value;
let metaballShader;
let bioms = [
  { x: width / 2, y: 300, r: 200, color: [1.0, 0.0, 0.0, 1.0] },
  { x: width / 2, y: 1200, r: 50, color: [0.0, 1.0, 0.0, 1.0] },
];
let balls = [];
let multiplier = 2;

class Ball {
  constructor(x, y, r) {
    this.pos = {
      x: x,
      y: height - y,
    };

    this.r = r;
  }
}

const trans = ref();
const source = ref(bioms[1].y);
const output = useTransition(source, {
  duration: 5000,
  transition: trans,
});

const rotation = ref(0);
const clicked = ref(false);
const animate = () => {
  setTimeout(
    () => {
      rotation.value += 270;
    },
    clicked.value ? 0 : 1000
  );
  trans.value = clicked.value
    ? TransitionPresets.easeIn
    : TransitionPresets.linear;
  source.value = clicked.value ? 1200 : 300;
  clicked.value = !clicked.value;
};

onMounted(() => {
  let sketch = (p5) => {
    p5.setup = () => {
      let canvas = p5.createCanvas(width, height, p5.WEBGL);
      canvas.parent("p5");
      metaballShader = p5.createShader(vertexShader, fragmentShader);
      p5.shader(metaballShader);

      balls = [];
      for (let i = 0; i < bioms.length; i++) {
        balls.push(new Ball(bioms[i].x, bioms[i].y, bioms[i].r));
      }

      metaballShader.setUniform("width", width);
      metaballShader.setUniform("height", height);
      metaballShader.setUniform("test", [0.1, 0.1, 0.1, 1.0]);
      metaballShader.setUniform("testArray", [
        [0.0, 1.0, 0.0, 1.0],
        [1.0, 0.0, 0.0, 1.0],
      ]);
    };

    p5.draw = () => {
      p5.clear();
      bioms.forEach((biom, index) => {
        if (index === 1) {
          y.value = output.value;
          bioms[index].y = y.value;
        }
      });
      metaballShader.setUniform("height", windowHeight.value);
      metaballShader.setUniform(
        "rs",
        balls.map((b, index) => bioms[index].r * multiplier * 8)
      );
      metaballShader.setUniform(
        "xs",
        balls.map((b, index) => bioms[index].x)
      );
      metaballShader.setUniform(
        "ys",
        balls.map((b, index) => height - bioms[index].y)
      );
      let test = bioms.map((biom, index) => bioms[index].color);
      let flatColors = [];
      bioms.forEach((biom) => {
        flatColors.push(...test);
      });
      // metaballShader.setUniform("ballColors", [0.0, 1.0, 0.0, 1.0]);
      metaballShader.setUniform("ballColors", [...flatColors[1]]);
      p5.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    };
  };
  new p5(sketch);
});
</script>

<style scoped></style>
