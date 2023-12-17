<template>
  <div>
    <div
      v-for="n in 6"
      :id="`drag-${n}`"
      class="draggable flex justify-center items-center"
      ref="allRefs"
    >
      <div class="flex items-center justify-center">
        <div
          class="aspect-1 absolute bg-black rounded-full"
          :style="{
            width: `${attractiveBodiesData[n - 1].size * 2 - 40}px`,
          }"
        />
        <Scroller
          @update="(e) => onEmit(e, n)"
          :width="100"
          :height="100"
          class="absolute z-1000"
        />
      </div>
    </div>
    <div class="pointer-events-none! fixed" id="p5" />
    <div class="fixed top-0 left-960px translate-x--50% bg-blue">
      <div class="bg-white border-solid border-black border-1px w-960px h-60px">
        <div
          class="bg-black h-full transition-all duration-5000 transition-ease-in"
          :style="{
            width:
              useMap(
                totalAttraction,
                60000000000000,
                639760239.7602397,
                0,
                100
              ) + '%',
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
//import libraries
import interact from "interactjs";
import {
  use,
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  World,
  Events,
  Mouse,
  Common,
  Body,
} from "matter-js";
import MatterAttractors from "matter-attractors";

//setup dimensions for rendering
let width = 3840 / 2;
let height = 2160 / 2;
let minSize = 200 / 2;

//helper for particles
const PARTICLE_SPEED = 0.8;

//helper for data
let randomValues = [];
for (let i = 0; i < 6; i++) {
  randomValues.push({
    x: 101 + Math.floor(Math.random() * (width - 202)),
    y: 101 + Math.floor(Math.random() * (height - 202)),
  });
}

//init data
let attractiveBodiesData = [
  {
    id: "drag-1",
    size: minSize + 200,
    amount: 200,
    position: {
      x: randomValues[0].x,
      y: randomValues[0].y,
    },
    newPosition: {
      x: randomValues[0].x,
      y: randomValues[0].y,
    },
    attractionValue: ref(100000000000),
  },
  {
    id: "drag-2",
    size: minSize + 100,
    amount: 300,
    position: {
      x: randomValues[1].x,
      y: randomValues[1].y,
    },
    newPosition: {
      x: randomValues[1].x,
      y: randomValues[1].y,
    },
    attractionValue: ref(100000000000),
  },
  {
    id: "drag-3",
    size: minSize + 60,
    amount: 150,
    position: {
      x: randomValues[2].x,
      y: randomValues[2].y,
    },
    newPosition: {
      x: randomValues[2].x,
      y: randomValues[2].y,
    },
    attractionValue: ref(100000000000),
  },
  {
    id: "drag-4",
    size: minSize + 40,
    amount: 200,
    position: {
      x: randomValues[3].x,
      y: randomValues[3].y,
    },
    newPosition: {
      x: randomValues[3].x,
      y: randomValues[3].y,
    },
    attractionValue: ref(100000000000),
  },
  {
    id: "drag-5",
    size: minSize + 20,
    amount: 200,
    position: {
      x: randomValues[4].x,
      y: randomValues[4].y,
    },
    newPosition: {
      x: randomValues[4].x,
      y: randomValues[4].y,
    },
    attractionValue: ref(100000000000),
  },
  {
    id: "drag-6",
    size: minSize,
    amount: 120,
    position: {
      x: randomValues[5].x,
      y: randomValues[5].y,
    },
    newPosition: {
      x: randomValues[5].x,
      y: randomValues[5].y,
    },
    attractionValue: ref(100000000000),
  },
];

//helper for scroller
const totalAttraction = ref(0);
const onEmit = (e, n) => {
  const constrained = Math.max(Math.min(e * 1000000000, 1000000000), 10000);
  attractiveBodiesData[n - 1].attractionValue.value =
    100000000000000000 / constrained;
  if (e === 0) {
    attractedBodies[n - 1].forEach((body, index) => {
      const direction = Math.random() * Math.PI * 2;
      Body.setVelocity(body, {
        x: Math.sin(direction) * PARTICLE_SPEED * 6,
        y: Math.cos(direction) * PARTICLE_SPEED * 6,
      });
    });
  }
  let tempTotalAttraction = 0;
  attractiveBodiesData.forEach((element) => {
    tempTotalAttraction += element.attractionValue.value;
  });
  totalAttraction.value = tempTotalAttraction;
};

