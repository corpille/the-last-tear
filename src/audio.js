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
const BPM = 120;
const melody = [
  ['F4:4', 'A4:4', 'C5:4', 'C4:1', 'D4:1:1', 'E4:1:2', 'F4:1:3'],
  ['E4:4', 'G4:4', 'B4:4'],
  ['D4:4', 'F4:4', 'A4:4'],
  ['E4:4', 'G4:4', 'B4:4'],
  ['F4:4', 'A4:4', 'C5:4', 'C4:1', 'D4:1:1', 'E4:1:2', 'F4:1:3'],
  ['E4:4', 'G4:4', 'B4:4'],
  ['D4:4', 'F4:4', 'A4:4'],
  ['C4:4', 'F4:4', 'A4:4'],
];

const volume = 0.05;
let audioInst = null;
export default class Audio {
  i = 0;

  playTypingSound(gI) {
    const osc = new OscillatorNode(gI.audioCtx, {
      frequency: notes.G5,
      type: 'sine',
    });
    const g = gI.audioCtx.createGain();
    g.gain.exponentialRampToValueAtTime(
      0.00001,
      gI.audioCtx.currentTime + 0.08
    );
    g.gain.value = volume;
    osc.start(0);
    osc.connect(g);
    g.connect(gI.audioCtx.destination);
    return g;
  }

  playNote(gI, time, frequency, duration) {
    const osc = new OscillatorNode(gI.audioCtx, {
      frequency,
      type: 'sine',
    });
    let filter1 = new BiquadFilterNode(gI.audioCtx, {
      type: 'highpass',
      frequency: 190,
    });
    let filter2 = new BiquadFilterNode(gI.audioCtx, {
      type: 'notch',
      frequency: 1223,
    });
    let filter3 = new BiquadFilterNode(gI.audioCtx, {
      type: 'lowshelf',
      frequency: 1870,
      gain: -10.5,
    });
    const g = gI.audioCtx.createGain();
    g.gain.cancelScheduledValues(time);
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(volume, time + 0.008);
    g.gain.linearRampToValueAtTime(0, time + duration - 0.008);
    osc.connect(g);
    g.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(filter3);
    filter3.connect(gI.audioCtx.destination);
    osc.start(time);
    osc.stop(time + duration);
    return osc;
  }

  playMelody(gI) {
    if (this.i === melody.length) {
      this.i = 0;
    }
    melody[this.i].forEach((note) => {
      const [n, duration, delay = 0] = note.split(':');
      this.playNote(
        gI,
        gI.audioCtx.currentTime + (delay * 60) / BPM,
        notes[n],
        (duration * 60) / BPM
      );
    });
    this.i++;
  }

  playBgMusic(gI) {
    this.playMelody(gI);
    setInterval(() => this.playMelody(gI), (4 * 60000) / BPM);
  }

  static getIns() {
    if (audioInst == null) {
      audioInst = new Audio();
    }
    return audioInst;
  }
}

// export default (function () {
//   var constructeur = function () {
//     const gI = {
//       playTypingSound,
//       playBgMusic,
//       playNote,
//     };
//     return gI;
//   };

//   function playTypingSound(gI) {
//     const osc = new OscillatorNode(gI.audioCtx, {
//       frequency: notes.G5,
//       type: 'sine',
//     });
//     const g = gI.audioCtx.createGain();
//     g.gain.exponentialRampToValueAtTime(
//       0.00001,
//       gI.audioCtx.currentTime + 0.08
//     );
//     g.gain.value = volume;
//     osc.start(0);
//     osc.connect(g);
//     g.connect(gI.audioCtx.destination);
//     return g;
//   }

//   function playNote(gI, time, frequency, duration) {
//     const osc = new OscillatorNode(gI.audioCtx, {
//       frequency,
//       type: 'sine',
//     });
//     let filter1 = new BiquadFilterNode(gI.audioCtx, {
//       type: 'highpass',
//       frequency: 190,
//     });
//     let filter2 = new BiquadFilterNode(gI.audioCtx, {
//       type: 'notch',
//       frequency: 1223,
//     });
//     let filter3 = new BiquadFilterNode(gI.audioCtx, {
//       type: 'lowshelf',
//       frequency: 1870,
//       gain: -10.5,
//     });
//     const g = gI.audioCtx.createGain();
//     g.gain.cancelScheduledValues(time);
//     g.gain.setValueAtTime(0, time);
//     g.gain.linearRampToValueAtTime(volume, time + 0.008);
//     g.gain.linearRampToValueAtTime(0, time + duration - 0.008);
//     osc.connect(g);
//     g.connect(filter1);
//     filter1.connect(filter2);
//     filter2.connect(filter3);
//     filter3.connect(gI.audioCtx.destination);
//     osc.start(time);
//     osc.stop(time + duration);
//     return osc;
//   }

//   function playMelody(gI, i) {
//     if (i === melody.length) {
//       i = 0;
//     }
//     const chord = melody[i];
//     chord.forEach((note) => {
//       const [n, duration, delay = 0] = note.split(':');
//       playNote(
//         gI,
//         gI.audioCtx.currentTime + (delay * 60) / BPM,
//         notes[n],
//         (duration * 60) / BPM
//       );
//     });
//     const wait = setTimeout(() => {
//       clearTimeout(wait);
//       playMelody(gI, i + 1);
//     }, 4 * (60000 / BPM));
//   }

//   function playBgMusic(gI) {
//     playMelody(gI, 0);
//   }

//   var instance = null;
//   return new (function () {
//     this.getIns = function () {
//       if (instance == null) {
//         instance = new constructeur();
//         instance.constructeur = null;
//       }
//       return instance;
//     };
//   })();
// })();
