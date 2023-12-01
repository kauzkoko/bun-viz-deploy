<template>
  <div class="w-full h-full flexCenter pointer-none select-none">
    <div
      class="absolute bg-transparent aspect-1 rounded-full flexCenter flexContainer"
    >
      <div
        @click="stepper()"
        class="absolute aspect-1 rounded-full z-1 transition-all duration-1000 w-220px flexCenter text-40px token"
      ></div>
    </div>
    <div
      @click="sideToggled = false"
      v-if="step > 0"
      class="absolute rounded-full flexCenter animate__animated animate__zoomIn border-5px text-30px text-center border-black border-solid border-1px"
      :style="{
        width: sideToggled ? '100px' : '500px',
        height: sideToggled ? '100px' : '500px',
        transform: sideToggled
          ? `translate(0, ${1000}px)`
          : `translate(0, ${700}px)`,
        background: step === 4 ? 'transparent' : 'rgba(255,255,0,0.5)',
        border: step === 4 ? 'transparent' : '1px solid yellow',
      }"
    >
      <div v-show="sideToggled" text-20px>Switch side</div>
      <div v-show="!sideToggled && step !== 4" class="flexCenter flex-col p-3">
        <div v-if="step !== 3">
          <h1 text-50px>{{ info.amount }}</h1>
          <p class="p-5">{{ info.text }}</p>
        </div>
        <div v-else>
          <h1 text-40px>{{ info.amount }}</h1>
          <h1 text-40px>{{ info.amount2 }}</h1>
          <p class="p-5">{{ info.text }}</p>
        </div>
      </div>
      <div
        class="relative rounded-full w-500px aspect-1 animate__animated animate__zoomIn mt--500px"
        v-show="!sideToggled && step === 4"
      >
        <img
          :src="`/info/${ecosystem.shortName.toLowerCase()}/${imageNumber}.jpg`"
          class="rounded-full w-400px aspect-1"
          @click="toggleImage = !toggleImage"
          :style="{
            zIndex: toggleImage ? 1 : -1,
          }"
        />
        <div
          @click="changeImage()"
          class="absolute w-full aspect-1 rounded-full mt--100px flexCenter flex-col border-black border-solid border-1px animate__animated animate__zoomIn"
          :style="{
            zIndex: toggleImage ? -1 : 1,
            background: 'rgba(255,255,0,0.5)',
            border: '1px solid yellow',
          }"
        >
          <template v-if="imageNumber === 1">
            <h1 class="font-bold">Conservation</h1>
            <p class="p-5">
              What Pete does can Esther too.<br />
              What Pete does can Esther too.<br />
              What Pete does can Esther too
            </p>
          </template>
          <template v-else>
            <h1 class="font-bold">Further infos</h1>
            <img class="w-200px aspect-1 p-5" :src="qrcode" />
          </template>
        </div>
      </div>
    </div>
    <div
      @click="sideToggled = true"
      v-if="step > 0"
      class="absolute rounded-full flexCenter animate__animated animate__zoomIn border-5px text-30px text-center border-black border-solid border-1px"
      :style="{
        width: sideToggled ? '500px' : '100px',
        height: sideToggled ? '500px' : '100px',
        transform: sideToggled
          ? `rotate(180deg) translate(0, ${700}px)`
          : `rotate(180deg) translate(0, ${1000}px)`,
        background: step === 4 ? 'transparent' : 'rgba(255,255,0,0.5)',
        border: step === 4 ? 'transparent' : '1px solid yellow',
      }"
    >
      <div v-show="!sideToggled" text-20px>Switch side</div>
      <div v-show="sideToggled && step !== 4" class="flexCenter flex-col p-3">
        <div v-if="step !== 3">
          <h1 text-50px>{{ info.amount }}</h1>
          <p class="p-5">{{ info.text }}</p>
        </div>
        <div v-else>
          <h1 text-40px>{{ info.amount }}</h1>
          <h1 text-40px>{{ info.amount2 }}</h1>
          <p class="p-5">{{ info.text }}</p>
        </div>
      </div>
      <div
        class="relative rounded-full w-500px aspect-1 animate__animated animate__zoomIn mt--500px"
        v-show="sideToggled && step === 4"
      >
        <img
          :src="`/info/${ecosystem.shortName.toLowerCase()}/${imageNumber}.jpg`"
          class="rounded-full w-400px aspect-1"
          @click="toggleImage = !toggleImage"
          :style="{
            zIndex: toggleImage ? 1 : -1,
          }"
        />
        <div
          @click="changeImage()"
          class="absolute w-full aspect-1 rounded-full mt--100px flexCenter flex-col border-black border-solid border-1px animate__animated animate__zoomIn"
          :style="{
            zIndex: toggleImage ? -1 : 1,
            background: 'rgba(255,255,0,0.5)',
            border: '1px solid yellow',
          }"
        >
          <template v-if="imageNumber === 1">
            <h1 class="font-bold">Conservation</h1>
            <p class="p-5">
              What Pete does can Esther too.<br />
              What Pete does can Esther too.<br />
              What Pete does can Esther too
            </p>
          </template>
          <template v-else>
            <h1 class="font-bold">Further infos</h1>
            <img class="w-200px aspect-1 p-5" :src="qrcode" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  ecosystem: Object,
});
const emit = defineEmits([
  "showCurrent",
  "showPotential",
  "showAboveBelow",
  "exit",
]);
const qrcode = useQR("https://neve.rsvp", {
  margin: 0,
  errorCorrectionLevel: "H",
  color: {
    dark: "#000",
    light: "#fff0",
  },
});

