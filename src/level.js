import Game from './models/game.model';
import { DEFAULT_PIXEL_SIZE } from './config';
import { generateSprite } from './sprite';
import * as levels from './levels';
import * as sprites from './sprites';

export function createObject(o, gI) {
  const scale = o.spriteScale || DEFAULT_PIXEL_SIZE;
  o.currentAction = -1;
  let s = o.sprite;
  o.height = s.split('|').length * scale;
  o.width = s.split('|')[0].length * scale;
  if (o.mod) {
    o.mod.forEach((mod) => {
      s = s.split(mod[0]).join(mod[2]);
    });
  }
  const { boxShadow, bg, size } = generateSprite(s, o.spriteScale);
  if (o.animation) {
    o.animation.currentTick = 0;
  }
  if (o.movementAnimation) {
    o.movementAnimation.currentTick = 0;
  }
  o.element = document.createElement('div');
  o.element.classList.add(o.id);
  o.element.id = o.id;
  if (o.flipped) {
    o.element.classList.add('flipped');
  }
  o.element.style.cssText = `height: ${size};width: ${size};background-color: ${bg};box-shadow: ${boxShadow};`;
  gI.levelElement.appendChild(o.element);
  gI.sceneObjects[o.id] = o;
  return o;
}
function renderObject(gI, id, o, sprite) {
  o.element = document.createElement('div');
  o.element.id = o.id;
  o.element.classList.add(id);
  const cssText = `
        animation-delay: ${Math.random()}s;
        height: ${sprite.size};
        width: ${sprite.size};
        background-color: ${sprite.bg};
        left: ${o.x}px;
        bottom: ${o.y}px;
        box-shadow: ${sprite.boxShadow};
      `;
  if (o.flipped) {
    o.element.classList.add('flipped');
  }
  o.element.style.cssText = cssText;
  gI.levelElement.appendChild(o.element);
}

function drawStructure(gI, object) {
  const scale = object.spriteScale || DEFAULT_PIXEL_SIZE;
  const sprites = object.sprites.map((sprite) => {
    return {
      ...generateSprite(sprite, object.spriteScale),
      sprite,
    };
  });
  const width = object.sprites[0].split('|')[0].length * scale;
  const height = object.sprites[0].split('|').length * scale;
  let pos = { x: object.x, y: object.y };
  const struct = object.struct
    .split('|')
    .reverse()
    .map((l) => l.split('').map((p) => parseInt(p)));
  for (let i = 0; i < struct.length; i++) {
    for (let j = 0; j < struct[i].length; j++) {
      if (struct[i][j] !== 0) {
        const sprite = sprites[struct[i][j] - 1];
        const o = Object.assign({}, object, {
          ...pos,
          height: sprite.length * scale,
          width: sprite.width,
          id: `${object.id}${i * struct[i].length + j}`,
        });
        renderObject(gI, object.id, o, sprite);
      }
      pos.x += width;
    }
    pos.y += height;
    pos.x = object.x;
  }
}

export function drawBackground(gI, backgroundElements, levelWidth) {
  backgroundElements.forEach((object) => {
    if (object.struct) {
      return drawStructure(gI, object);
    }
    const scale = object.spriteScale || DEFAULT_PIXEL_SIZE;
    const sprites = [object.sprite, ...(object?.variants || [])].map(
      (sprite) => ({
        ...generateSprite(sprite, object.spriteScale),
        sprite,
        width: sprite.split('|')[0].length * scale,
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
      renderObject(gI, object.id, o, sprite);
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
  gI.diag = level.diag;
  drawBackground(
    gI,
    level.bg.map((o) => ({
      ...o,
      ...sprites[o.s],
      y: o.y || 0,
    })),
    level.width
  );
  level.objects.forEach((o) =>
    createObject(
      {
        ...o,
        ...sprites[o.s],
        y: o.y || 0,
      },
      gI
    )
  );
}
