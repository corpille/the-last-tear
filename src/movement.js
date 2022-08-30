import Game from './game';
import { STEP } from './config';
import { renderSprite } from './sprite';

export function stopPlayer(gI) {
  gI.xOffset = 0;
  renderSprite(gI.player, gI.player.sprite);
  gI.player.movementAnimation.currentKeyFrame = 0;
}

export function handleMovement() {
  const gI = Game.getInstance();
  // Movement
  if (gI.xOffset) {
    if (
      (gI.xOffset > 0 && gI.player.x + gI.xOffset < gI.autoMove) ||
      (gI.xOffset < 0 && gI.player.x + gI.xOffset > gI.autoMove) ||
      (gI.player.x + gI.xOffset > 0 &&
        gI.player.x + gI.xOffset <
          gI.canvasElement.offsetWidth +
            gI.delta -
            gI.player.sprite[0].length * 10)
    ) {
      gI.player.x += gI.xOffset;

      // Animation
      const anim = gI.player.movementAnimation;
      if (anim.currentTick == anim.tickPerFrame) {
        anim.currentTick = -1;
        renderSprite(
          gI.player,
          gI.player.movementSprites[anim.currentKeyFrame]
        );
        anim.currentKeyFrame++;
        if (anim.currentKeyFrame > anim.nbKeyframes) {
          anim.currentKeyFrame = 0;
        }
      }
      anim.currentTick++;

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
    if (
      gI.autoMove &&
      ((gI.xOffset > 0 && gI.player.x > gI.autoMove) ||
        (gI.xOffset < 0 && gI.player.x < gI.autoMove))
    ) {
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
