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

const melody = [
  [notes.F4, 4],
  [notes.E4, 4],
  [notes.D4, 4],
  [notes.E4, 4],
  [notes.F4, 4],
  [notes.E4, 4],
  [notes.D4, 4],
  [notes.C4, 4],
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
    const osc = gI.audioCtx.createOscillator();
    osc.type = 'triangle';
    const gain = gI.audioCtx.createGain();
    gain.gain.exponentialRampToValueAtTime(
      0.00001,
      gI.audioCtx.currentTime + 0.08
    );
    gain.gain.value = 0.2;

    osc.frequency.setValueAtTime(notes.G5, gI.audioCtx.currentTime);
    osc.start(0);
    osc.connect(gain);
    gain.connect(gI.audioCtx.destination);
    return gain;
  }

  function playMelody(osc, gI, i) {
    if (i === melody.length) {
      i = 0;
    }
    const [note, time] = melody[i];
    osc.frequency.setValueAtTime(note, gI.audioCtx.currentTime);
    const wait = setTimeout(() => {
      clearTimeout(wait);
      playMelody(osc, gI, i + 1);
    }, time * (60000 / BPM));
  }

  function playBgMusic(gI) {
    const osc = gI.audioCtx.createOscillator();
    osc.type = 'triangle';
    let filter1 = gI.audioCtx.createBiquadFilter();
    filter1.type = 'highpass';
    filter1.frequency.value = 190;
    let filter2 = gI.audioCtx.createBiquadFilter();
    filter2.type = 'notch';
    filter2.frequency.value = 1223;
    let filter3 = gI.audioCtx.createBiquadFilter();
    filter3.type = 'highshelf';
    filter3.frequency.value = 1870;
    filter3.gain.value = -14.5;
    const g = gI.audioCtx.createGain();
    g.gain.value = 0.1;

    osc.frequency.setValueAtTime(261.63, gI.audioCtx.currentTime);
    osc.connect(g);
    g.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(filter3);
    filter3.connect(gI.audioCtx.destination);
    osc.start(0);
    playMelody(osc, gI, 0);
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
