<template>
  <div class="w-full h-full flexCenter">
    <div
      class="bg-transparent aspect-1 rounded-full flexCenter transition-all duration-1000 outline"
      :style="{
        width: `${ecosystem.currentRadius}px`,
        height: `${ecosystem.currentRadius}px`,
        border: hideCurrentLine
          ? '1px solid rgba(255,255,255,0)'
          : '1px solid rgba(255,255,255,0.8)',
      }"
    >
      <div
        class="absolute bg-green opacity-80 aspect-1 rounded-full z--1 transition-all duration-3000 ease-in"
        :style="{
          width: `${currentWidth}px`,
        }"
      />
      <div
        @click="stepper()"
        class="absolute bg-yellow aspect-1 rounded-full z-1 transition-all duration-1000 w-220px flexCenter text-40px"
      >
        {{ step }}
      </div>
    </div>
    <div
      @click="sideToggled = false"
      v-if="step > 0"
      class="absolute bg-white transform-gpu translate-y-500px rounded-full flexCenter transition-all duration-1000 animate__animated animate__zoomIn border-5px border-yellow border-solid text-30px text-center"
      :style="{
        width: sideToggled ? '100px' : '300px',
        height: sideToggled ? '100px' : '300px',
      }"
    >
      {{ sideToggled ? "switch side" : infoText }}
    </div>
    <div
      @click="sideToggled = true"
      v-if="step > 0"
      class="absolute bg-white transform-gpu translate-y--800px rotate-180 rounded-full flexCenter transition-all duration-1000 animate__animated animate__zoomIn text-center"
      :style="{
        width: sideToggled ? '300px' : '100px',
        height: sideToggled ? '300px' : '100px',
      }"
    >
      {{ sideToggled ? infoText : "switch side" }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  ecosystem: Object,
});
const hideCurrentLine = ref(false);
const hidePotentialLine = ref(false);
const currentWidth = ref(220);
const potentialWidth = ref(props.ecosystem.currentRadius.value);
const sideToggled = ref(false);

const outlineStyle = computed(() =>
  hidePotentialLine.value
    ? "1px solid rgba(255,255,255,0)"
    : "1px solid rgba(255,255,255,.8)"
);
const outlineOffset = computed(() => {
  let string = `${
    (props.ecosystem.potentialRadius - props.ecosystem.currentRadius) / 2
  }px`;
  return string;
});

const step = ref(0);
function stepper() {
  if (step.value === 0) {
    currentWidth.value = props.ecosystem.currentRadius;
    setTimeout(() => {
      hideCurrentLine.value = true;
    }, 3000);
  } else if (step.value === 1) {
    // same color approach
    currentWidth.value = props.ecosystem.potentialRadius;
    // different color approach
    // potentialWidth.value = props.ecosystem.potentialRadius;
    setTimeout(() => {
      hidePotentialLine.value = true;
    }, 3000);
  } else if (step.value === 2) {
    console.log("show above below");
  } else if (step.value === 3) {
    console.log("show info");
  }
  if (step.value < 4) step.value++;
  else step.value = 0;
}

const infoText = computed(() => {
  if (step.value === 0) {
    return "";
  } else if (step.value === 1) {
    return "Welcome you see current";
  } else if (step.value === 2) {
    return "You see now potential";
  } else if (step.value === 3) {
    return "You now see above and below stuff";
  } else if (step.value === 4) {
    return "I am information about the project";
  }
});
</script>

<style>
.outline {
  outline: v-bind(outlineStyle);
  outline-offset: v-bind(outlineOffset);
}
</style>
