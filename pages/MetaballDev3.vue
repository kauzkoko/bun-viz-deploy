<template>
  <div w-screen h-screen overflow-hidden>
    <svg
      width="1920px"
      height="1080px"
      class="border-black border-solid border-1px m-5"
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
      <g filter="url(#metaballFilter)">
        <circle :cx="800" :cy="y" :r="100" fill="red" />
        <circle cx="800" cy="500" :r="fakedR" fill="blue" />
      </g>
    </svg>
    <pre text-50px>x: {{ x }}</pre>
    <pre text-50px>y: {{ y }}</pre>
    <div bg-blue text-50px>
      difference between red and blue is: {{ difference }}
    </div>
    <div text-50px>
      if r is 100, then r^2*PI = A: {{ Math.pow(100, 2) * Math.PI }}<br />
      if A is 31415.93, then r^2*PI = A -> sqr(A/PI) = r:
      {{ Math.sqrt(31415.93 / Math.PI) }}<br />
      so if A*2 is 31415.93*2=~61830, then r^2*PI = 2A -> sqr(2*A/PI) = r:
      {{ Math.sqrt((2 * 31415.93) / Math.PI) }}
    </div>
  </div>
</template>

<script setup>
import { diff } from "ohash";

const { x, y } = useMouse();
const difference = computed(() => Math.abs(y.value - 500));
watch(x, () => {
  console.log("difference on y between red and blue is: ", y.value - 500);
});
const fakedR = computed(() => {
  if (difference.value < 215) {
    return (
      100 +
      useMap(
        difference.value,
        215,
        0,
        0,
        Math.sqrt((2 * 31415.93) / Math.PI) - 100
      )
    );
  } else {
    return 100;
  }
});
</script>
