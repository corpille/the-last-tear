import Game from './models/game.model';
import { STEP, TICK_PER_ANIMATION_KEYFRAME } from './config';

export function handleMovement() {
  const gI = Game.getInstance();
  // Movement
  if (gI.xOffset) {
    if (
      gI.player.x + gI.xOffset > 0 &&
      gI.player.x + gI.xOffset <
        gI.canvasElement.offsetWidth + gI.delta - gI.player.width
    ) {
      gI.player.x += gI.xOffset;

      // Animation
      if (gI.tick === TICK_PER_ANIMATION_KEYFRAME) {
        gI.player.element.classList.remove(`key-${gI.player.currentKeyFrame}`);
        gI.player.currentKeyFrame++;
        if (gI.player.currentKeyFrame > gI.player.nbKeyframes) {
          gI.player.currentKeyFrame = 0;
        }
        gI.player.element.classList.add(`key-${gI.player.currentKeyFrame}`);
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
