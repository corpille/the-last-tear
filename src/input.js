import Game from './models/game.model';
import { displayNextActionMessage, toggleAction } from './action';
import { STEP } from './config';

export function bindCommands() {
  document.addEventListener('keyup', function (event) {
    const gI = Game.getInstance();
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      gI.xOffset = 0;
      gI.player.element.classList.remove(`key-${gI.player.currentKeyFrame}`);
      gI.player.currentKeyFrame = 0;
    }
  });

  document.addEventListener('keydown', function (event) {
    const gI = Game.getInstance();
    const key = event.key;
    if (!gI.currentAction) {
      if (key === 'ArrowLeft') {
        gI.player.element.classList.add('left');
        gI.xOffset = -STEP;
      } else if (key === 'ArrowRight') {
        gI.player.element.classList.remove('left');
        gI.xOffset = STEP;
      } else if (key === ' ' && gI.jumpState === 0) {
        gI.jumpState = 1;
      }
    }
    if (key === 'e') {
      if (gI.currentAvailableAction && !gI.currentAction) {
        toggleAction();
      } else if (gI.currentAction) {
        displayNextActionMessage();
      }
    }
  });
}