let attractedBodies = [[], [], [], [], [], []];
let bodies = [];
const allRefs = ref([]);
onMounted(() => {
  //init matterjs attractor plugin
  use(MatterAttractors);
  let engine = Engine.create();

  //init postioning of attractive bodies
  allRefs.value.forEach((element, index) => {
    element.style.transform = `translate(${attractiveBodiesData[index].newPosition.x}px, ${attractiveBodiesData[index].newPosition.y}px)`;
    element.setAttribute(
      "data-x",
      attractiveBodiesData[index].newPosition.x - 25
    );
    element.setAttribute(
      "data-y",
      attractiveBodiesData[index].newPosition.y - 25
    );
  });

  //dragging stuff
  interact(".draggable").draggable({
    listeners: {
      move: dragMoveListener,
    },
  });
  function dragMoveListener(event) {
    var target = event.target;
    let index = attractiveBodiesData.findIndex((obj) => obj.id === target.id);
    let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
    if (x < width - 100 && x > 100 && y < height - 100 && y > 100) {
      attractiveBodiesData[index].newPosition.x = x;
      attractiveBodiesData[index].newPosition.y = y;
      target.style.transform = "translate(" + x + "px, " + y + "px)";
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    }
  }
  window.dragMoveListener = dragMoveListener;

  //p5 rendering stuff
  let sketch = (p5) => {
    p5.setup = () => {
      let canvas = p5.createCanvas(width, height);
      canvas.parent("p5");
      p5.noStroke();
    };

    p5.draw = () => {
      p5.clear();
      bodies = Composite.allBodies(engine.world);
      for (let i = 0; i < bodies.length; i++) {
        if (bodies[i].biom) {
          attractiveBodiesData[bodies[i].biom - 1].position = {
            x: bodies[i].position.x,
            y: bodies[i].position.y,
          };
        } else if (!bodies[i].attractedTo) {
          p5.strokeWeight(1);
          p5.fill(255);
          p5.ellipse(bodies[i].position.x, bodies[i].position.y, 40);
        } else {
          p5.noStroke();
          p5.stroke(0);
          p5.fill(0);
          p5.ellipse(bodies[i].position.x, bodies[i].position.y, 40);
        }
      }
    };
  };
  new p5(sketch);

  //matter.js physics simulation stuff
  var world = engine.world;
  world.gravity.scale = 0;

  //boundaries
  const wallThickness = 1000;
  const ground = Bodies.rectangle(
    width / 2,
    height + wallThickness / 2,
    width,
    wallThickness,
    {
      isStatic: true,
    }
  );
  const ceiling = Bodies.rectangle(
    width / 2,
    0 - wallThickness / 2,
    width,
    wallThickness,
    {
      isStatic: true,
    }
  );
  const leftWall = Bodies.rectangle(
    0 - wallThickness / 2,
    height / 2,
    wallThickness,
    height,
    {
      isStatic: true,
    }
  );
  const rightWall = Bodies.rectangle(
    width + wallThickness / 2,
    height / 2,
    wallThickness,
    height,
    {
      isStatic: true,
    }
  );
  World.add(engine.world, [ground, ceiling, leftWall, rightWall]);

  //attractive bodies
  let attractors = [];
  for (let i = 0; i < 6; i++) {
    attractors.push(
      Bodies.circle(
        attractiveBodiesData[i].position.x,
        attractiveBodiesData[i].position.y,
        attractiveBodiesData[i].size,
        {
          biom: i + 1,
          isStatic: true,
          plugin: {
            attractors: [
              function (bodyA, bodyB) {
                if (bodyB.attractedTo === i + 1) {
                  return {
                    x:
                      (bodyA.position.x - bodyB.position.x) /
                      attractiveBodiesData[i].attractionValue.value,
                    y:
                      (bodyA.position.y - bodyB.position.y) /
                      attractiveBodiesData[i].attractionValue.value,
                  };
                }
              },
            ],
          },
        }
      )
    );
    World.add(world, attractors[i]);
    for (let j = 0; j < attractiveBodiesData[i].amount; j++) {
      let body = Bodies.rectangle(
        Common.random(0, width),
        Common.random(0, height),
        4,
        4,
        {
          attractedTo: i + 1,
          restitution: 0.5,
          friction: 1,
          frictionAir: 0,
        }
      );
      Body.setInertia(body, Infinity);
      const direction = Math.random() * Math.PI * 2;
      Body.setVelocity(body, {
        x: Math.sin(direction) * PARTICLE_SPEED * 3,
        y: Math.cos(direction) * PARTICLE_SPEED * 3,
      });
      World.add(world, body);
      attractedBodies[i].push(body);
    }
  }

  //unnattractive bodies
  let rest = [];
  for (let j = 0; j < 500; j++) {
    let body = Bodies.rectangle(
      Common.random(0, width),
      Common.random(0, height),
      4,
      4,
      { attractedTo: 0, restitution: 1, friction: 0, frictionAir: 0 }
    );
    Body.setInertia(body, Infinity);
    const direction = Math.random() * Math.PI * 2;
    Body.setVelocity(body, {
      x: Math.sin(direction) * PARTICLE_SPEED,
      y: Math.cos(direction) * PARTICLE_SPEED,
    });
    World.add(world, body);
    rest.push(body);
  }

  //helper function to add energy to the system
  const addEnergy = function (p) {
    const baseSpeed = PARTICLE_SPEED;

    if (p.speed !== 0) {
      let speedMultiplier = baseSpeed / p.speed;

      Body.setVelocity(p, {
        x: p.velocity.x * speedMultiplier,
        y: p.velocity.y * speedMultiplier,
      });
    }
  };

  //updates to the physics simulation
  let counter = 0;
  Events.on(engine, "afterUpdate", function (e) {
    if (e.timestamp >= counter + 500) {
      rest.forEach(function (p) {
        addEnergy(p);
      });
      counter = e.timestamp;
    }
    attractiveBodiesData.forEach((element, index) => {
      Body.translate(attractors[index], {
        x:
          (attractiveBodiesData[index].newPosition.x -
            attractiveBodiesData[index].position.x +
            25) *
          0.25,
        y:
          (attractiveBodiesData[index].newPosition.y -
            attractiveBodiesData[index].position.y +
            25) *
          0.25,
      });
    });
  });

  //init attraction
  for (let i = 0; i < 6; i++) {
    onEmit(0, i + 1);
  }

  //matter.js simulation runner stuff
  var runner = Runner.create();
  Runner.run(runner, engine);
});
</script>

<style scoped>
input[type="range"] {
  width: 80vw;
}

.draggable {
  background-color: red;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  touch-action: none;
  user-select: none;
  transform: translate(0px, 0px);
  position: fixed;
  top: 0;
  left: 0;
  cursor: auto !important;
}
</style>
