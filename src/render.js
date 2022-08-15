import Game from './models/game.model';
import { HITBOX_RADIUS, TICK_PER_ANIMATION_KEYFRAME } from './config';

function canMakeAction(gI, object) {
  const nextAction = object.actions[object.currentAction + 1];
  return (
    nextAction &&
    (!nextAction.condition ||
      (nextAction.condition && gI.inventory[nextAction.condition])) &&
    !gI.currentLines
  );
}

export function renderScene() {
  const gI = Game.getInstance();
  Object.values(gI.sceneObjects).forEach((object) => {
    if (
      object.visible &&
      object.actions &&
      object.actions.length > 0 &&
      object.currentAction < object.actions.length - 1
    ) {
      if (
        gI.player.x + gI.player.width > object.x - HITBOX_RADIUS &&
        gI.player.x + gI.player.width <
          object.x + object.width + HITBOX_RADIUS &&
        canMakeAction(gI, object)
      ) {
        gI.currentAvailableAction = object.id;
      } else if (gI.currentAvailableAction === object.id) {
        gI.currentAvailableAction = undefined;
      }
    }

    // Animation
    if (object.visible && object.animation) {
      const anim = object.animation;
      if (gI.tick % anim.tickPerFrame === 0) {
        object.element.classList.remove(`key-${anim.currentKeyFrame}`);
        anim.currentKeyFrame++;
        if (anim.currentKeyFrame > anim.nbKeyframes) {
          anim.currentKeyFrame = 0;
        }
        object.element.classList.add(`key-${anim.currentKeyFrame}`);
      }
    }

    if (object.visible) {
      object.element.style.opacity = '1';
      object.element.style.left = `${object.x}px`;
      object.element.style.bottom = `${object.y}px`;
    } else {
      object.element.style.opacity = '0';
    }
  });

  // Display action button
  if (gI.currentAvailableAction) {
    const object = gI.sceneObjects[gI.currentAvailableAction];
    gI.actionButton.visible = true;
    gI.actionButton.x = object.x - 10 - gI.actionButton.width;
    gI.actionButton.y = object.y + object.height + gI.actionButton.height;
    gI.currentAvailableAction = object.id;
  } else {
    gI.actionButton.visible = false;
  }
}

export function renderInventory() {
  const gI = Game.getInstance();
  if (gI.inventoryElement.children.length != Object.keys(gI.inventory).length) {
    gI.inventoryElement.innerHTML = '';
    Object.values(gI.inventory).forEach((object) => {
      const slot = document.createElement('div');
      slot.classList.add('slot');
      const item = document.createElement('div');
      item.id = object.id;
      slot.appendChild(item);
      gI.inventoryElement.appendChild(slot);
    });
  }
}
