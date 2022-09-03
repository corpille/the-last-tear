import Game from './game';
import { STEP } from './config';
import { renderSprite } from './sprite';

export function stopPlayer(gI) {
  gI.xOffset = 0;
  renderSprite(gI.player, gI.player.sprite);
  gI.player.movAn.currKF = 0;
}

export function handleMovement() {
  const gI = Game.getIns();
  // Movement
  if (gI.xOffset) {
    if (
      (gI.xOffset > 0 && gI.player.x + gI.xOffset < gI.autoMove) ||
      (gI.xOffset < 0 && gI.player.x + gI.xOffset > gI.autoMove) ||
      (gI.player.x + gI.xOffset > 0 &&
        gI.player.x + gI.xOffset <
          gI.canEl.offsetWidth + gI.delta - gI.player.sprite[0].length * 10)
    ) {
      gI.player.x += gI.xOffset;

      // Animation
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

      if (
        gI.player.x >= gI.canEl.offsetWidth / 2 + -gI.player.width &&
        gI.player.x <= gI.levEl.offsetWidth - gI.canEl.offsetWidth / 2 &&
        gI.levElPos - gI.xOffset > -gI.delta &&
        gI.levElPos - gI.xOffset < 0
      ) {
        gI.levElPos -= gI.xOffset;
      }
    }
    if (
      gI.autoMove &&
      ((gI.xOffset > 0 && gI.player.x > gI.autoMove) ||
        (gI.xOffset < 0 && gI.player.x < gI.autoMove))
    ) {
      delete gI.autoMove;
      stopPlayer(gI);
    }
    gI.levEl.style.transform = `translate3d(${gI.levElPos}px,0, 0)`;
  }
}

export function jump() {
  const gI = Game.getIns();
  gI.player.y += gI.jump * STEP;
  if (gI.jump === 1 && gI.player.y > 100) {
    gI.jump = -1;
  } else if (gI.jump === -1 && gI.player.y === 0) {
    gI.jump = 0;
  }
}
