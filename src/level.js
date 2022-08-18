import Game from './models/game.model';
import { DEFAULT_PIXEL_SIZE } from './config';
import { generateSprite } from './sprite';
import * as levels from './levels';
import * as sprites from './sprites';

export function createObject(o, gI, levelWidth) {
  const scale = o.spriteScale || DEFAULT_PIXEL_SIZE;
  o.currentAction = -1;
  o.height = o.sprite.length * scale;
  o.width = o.sprite[0].length * scale;
  const { boxShadow, backgroundColor, size } = generateSprite(
    o.sprite,
    o.spriteScale
  );
  if (o.animation) {
    o.animation.currentTick = 0;
  }
  if (o.movementAnimation) {
    o.movementAnimation.currentTick = 0;
  }
  o.spacing = o.spacing || 0;
  let x = 1;
  const offset = o.width;
  if (o.repeat) {
    x = Math.ceil(levelWidth / offset);
  }
  let object;
  let lastx = o.x;
  for (let i = 0; i < x; i++) {
    object = Object.assign({}, o);
    object.x = lastx;
    object.id = `${object.id}${x > 1 ? '-' + i : ''}`;
    object.element = document.createElement('div');
    object.element.id = object.id;
    object.element.style.height = size;
    object.element.style.width = size;
    object.element.style.boxShadow = boxShadow;
    object.element.style.backgroundColor = backgroundColor;
    gI.levelElement.appendChild(object.element);
    gI.sceneObjects[object.id] = object;
    const off = Math.floor(Math.random() * o.spacing) + 1;
    lastx = lastx + o.width + off;
  }
  return object || o;
}

export async function loadLevel(name) {
  const gI = Game.getInstance();
  const level = levels[name];
  gI.levelElement.innerHTML = '';
  gI.levelElement.style.width = `${level.width}px`;
  gI.delta = gI.levelElement.offsetWidth - gI.canvasElement.offsetWidth;
  level.objects.forEach((object) =>
    createObject(
      {
        ...object,
        ...sprites[object.id],
      },
      gI,
      level.width
    )
  );
}
