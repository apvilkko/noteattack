import NOTES from './notes';

const A4 = 69;

export const midiToNote = m => {
  let note = m - A4;
  while (note < 0) {
    note += 12;
  }
  while (note > 11) {
    note -= 12;
  }
  return NOTES[note];
};

export const midiToFreq = m => {
  const tuning = 440;
  return m === 0 || (m > 0 && m < 128) ?
    Math.pow(2, (m - A4) / 12) * tuning : null;
};
