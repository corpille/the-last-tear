import { renderSprite } from './sprite';
import Game from './game';
import { GRAVITY, JUMP_SPEED, MOVE_SPEED, RACE_WIN } from './config';
import { endRace } from './raceGame';

const Ray = (x, y, dir) => ({
  o: { x, y },
  dir: dir,
});

function compareInterval(value, low, high) {
  if (low > high) {
    [high, low] = [low, high];
  }
  return value < low ? -1 : value > high ? 1 : 0;
}

function intersect(dir, o, aabb) {
  if (
    dir === 'down' &&
    o.y <= aabb.y &&
    compareInterval(o.x, aabb.x, aabb.x + aabb.w) == 0
  ) {
    return {
      x: o.x,
      y: aabb.y,
    };
  }
  if (
    dir === 'left' &&
    o.x >= aabb.x + aabb.w &&
    compareInterval(o.y, aabb.y, aabb.y + aabb.h) == 0
  ) {
    return {
      x: aabb.x + aabb.w,
      y: o.y,
    };
  }
  if (
    dir === 'right' &&
    o.x <= aabb.x &&
    compareInterval(o.y, aabb.y, aabb.y + aabb.h) == 0
  ) {
    return {
      x: aabb.x,
      y: o.y,
    };
  }
}

function dist(a, b) {
  var d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  return d < 0.001 ? 0 : d;
}

function raycast(ray) {
  var col = Game.getIns()
    .col.map((aabb) => {
      const inter = intersect(ray.dir, ray.o, aabb);
      return {
        id: aabb.id,
        i: inter,
        ray: ray,
        dist: inter && dist(ray.o, inter),
      };
    })
    .filter((c) => c.i)
    .sort((c1, c2) => c1.dist - c2.dist);

  return col[0];
}

function updatePlayercol(p) {
  const left = raycast(Ray(p.x, p.y - 1, 'left'));
  const right = raycast(Ray(p.x + p.w, p.y - 1, 'right'));
  const bottomDist = [
    Ray(p.x + 1, p.y, 'down'), // bottom left
    Ray(p.x + p.w / 2, p.y, 'down'), // bottom middle
    Ray(p.x + p.w - 1, p.y, 'down'), // bottom right
  ]
    .map(raycast)
    .filter(Boolean);

  const col = [left, right, ...bottomDist];

  if (col.find((e) => e?.id?.startsWith('egg') && e?.dist < 1)) {
    return endRace(false);
  }

  return {
    left: left?.dist,
    right: right?.dist,
    bottom: Math.min(...bottomDist.map((x) => x.dist)),
  };
}

function animate(gI) {
  const anim = gI.p.movAn;
  if (anim.tick === anim.tPF) {
    anim.tick = -1;
    renderSprite(gI.p, gI.p.movS[anim.currKF]);
    anim.currKF++;
    if (anim.currKF > anim.nbKeyframes) {
      anim.currKF = 0;
    }
  }
  anim.tick++;
}

export function updatePlayer(dt) {
  const gI = Game.getIns();
  const dist = updatePlayercol({
    x: gI.p.x + (gI.p.flipped ? -10 : 0),
    w: gI.p.width + (gI.p.flipped ? 0 : -10),
    y: gI.p.y + gI.canH,
  });
  if (!dist) {
    return;
  }
  gI.p.vx = gI.xOffset;
  gI.p.vy += GRAVITY * dt;

  if (gI.keys['ArrowLeft']) {
    gI.p.vx = -MOVE_SPEED;
  }
  if (gI.keys['ArrowRight']) {
    gI.p.vx = MOVE_SPEED;
  }
  if (gI.keys[' '] && dist.bottom == 0) {
    gI.p.vy = -JUMP_SPEED;
  }

  var horizontalMoveBy = gI.p.vx * dt;
  var verticalMoveBy = gI.p.vy * dt;

  if (gI.p.vx < 0 && dist.left != null) {
    horizontalMoveBy = -Math.min(dist.left, Math.abs(horizontalMoveBy));
  }

  if (gI.p.vx > 0 && dist.right != null) {
    horizontalMoveBy = Math.min(dist.right, Math.abs(horizontalMoveBy));
  }
  if (gI.p.vy > 0 && dist.bottom != null) {
    if (dist.bottom < verticalMoveBy) {
      gI.p.vy = 0;
    }
    verticalMoveBy = Math.min(dist.bottom, Math.abs(verticalMoveBy));
  }
  if (horizontalMoveBy) {
    animate(gI);
  }
  gI.p.x += horizontalMoveBy;
  gI.p.y += Math.round(verticalMoveBy);
  if (gI.p.x >= gI.levW + RACE_WIN) {
    endRace(true);
  }
  if (
    (gI.xOffset > 0 && gI.p.x >= gI.autoX) ||
    (gI.xOffset < 0 && gI.p.x < gI.autoX)
  ) {
    gI.xOffset = 0;
    gI.autoX = false;
  }
}
