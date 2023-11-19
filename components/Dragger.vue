<template>
  <div class="draggable">
    <slot />
  </div>
</template>

<script setup>
import interact from "interactjs";

onMounted(() => {
  interact(".draggable").draggable({
    listeners: {
      move: dragMoveListener,
    },
  });

  function dragMoveListener(event) {
    var target = event.target;
    var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
    target.style.transform = "translate(" + x + "px, " + y + "px)";
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }
  window.dragMoveListener = dragMoveListener;
});
</script>

<style scoped>
.draggable {
  width: 25%;
  min-height: 6.5em;
  margin: 1rem 0 0 1rem;
  background-color: #29e;
  color: white;
  border-radius: 0.75em;
  padding: 4%;
  touch-action: none;
  user-select: none;
  transform: translate(0px, 0px);
}
</style>
