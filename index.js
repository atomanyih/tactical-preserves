const CENTER_X = 430;
const CENTER_Y = 200;
const OUTER_RADIUS = 200;
// const NUM_LAYERS = 5;
const NUM_LAYERS = 20;
const INNER_RADIUS = 100;
const ANGLE_OFFSET = 5;
const layerWidth = (OUTER_RADIUS - INNER_RADIUS) / NUM_LAYERS

const flow = (...fns) => fns.reduceRight((f, g) => (...args) => f(g(...args)));

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const image = new Image();

function animate(fn) {
  function loop(t) {
    requestAnimationFrame(loop)
    fn(t);
  }

  requestAnimationFrame(loop);
}

function mouseReactive(fn) {
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  return function (props) {
    return {
      ...props,
      ...fn({mouseX, mouseY}, props)
    }
  }
}

function render({angleOffset, centerX, centerY}) {
  ctx.drawImage(image, 0, 0);

  for (let i = 0; i < NUM_LAYERS; i++) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, OUTER_RADIUS - i * layerWidth, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.translate(centerX, centerY);
    ctx.rotate((i + 1) * angleOffset * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  }
}

image.addEventListener('load', () => {
  canvas.width = image.width;
  canvas.height = image.height;
  animate(
    flow(
      t => ({
        angleOffset: (1 * t / 1000) % 360
      }),
      mouseReactive(({mouseX, mouseY}) => ({
        centerX: mouseX,
        centerY: mouseY
      })),
      render
    )
  );
}, false);
image.src = 'abandoned-acoustic-mirrors-denge.jpg'