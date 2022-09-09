import Game from './game';
import { RACE_WIDTH } from './config';
import { pTimeout } from './utils';
import { calcLevPos } from './render';

let endRacePromise;

async function fadeIn(gI) {
  gI.canEl.style.opacity = 0;
  await pTimeout(300);
  gI.canEl.style.opacity = 1;
}

export async function endRace(success) {
  const gI = Game.getIns();
  gI.keys = {};
  if (success) {
    gI.p.vy = 0;
    gI.p.vx = 0;
    gI.p.y = -1;
    gI.override = false;
    gI.xOffset = 100;
    gI.autoX = gI.levW + RACE_WIDTH + 100;
    await pTimeout(4000);
    await fadeIn(gI);
    gI.xOffset = 0;
    gI.autoX = 0;
    gI.lOff = 0;
    gI.p.x = 4800;
    calcLevPos(gI);
    endRacePromise.resolve();
  } else {
    await fadeIn(gI);
    gI.p.vy = 0;
    gI.p.vx = 0;
    gI.p.y = -1;
    gI.p.x = 5600;
  }
}

export async function playRaceGame(gI, p) {
  endRacePromise = p;
  await fadeIn(gI);
  gI.p.x = 5600;
  gI.lOff = 5490;
  gI.override = true;
}
