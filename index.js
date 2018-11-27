const CENTER_X = 1661;
const CENTER_Y = 344;
// const OUTER_RADIUS = 11/2;
// const NUM_LAYERS = 5;
const NUM_LAYERS = 4;
const INNER_RADIUS = 750 / 2;
const ANGLE_OFFSET = 5;
const layerWidth = 63//(OUTER_RADIUS - INNER_RADIUS) / NUM_LAYERS * 2

const flow = (...fns) => fns.reduceRight((f, g) => (...args) => f(g(...args)));

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const image = new Image();

function animate(fn) {
  function loop(t) {
    requestAnimationFrame(loop);
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

function velocity() {
  let currentValue = 0;
  let endValue = 0;
  const someSortOfSpeedVariable = 10;

  setInterval(() => {
    currentValue += (endValue - currentValue) / someSortOfSpeedVariable;
  }, 15);

  return function(props) {
    endValue = props.angleOffset;

    return {
      ...props,
      angleOffset: currentValue
    }
  }
}

function render({angleOffset, centerX, centerY}) {
  // ctx.drawImage(image, 0, 0);

  for (let i = 0; i < NUM_LAYERS; i++) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, INNER_RADIUS + (NUM_LAYERS - i) * layerWidth, 0, Math.PI * 2, true);
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
  ctx.drawImage(image, 0, 0);

  animate(
    flow(
      t => ({
        angleOffset: 2 * Math.sin(t / 30000 * Math.PI * 2),
        centerX: CENTER_X,
        centerY: CENTER_Y,
      }),
      mouseReactive(({mouseX, mouseY}, {angleOffset}) => ({
        angleOffset: angleOffset * Math.abs(CENTER_X - mouseX) / CENTER_X
      })),
      velocity(),

      render
    )
  );
}, false);
image.src = 'ad.jpg'