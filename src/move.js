import { renderSprite } from './sprite';
import Game from './game';
import { GRAVITY, JUMP_SPEED, MOVE_SPEED } from './config';
const DOWN = 'down';
const LEFT = 'left';
const RIGHT = 'right';

function Ray(x, y, dir) {
  this.origin = {
    x: x,
    y: y,
  };
  this.direction = dir;
}

function compareInterval(value, low, high) {
  if (low > high) {
    [high, low] = [low, high];
  }

  if (value < low) {
    return -1;
  } else if (value > high) {
    return 1;
  }
  return 0;
}

function intersect(ray, aabb) {
  switch (ray.direction) {
    case DOWN:
      if (ray.origin.y <= aabb.y) {
        if (compareInterval(ray.origin.x, aabb.x, aabb.x + aabb.w) == 0) {
          return {
            x: ray.origin.x,
            y: aabb.y,
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
    case LEFT:
      if (ray.origin.x >= aabb.x + aabb.w) {
        if (compareInterval(ray.origin.y, aabb.y, aabb.y + aabb.h) == 0) {
          return {
            x: aabb.x + aabb.w,
            y: ray.origin.y,
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
    case RIGHT:
      if (ray.origin.x <= aabb.x) {
        if (compareInterval(ray.origin.y, aabb.y, aabb.y + aabb.h) == 0) {
          return {
            x: aabb.x,
            y: ray.origin.y,
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
  }
}

function dist(a, b) {
  var d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  return d < 0.001 ? 0 : d;
}

function raycast(ray) {
  var col = Game.getIns()
    .colliders.map((aabb) => {
      const inter = intersect(ray, aabb);
      return {
        collider: aabb,
        i: inter,
        ray: ray,
        dist: inter && dist(ray.origin, inter),
      };
    })
    .filter((c) => c.i)
    .sort((c1, c2) => c1.dist - c2.dist);

  return col[0];
}

function updatePlayercol(player) {
  const off = 1;
  var leftRays = [
    new Ray(player.x, player.y - off, LEFT), // bottom left
  ];
  var rightRays = [
    new Ray(player.x + player.w, player.y - off, RIGHT), // bottom right
  ];
  var bottomRays = [
    new Ray(player.x + off, player.y, DOWN), // bottom left
    new Ray(player.x + player.w - off, player.y, DOWN), // bottom right
  ];

  const col = {
    left: leftRays.map(raycast).filter((i) => !!i),
    right: rightRays.map(raycast).filter((i) => !!i),
    bottom: bottomRays.map(raycast).filter((i) => !!i),
  };
  return {
    left: Math.min(...col.left.map((x) => x.dist)),
    right: Math.min(...col.right.map((x) => x.dist)),
    bottom: Math.min(...col.bottom.map((x) => x.dist)),
  };
}

function animate(gI) {
  const anim = gI.player.movAn;
  if (anim.tick === anim.tickPerFrame) {
    anim.tick = -1;
    renderSprite(gI.player, gI.player.movS[anim.currKF]);
    anim.currKF++;
    if (anim.currKF > anim.nbKeyframes) {
      anim.currKF = 0;
    }
  }
  anim.tick++;
}

export function updatePlayer(gI, dt) {
  const dist = updatePlayercol({
    x: gI.player.x,
    w: gI.player.width,
    y: gI.player.y + gI.canH,
  });
  gI.player.vx = gI.xOffset;
  gI.player.vy += GRAVITY * dt;

  if (gI.keys['ArrowLeft']) {
    gI.player.vx = -MOVE_SPEED;
  }
  if (gI.keys['ArrowRight']) {
    gI.player.vx = MOVE_SPEED;
  }
  if (gI.keys[' '] && dist.bottom == 0) {
    gI.player.vy = -JUMP_SPEED;
  }

  var horizontalMoveBy = gI.player.vx * dt;
  var verticalMoveBy = gI.player.vy * dt;

  if (gI.player.vx < 0 && dist.left != null) {
    horizontalMoveBy = -Math.min(dist.left, Math.abs(horizontalMoveBy));
  }

  if (gI.player.vx > 0 && dist.right != null) {
    horizontalMoveBy = Math.min(dist.right, Math.abs(horizontalMoveBy));
  }
  if (gI.player.vy > 0 && dist.bottom != null) {
    if (dist.bottom < verticalMoveBy) {
      gI.player.vy = 0;
    }
    verticalMoveBy = Math.min(dist.bottom, Math.abs(verticalMoveBy));
  }
  if (horizontalMoveBy) {
    animate(gI);
  }
  gI.player.x = Math.round(gI.player.x + horizontalMoveBy);
  gI.player.y = Math.round(gI.player.y + verticalMoveBy);
  if (gI.player.x >= gI.autoMove) {
    gI.xOffset = 0;
    gI.autoMove = false;
  }
}
