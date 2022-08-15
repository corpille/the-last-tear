import Game from './models/game.model';
import { STEP } from './config';

export function stopPlayer(gI) {
  gI.xOffset = 0;
  gI.player.element.classList.remove(
    `key-${gI.player.movementAnimation.currentKeyFrame}`
  );
  gI.player.movementAnimation.currentKeyFrame = 0;
}

export function handleMovement() {
  const gI = Game.getInstance();
  // Movement
  if (gI.xOffset) {
    if (
      gI.player.x + gI.xOffset < gI.autoMove ||
      (gI.player.x + gI.xOffset > 0 &&
        gI.player.x + gI.xOffset <
          gI.canvasElement.offsetWidth + gI.delta - gI.player.width)
    ) {
      gI.player.x += gI.xOffset;

      // Animation
      const anim = gI.player.movementAnimation;
      if (gI.tick % anim.tickPerFrame === 0) {
        gI.player.element.classList.remove(`key-${anim.currentKeyFrame}`);
        anim.currentKeyFrame++;
        if (anim.currentKeyFrame > anim.nbKeyframes) {
          anim.currentKeyFrame = 0;
        }
        gI.player.element.classList.add(`key-${anim.currentKeyFrame}`);
      }

      if (
        gI.player.x >= gI.canvasElement.offsetWidth / 2 + -gI.player.width &&
        gI.player.x <=
          gI.levelElement.offsetWidth - gI.canvasElement.offsetWidth / 2 &&
        gI.levelElementPos - gI.xOffset > -gI.delta &&
        gI.levelElementPos - gI.xOffset < 0
      ) {
        gI.levelElementPos -= gI.xOffset;
      }
    }
    if (gI.autoMove && gI.player.x > gI.autoMove) {
      delete gI.autoMove;
      stopPlayer(gI);
    }
    gI.levelElement.style.left = `${gI.levelElementPos}px`;
  }
}

export function jump() {
  const gI = Game.getInstance();
  if (gI.jumpState === 1) {
    gI.player.y += STEP;
    if (gI.player.y === 100) {
      gI.jumpState = 2;
    }
  } else if (gI.jumpState === 2) {
    gI.player.y -= STEP;
    if (gI.player.y === 0) {
      gI.jumpState = 0;
    }
  }
}
