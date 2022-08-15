const notes = {
  C4: 261.63,
  D4: 293.6,
  E4: 329.63,
  F4: 349.23,
  G4: 392,
  A4: 440,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880,
  B5: 987.77,
};
const BPM = 140;

const tetris = [
  [notes.E5, 1],
  [notes.B4, 0.5],
  [notes.C5, 0.5],
  [notes.D5, 0.25],
  [notes.E5, 0.25],
  [notes.D5, 0.5],
  [notes.C5, 0.5],
  [notes.B4, 0.5],
  [notes.A4, 1],
  [notes.A4, 0.5],
  [notes.C5, 0.5],
  [notes.E5, 1],
  [notes.D5, 0.5],
  [notes.C5, 0.5],
  [notes.B4, 1],
  [notes.B4, 0.5],
  [notes.C5, 0.5],
  [notes.D5, 1],
  [notes.E5, 1],
  [notes.C5, 1],
  [notes.C5, 1],
  [0, 1],
  [0, 0.5],
  [notes.D5, 1],
  [notes.F5, 0.5],
  [notes.A5, 1],
  [notes.G5, 0.5],
  [notes.F5, 0.5],
  [notes.E5, 1.5],
  [notes.C5, 0.5],
  [notes.E5, 1],
  [notes.D5, 0.5],
  [notes.C5, 0.5],
  [notes.B4, 1],
  [notes.B4, 0.5],
  [notes.C5, 0.5],
  [notes.D5, 1],
  [notes.E5, 1],
  [notes.C5, 1],
  [notes.A4, 1],
  [0, 0.01],
  [notes.A4, 1],
  [0, 0.5],
];

export default (function () {
  var constructeur = function () {
    const gI = {
      playTypingSound,
      playBgMusic,
    };
    return gI;
  };

  function playTypingSound(gI) {
    const o = gI.audioCtx.createOscillator();
    const g = gI.audioCtx.createGain();
    g.gain.exponentialRampToValueAtTime(
      0.00001,
      gI.audioCtx.currentTime + 0.04
    );
    o.frequency.setValueAtTime(690, gI.audioCtx.currentTime);
    o.connect(g);
    g.connect(gI.audioCtx.destination);
    o.start(0);
    return g;
  }

  function playScale4(osc, gI, i) {
    if (i === tetris.length) {
      i = 0;
    }
    const [note, time] = tetris[i];
    osc.frequency.setValueAtTime(note, gI.audioCtx.currentTime);
    setTimeout(() => {
      playScale4(osc, gI, i + 1);
    }, time * (60000 / BPM));
  }

  function playBgMusic(gI) {
    const osc = gI.audioCtx.createOscillator();
    osc.type = 'triangle';
    const g = gI.audioCtx.createGain();
    g.gain.value = 0.3;
    osc.frequency.setValueAtTime(261.63, gI.audioCtx.currentTime);
    osc.connect(g);
    g.connect(gI.audioCtx.destination);
    osc.start(0);
    playScale4(osc, gI, 0);
  }

  var instance = null;
  return new (function () {
    this.getInstance = function () {
      if (instance == null) {
        instance = new constructeur();
        instance.constructeur = null;
      }

      return instance;
    };
  })();
})();
