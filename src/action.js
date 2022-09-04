import Game from './game';
import { displayMessage } from './utils';
import sprites from './sprites.json';
import { renderSprite } from './sprite';
import { launchEndCinematic } from './index';
import { pTimeout, defer } from './utils';
import { playLetterGame } from './letterGame';

async function handleEndAction(gI) {
  if (!gI.extraAction) return;
  gI.isInAction = true;
  switch (gI.extraAction.type) {
    case 'show':
      gI.scene[gI.extraAction.p].hidden = false;
      await pTimeout(3000);
      break;
    case 'give':
      const object = {
        id: gI.extraAction.p,
        ...sprites[gI.extraAction.p],
      };
      gI.inventory[object.id] = object;
      gI.inventoryChanged = true;
      break;
    case 'end':
      launchEndCinematic();
      break;
    case 'play':
      const p = defer();
      playLetterGame(gI, p);
      await p.promise;
      break;
    case 'color':
      const o = gI.scene.deave;
      let mod =
        gI.extraAction.p === 'color1' ? ['F:1', 'E:2'] : ['B:I', 'A:J', 'G:H'];
      mod.map((mod) => {
        o.sprite = o.sprite.split(mod[0]).join(mod[2]);
        renderSprite(o, o.sprite);
      });
      await pTimeout(3000);
      break;
  }
  gI.isInAction = false;
  delete gI.extraAction;
}

export async function displayNextActionMessage() {
  const gI = Game.getIns();
  $('#bubble')?.remove();
  clearTimeout(gI.textTimeout);
  if (gI.extraAction) {
    await handleEndAction(gI);
  }
  if (gI.currentLines.length) {
    const [message, author, action] = gI.currentLines.shift().split(':');
    if (author) {
      gI.currentAuthor = author;
    }
    const o = gI.scene[gI.currentAuthor];
    const bEl = document.createElement('div');
    bEl.id = 'bubble';
    let posX = gI.levElPos + o.x + o.width / 2 + (o.bubbleShift ?? 0);
    if (posX + 300 > window.innerWidth) {
      bEl.classList.add('reverse');
      posX -= 300;
    }
    bEl.style.cssText = `bottom: ${o.y + o.height + 25}px; left: ${posX}px;`;
    const txt = document.createElement('div');
    bEl.appendChild(txt);
    gI.canEl.appendChild(bEl);
    if (action) {
      const [type, p] = gI.currentDiag.actions[parseInt(action)].split(':');
      gI.extraAction = { type, p };
    }
    await displayMessage(gI, txt, message.split(''));
    return bEl.classList.add('continue');
  } else {
    delete gI.currentLines;
  }
}

function cond(gI, action) {
  const inv = Object.keys(gI.inventory);
  const cond = Object.keys(action).filter((c) => c.startsWith('c_'));
  const item = cond.find((c) => inv.includes(c.slice(2, c.length)));
  let diag;
  if (item) {
    if (!item.slice(2, item.length).startsWith('tmp_')) {
      delete gI.inventory[item.slice(2, item.length)];
      gI.inventoryChanged = true;
    }
    diag = gI.diag[action[item]];
    delete action[item];
    if (!Object.keys(action).filter((c) => c.startsWith('c_')).length) {
      gI.scene[gI.currAvailAct].actions.shift();
    }
    gI.currAvailAct = undefined;
  } else {
    diag = gI.diag[action.bad];
  }
  gI.currentLines = [...diag.l];
  gI.currentDiag = diag;
  return displayNextActionMessage();
}

export function toggleAction() {
  const gI = Game.getIns();
  const o = gI.scene[gI.currAvailAct];
  if (o.currAction >= o.actions.length - 1) {
    gI.actionButton.hidden = true;
  }
  let action = o.actions[o.currAction + 1];
  switch (action.type) {
    case 'cond':
      return cond(gI, action);
    case 'msg':
      if (!action.repeat) {
        o.currAction = o.currAction + 1;
      }
      const diag = gI.diag[action.diag];
      gI.currentLines = [...diag.l];
      gI.currentDiag = diag;
      gI.currAvailAct = undefined;
      return displayNextActionMessage();
  }
}
