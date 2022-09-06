import Game from './game';
import { HITBOX_RADIUS, STEP } from './config';
import { generateSprite } from './sprite';

function canMakeAction(gI, object) {
  const nextAction = object.actions[object.currAction + 1];
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
  const inv = Object.keys(gI.inventory);
  const cond = Object.keys(nextAction).filter((c) => c.startsWith('c_'));
  const item = cond.find((c) => inv.includes(c.slice(2, c.length)));
  if (nextAction.type === 'cond') {
    if (!item && nextAction.bad === undefined) {
      return false;
    }
  }
  return true;
}

export function renderScene() {
  const gI = Game.getIns();
  Object.values(gI.scene).forEach((object) => {
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
        gI.currAvailAct = object.id;
      } else if (gI.currAvailAct === object.id) {
        gI.currAvailAct = undefined;
      }
    }

    const y = (object.id === 'puddle' ? -1 : 1) * object.y;
    if (
      !object.hidden &&
      (object.el.style.left !== `${object.x}px` ||
        object.el.style.bottom !== `${y}px` ||
        object.id === 'actionButton')
    ) {
      object.el.style.opacity = '1';
      object.el.style.left = `${object.x}px`;
      object.el.style.bottom = `${y}px`;
    } else if (object.hidden && object.el.style.opacity !== '0') {
      object.el.style.opacity = '0';
    }
  });

  // Display action button
  if (gI.currAvailAct) {
    const object = gI.scene[gI.currAvailAct];
    gI.actionButton.hidden = false;
    gI.actionButton.x = object.x - gI.actionButton.width;
    gI.actionButton.y = object.y + object.height;
  } else {
    gI.actionButton.hidden = true;
  }

  gI.levElPos = gI.player.x - gI.canW / 2 + gI.player.width / 2;
  if (gI.levElPos < 0) {
    gI.levElPos = 0;
  }
  if (gI.levElPos > gI.levW - gI.canW) {
    gI.levElPos = gI.levW - gI.canW;
  }
  gI.levEl.style.transform = `translate3d(${-gI.levElPos}px,0, 0)`;
}

export function renderInventory() {
  const gI = Game.getIns();
  if (gI.inventoryChanged) {
    gI.inventoryChanged = false;
    gI.invEl.innerHTML = '';
    Object.keys(gI.inventory)
      .filter((id) => !id.startsWith('tmp_'))
      .forEach((id) => {
        const o = gI.inventory[id];
        const slot = document.createElement('div');
        slot.classList.add('slot');
        const item = document.createElement('div');
        item.id = o.id;
        const { bs, bg, s } = generateSprite(o.sprite, o.scale);
        item.style.cssText = `height:${s};width:${s};box-shadow:${bs};background:${bg}`;
        slot.appendChild(item);
        gI.invEl.appendChild(slot);
      });
  }
}
