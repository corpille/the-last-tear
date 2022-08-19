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
    object.element.classList.add(object.id);
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

export function drawBakground(gI, backgroundElements, levelWidth) {
  backgroundElements.forEach((object) => {
    const scale = object.spriteScale || DEFAULT_PIXEL_SIZE;
    const sprites = [object.sprite, ...(object?.variants || [])].map(
      (sprite) => ({
        ...generateSprite(sprite, object.spriteScale),
        sprite,
        width: sprite[0].length * scale,
      })
    );
    const maxWidth = sprites.reduce((r, s) => (r > s.width ? r : s.width), 0);
    let lastx = object.x;
    const nbSprite = object.repeat ? Math.ceil(levelWidth / maxWidth) : 1;
    for (let i = 0; i < nbSprite; i++) {
      const sI = Math.floor(Math.random() * sprites.length);
      const sprite = sprites[sI];
      const o = Object.assign({}, object, {
        x: lastx,
        y: object.spread ? Math.round(Math.random() * 250) + 250 : object.y,
        height: sprite.length * scale,
        width: sprite.width,
        id: `${object.id}${nbSprite > 1 ? '-' + i : ''}`,
      });
      o.element = document.createElement('div');
      o.element.id = o.id;
      o.element.classList.add(object.id);
      const cssText = `
        animation-delay: ${Math.random()}s;
        height: ${sprite.size};
        width: ${sprite.size};
        background-color: ${sprite.backgroundColor};
        left: ${o.x}px;
        bottom: ${o.y}px;
        box-shadow: ${sprite.boxShadow};
      `;
      o.element.style.cssText = cssText;
      gI.levelElement.appendChild(o.element);
      lastx +=
        o.width + (object.spread ? Math.round(Math.random() * 200) + 100 : 0);
    }
  });
}

export function loadLevel(name) {
  const gI = Game.getInstance();
  const level = levels[name];
  gI.levelElement.innerHTML = '';
  gI.levelElement.style.width = `${level.width}px`;
  gI.delta = gI.levelElement.offsetWidth - gI.canvasElement.offsetWidth;
  drawBakground(
    gI,
    level.background.map((object) => ({
      ...object,
      ...sprites[object.id],
    })),
    level.width
  );
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
