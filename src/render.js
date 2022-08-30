import Game from './game';
import { HITBOX_RADIUS } from './config';
import { renderSprite, generateSprite } from './sprite';

function canMakeAction(gI, object) {
  const nextAction = object.actions[object.currAction + 1];
  if (!nextAction || gI.currentLines) {
    return false;
  }
  const inv = Object.keys(gI.inventory);
  const cond = Object.keys(nextAction).filter((c) => c.startsWith('c_'));
  const item = cond.find((c) => inv.includes(c.slice(2, c.length)));
  if (
    nextAction.type === 'msg' &&
    nextAction.cond &&
    !gI.inventory[nextAction.cond]
  ) {
    return false;
  }
  if (nextAction.type === 'cond') {
    if (!item && nextAction.bad === undefined) {
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
      object.currAction < object.actions.length - 1
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
  if (gI.inventoryChanged) {
    gI.inventoryChanged = false;
    gI.inventoryElement.innerHTML = '';
    Object.keys(gI.inventory)
      .filter((id) => !id.startsWith('tmp_'))
      .forEach((id) => {
        const o = gI.inventory[id];
        const slot = document.createElement('div');
        slot.classList.add('slot');
        const item = document.createElement('div');
        item.id = o.id;
        const { boxShadow, bg, size } = generateSprite(o.sprite, o.spriteScale);
        item.style.height = size;
        item.style.width = size;
        item.style.boxShadow = boxShadow;
        item.style.backgroundColor = bg;
        slot.appendChild(item);
        gI.inventoryElement.appendChild(slot);
      });
  }
}
