import Audio from './audio';
import { CHAR_DELAY } from './config';

let timeout;

export function displayMessage(gI, el, msg, p) {
  if (!p) {
    p = {};
    let promise = new Promise(function (resolve, reject) {
      p.resolve = resolve;
      p.reject = reject;
    });
    p.promise = promise;
  }
  const aI = Audio.getInstance();
  aI.playTypingSound(gI);
  if (msg.length) {
    const c = msg.shift();
    el.innerHTML += c === '\n' ? '<br/>' : c;
    gI.textTimeout = setTimeout(() => {
      clearTimeout(gI.timeout);
      displayMessage(gI, el, msg, p);
    }, CHAR_DELAY + (c === '\n' ? 100 : 0));
  } else {
    p.resolve();
  }
  return p?.promise;
}
