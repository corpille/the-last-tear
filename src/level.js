import Game from './game';
import { DEFAULT_PIXEL_SIZE } from './config';
import { generateSprite } from './sprite';
import level from './level.json';
import * as sprites from './sprites';

export function createObject(o, gI) {
  const scale = o.scale || DEFAULT_PIXEL_SIZE;
  o.currAction = -1;
  let sp = o.sprite;
  o.height = sp.split('|').length * scale;
  o.width = sp.split('|')[0].length * scale;
  if (o.mod) {
    o.mod.forEach((mod) => {
      sp = sp.split(mod[0]).join(mod[2]);
    });
  }
  const { bs, bg, s } = generateSprite(sp, o.scale);
  if (o.animation) {
    o.animation.tick = 0;
  }
  if (o.movAn) {
    o.movAn.tick = 0;
  }
  o.el = document.createElement('div');
  o.el.classList.add(o.id);
  o.el.id = o.id;
  if (o.flipped) {
    o.el.classList.add('flipped');
  }
  o.el.style.cssText = `height:${s};width:${s};background-color:${bg};box-shadow:${bs};`;
  gI.levEl.appendChild(o.el);
  gI.scene[o.id] = o;
  return o;
}

function renderObject(gI, id, o, sprite) {
  o.el = document.createElement('div');
  o.el.id = o.id;
  o.el.classList.add(id);
  const cssText = `animation-delay:${Math.random()}s;height:${sprite.s};width:${
    sprite.s
  };background-color:${sprite.bg};left:${o.x}px;bottom:${o.y}px;box-shadow:${
    sprite.bs
  };
      `;
  if (o.flipped) {
    o.el.classList.add('flipped');
  }
  o.el.style.cssText = cssText;
  gI.levEl.appendChild(o.el);
}

function drawStructure(gI, object) {
  const scale = object.scale || DEFAULT_PIXEL_SIZE;
  const sprites = object.sprites.map((sprite) => {
    return {
      ...generateSprite(sprite, object.scale),
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
    const scale = object.scale || DEFAULT_PIXEL_SIZE;
    const sprites = [object.sprite, ...(object?.variants || [])].map(
      (sprite) => ({
        ...generateSprite(sprite, object.scale),
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

export function loadLevel() {
  const gI = Game.getIns();
  gI.levEl.innerHTML = '';
  gI.levEl.style.width = `${level.width}px`;
  gI.delta = gI.levEl.offsetWidth - gI.canEl.offsetWidth;
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
