import Audio from './audio';

export const pTimeout = (ms) => new Promise((res) => setTimeout(res, ms));

export const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export function parse(sprite, cb = (c) => c) {
  return sprite.split('|').map((line) => line.split('').map(cb));
}

export const css = ({ bs, bg, s }) =>
  `height:${s};width:${s};box-shadow:${bs};background:${bg}`;

export function defer() {
  const p = {};
  let promise = new Promise(function (resolve, reject) {
    p.resolve = resolve;
    p.reject = reject;
  });
  p.promise = promise;
  return p;
}
export function displayMessage(gI, el, msg, p) {
  if (!p) {
    p = defer();
    Audio.getIns().playTypingSound(gI);
  }
  if (msg.length) {
    const c = msg.shift();
    el.innerHTML += c === '\n' ? '<br/>' : c;
    gI.textTimeout = setTimeout(() => {
      clearTimeout(gI.textTimeout);
      if ([' ', '\n'].includes(c)) {
        Audio.getIns().playTypingSound(gI);
      }
      displayMessage(gI, el, msg, p);
    }, 25 + (c === '\n' ? 100 : 0));
  } else {
    Audio.getIns().playTypingSound(gI);
    p.resolve();
  }
  return p?.p;
}
