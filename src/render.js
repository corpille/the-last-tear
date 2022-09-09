import Game from './game';
import { HITBOX_RADIUS, RACE_WIDTH } from './config';
import { generateSprite } from './sprite';
import { css } from './utils';

function canMakeAction(gI, object) {
  const nextAction = object.a[object.currAction + 1];
  if (!nextAction || gI.currentLines) {
    return false;
  }
  if (
    nextAction.type === 'msg' &&
    nextAction.cond &&
    !gI.inv[nextAction.cond]
  ) {
    return false;
  }
  const inv = Object.keys(gI.inv);
  const cond = Object.keys(nextAction).filter((c) => c.startsWith('c_'));
  const item = cond.find((c) => inv.includes(c.slice(2, c.length)));
  if (nextAction.type === 'cond') {
    if (!item && nextAction.bad === undefined) {
      return false;
    }
  }
  return true;
}

export function calcLevPos(gI) {
  gI.levPos = gI.p.x - gI.canW / 2 + gI.p.width / 2;
  if (gI.levPos < 0 + gI.lOff) {
    gI.levPos = 0 + gI.lOff;
  }
  const lLimit = gI.levW - gI.canW + (gI.lOff ? RACE_WIDTH : 0);
  if (gI.levPos > lLimit) {
    gI.levPos = lLimit;
  }
}

export function renderScene() {
  const gI = Game.getIns();
  Object.values(gI.scene).forEach((object) => {
    if (
      !object.hidden &&
      object.a &&
      object.a.length > 0 &&
      object.currAction < object.a.length - 1
    ) {
      if (
        gI.p.x + gI.p.width > object.x - HITBOX_RADIUS &&
        gI.p.x + gI.p.width < object.x + object.width + HITBOX_RADIUS &&
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

  calcLevPos(gI);
  gI.lev.style.transform = `translate3d(${-gI.levPos}px,0, 0)`;
}

export function renderInventory() {
  const gI = Game.getIns();
  if (gI.invMod) {
    gI.invMod = false;
    gI.invEl.innerHTML = '';
    Object.keys(gI.inv)
      .filter((id) => !id.startsWith('t_'))
      .forEach((id) => {
        const o = gI.inv[id];
        const slot = $$('div');
        slot.classList.add('slot');
        const item = $$('div');
        item.id = o.id;
        const { bs, bg, s } = generateSprite(o.sprite, o.scale);
        item.style.cssText = css({ bs, bg, s });
        slot.appendChild(item);
        gI.invEl.appendChild(slot);
      });
  }
}
