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
        <circle :cx="x" :cy="y" r="100" fill="red" />
        <circle cx="500" cy="500" r="100" fill="red" />
        <circle cx="800" cy="500" r="50" fill="blue" />
      </g>
    </svg>
    <pre text-50px>x: {{ x }}</pre>
    <pre text-50px>y: {{ y }}</pre>
    <div bg-red text-50px>
      notes for red: start touching at 285y when r = 100 for both and x and y at
      500 of static<br />
      so difference is 215px
    </div>
    <div bg-blue text-50px>
      notes for red: start touching at 335y when r = 50 for blue and x and y at
      500 of static<br />
      so difference is 215px
    </div>
    <div bg-gray text-50px>conclusion: its always the same difference</div>
  </div>
</template>

<script setup>
const { x, y } = useMouse();
</script>
