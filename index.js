const CENTER_X = 430;
const CENTER_Y = 200;
const OUTER_RADIUS = 200;
const NUM_LAYERS = 5;
const INNER_RADIUS = 50;
const ANGLE_OFFSET = 5;
const layerWidth = (OUTER_RADIUS - INNER_RADIUS) / NUM_LAYERS


const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const image = new Image();
image.addEventListener('load', () => {
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  for(let i = 0; i < NUM_LAYERS; i++) {
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, OUTER_RADIUS - i * layerWidth, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.translate(CENTER_X, CENTER_Y);
    ctx.rotate((i+1) * ANGLE_OFFSET * Math.PI / 180);
    ctx.translate(-CENTER_X, -CENTER_Y);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  }


}, false)
image.src = 'abandoned-acoustic-mirrors-denge.jpg'