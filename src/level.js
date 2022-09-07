import Game from './game';
import { DEFAULT_PIXEL_SIZE } from './config';
import { generateSprite } from './sprite';
import level from './level.json';
import sprites from './sprites.json';
import { rand, parse, css } from './utils';

export function createObject(o, gI) {
  const scale = o.scale || DEFAULT_PIXEL_SIZE;
  o.currAction = -1;
  let sp = o.sprite;
  const p = parse(sp);
  o.height = p.length * scale;
  o.width = p[0].length * scale;
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
  o.el = $$('div');
  o.el.classList.add(o.id);
  o.el.id = o.id;
  if (o.flipped) {
    o.el.classList.add('flipped');
  }
  o.el.style.cssText = css({ bs, bg, s });
  gI.lev.appendChild(o.el);
  gI.scene[o.id] = o;
  return o;
}

function renderObject(gI, id, o, sprite) {
  o.el = $$('div');
  o.el.id = o.id;
  o.el.classList.add(id);
  if (o.flipped) {
    o.el.classList.add('flipped');
  }
  o.el.style.cssText = `animation-delay:${Math.random()}s;left:${
    o.x
  }px;bottom:${o.y}px;${css(sprite)}`;
  gI.lev.appendChild(o.el);
}

function drawStructure(gI, object) {
  const scale = object.scale || DEFAULT_PIXEL_SIZE;
  const sprites = object.sprites.map((sprite) => ({
    sprite,
    ...generateSprite(sprite, object.scale),
  }));
  const p = parse(object.sprites[0]);
  const width = p[0].length * scale;
  const height = p.length * scale;
  let pos = { x: object.x, y: object.y };
  const struct = parse(object.struct, (p) => +p).reverse();
  for (let i in struct) {
    for (let j in struct[i]) {
      if (struct[i][j] !== 0) {
        const sprite = sprites[struct[i][j] - 1];
        const o = {
          ...object,
          ...pos,
          height: sprite.length * scale,
          width: sprite.width,
          id: `${object.id}${i * struct[i].length + j}`,
        };
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
    let sp = object.sprite;
    if (object.mod) {
      object.mod.forEach((mod) => {
        sp = sp.split(mod[0]).join(mod[2]);
      });
    }
    const sprites = [sp, ...(object?.variants || [])].map((sprite) => ({
      ...generateSprite(sprite, object.scale),
      sprite,
      width: parse(sprite)[0].length * scale,
    }));
    const maxWidth = sprites.reduce((r, s) => (r > s.width ? r : s.width), 0);
    let lastx = object.x;
    const nbSprite = object.repeat ? Math.ceil(levelWidth / maxWidth) : 1;
    for (let i = 0; i < nbSprite; i++) {
      const sI = rand(0, sprites.length);
      const sprite = sprites[sI];
      const o = {
        ...object,
        x: lastx,
        y: object.spread ? rand(250, 500) : object.y,
        height: sprite.length * scale,
        width: sprite.width,
        id: `${object.id}${nbSprite > 1 ? '-' + i : ''}`,
      };
      renderObject(gI, object.id, o, sprite);
      lastx += o.width + (object.spread ? rand(100, 300) : 0);
    }
  });
}

function initColliders(gI) {
  gI.col = [
    {
      x: -10,
      y: gI.canH,
      h: 0,
      w: gI.levW + 10,
    },
    {
      x: -10,
      y: 0,
      h: gI.canH,
      w: 10,
    },
    {
      x: gI.levW,
      y: 0,
      h: gI.canH,
      w: 10,
    },
    ...Object.values(gI.scene)
      .filter((o) => o.solid)
      .map(({ x, y, height: h, width: w }) => ({
        x,
        y: y + gI.canH - h,
        h,
        w,
      })),
  ];
}

export function loadLevel() {
  const gI = Game.getIns();
  gI.lev.innerHTML = '';
  gI.lev.style.width = `${level.width}px`;
  gI.levW = level.width;
  gI.delta = gI.levW - gI.canW;
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
        ...sprites[o.s],
        ...o,
        y: o.y || 0,
      },
      gI
    )
  );
  initColliders(gI);
}
