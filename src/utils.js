import Audio from './audio';

export const pTimeout = (ms) => new Promise((res) => setTimeout(res, ms));

export function displayMessage(gI, el, msg, p) {
  if (!p) {
    p = {};
    let promise = new Promise(function (resolve) {
      p.resolve = resolve;
    });
    p.promise = promise;
  }
  Audio.getIns().playTypingSound(gI);
  if (msg.length) {
    const c = msg.shift();
    el.innerHTML += c === '\n' ? '<br/>' : c;
    gI.textTimeout = setTimeout(() => {
      clearTimeout(gI.textTimeout);
      displayMessage(gI, el, msg, p);
    }, 45 + (c === '\n' ? 100 : 0));
  } else {
    p.resolve();
  }
  return p?.promise;
}
