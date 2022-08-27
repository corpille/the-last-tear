import Game from './models/game.model';
import { HITBOX_RADIUS } from './config';
import { renderSprite, generateSprite } from './sprite';

function canMakeAction(gI, object) {
  if (!gI.canAction && object.id !== 'tb_deave') {
    return false;
  }
  const nextAction = object.actions[object.currentAction + 1];
  if (!nextAction || gI.currentLines) {
    return false;
  }
  if (
    nextAction.type === 'msg' &&
    nextAction.cond &&
    !gI.inventory[nextAction.cond]
  ) {
    return false;
  }
  if (nextAction.type === 'cond') {
    if (!gI.inventory[nextAction.cond] && nextAction.bad === undefined) {
      return false;
    }
  }
  return true;
}

export function renderScene() {
  const gI = Game.getInstance();
  Object.values(gI.sceneObjects).forEach((object) => {
    if (
      !object.hidden &&
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
    if (!object.hidden && object.animation) {
      const anim = object.animation;
      if (anim.currentTick == anim.tickPerFrame) {
        anim.currentTick = -1;
        renderSprite(object, object.idleSprites[anim.currentKeyFrame]);
        anim.currentKeyFrame++;
        if (anim.currentKeyFrame > anim.nbKeyframes - 1) {
          anim.currentKeyFrame = 0;
        }
      }
      anim.currentTick++;
    }

    if (!object.hidden) {
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
    gI.actionButton.hidden = false;
    gI.actionButton.x = object.x - gI.actionButton.width;
    gI.actionButton.y = object.y + object.height;
    gI.currentAvailableAction = object.id;
  } else {
    gI.actionButton.hidden = true;
  }
}

export function renderInventory() {
  const gI = Game.getInstance();
  if (gI.inventoryElement.children.length != Object.keys(gI.inventory).length) {
    gI.inventoryElement.innerHTML = '';
    Object.values(gI.inventory)
      .filter((o) => !o.id.startsWith('tmp_'))
      .forEach((object) => {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        const item = document.createElement('div');
        item.id = object.id;
        const { boxShadow, bg, size } = generateSprite(
          object.sprite,
          object.spriteScale
        );
        item.style.height = size;
        item.style.width = size;
        item.style.boxShadow = boxShadow;
        item.style.backgroundColor = bg;
        slot.appendChild(item);
        gI.inventoryElement.appendChild(slot);
      });
  }
}