const sideToggled = ref(false);
const toggleImage = ref(true);
const tokenImage = computed(() => {
  let string = `url("/ecosystems/${props.ecosystem.name.toLowerCase()}.jpeg")`;
  return string;
});

const step = ref(0);
function stepper() {
  if (step.value === 0) {
    emit("showCurrent", props.ecosystem.index);
  } else if (step.value === 1) {
    emit("showPotential", props.ecosystem.index);
  } else if (step.value === 2) {
    console.log("show above below");
    emit("showAboveBelow", props.ecosystem.index);
  } else if (step.value === 3) {
    console.log("show info");
    emit("exit", props.ecosystem.index);
  }
  if (step.value < 4) step.value++;
  else step.value = 0;
}

const info = computed(() => {
  if (step.value === 0) {
    return {
      title: "Welcome",
      amount: "Leave me alone",
      text: "Should not be shown",
    };
  } else if (step.value === 1) {
    return {
      title: "Potential",
      amount: "800 Gt",
      text: "This is the amount of CO2 currently stored in the ecosystem",
    };
  } else if (step.value === 2) {
    if (props.ecosystem.noPotential) {
      return {
        title: "Info",
        text: "Uups, there is no data available for this ecosystem. Turn the wheel.",
      };
    }
    return {
      title: "Current",
      amount: "287 Gt",
      text: "Amount of CO2 that potentially can be stored in the ecosystem",
    };
  } else if (step.value === 3) {
    if (props.ecosystem.noPotential) {
      return {
        title: "Info",
        text: "Uups, there is no data available for this ecosystem. Turn the wheel.",
      };
    }
    return {
      title: "Above & Below",
      amount: "100Gt Above Ground +",
      amount2: "187 Gt Below Ground",
      text: "Amount of CO2 that potentially can be stored in the ecosystem",
    };
  } else if (step.value === 4) {
    return {
      title: "Info",
      text: "Amount of CO2 currently stored in the ecosystem",
    };
  }
});

const imageNumber = ref(1);
function changeImage() {
  console.log("change image");
  if (imageNumber.value < 2) imageNumber.value++;
  else imageNumber.value = 1;
}
</script>

<style lang="scss">
.flexContainer {
  .token {
    mix-blend-mode: normal;
    background-image: v-bind(tokenImage);
    background-size: cover;
  }
}
</style>
