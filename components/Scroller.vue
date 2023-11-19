<template>
  <div
    @click="toggleY()"
    ref="scroller"
    class="overflow-y-scroll scroller rounded-full"
    :style="{
      width: `${props.width}px`,
      height: `${props.height}px`,
    }"
  >
    <div class="bg-blue">
      <div
        v-for="n in 100"
        :style="{ background: `rgb(${n}, ${255 - n}, ${100})` }"
      >
        <span class="opacity-0 text-center">{{ n }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const scroller = ref();
const props = defineProps({
  width: Number,
  height: Number,
});
const emit = defineEmits(["update"]);

const { x, y, isScrolling, arrivedState, directions } = useScroll(scroller);
watch(isScrolling, () => {
  // let normalized = y.value / 1400;
  let normalized = y.value / scroller.value.scrollHeight;
  emit("update", normalized);
});

const toggleY = () => {
  if (y.value) y.value = 0;
  else y.value = scroller.value.scrollHeight;
};
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scroller::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scroller {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
