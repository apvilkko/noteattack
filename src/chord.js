import NOTES from './notes';
import {getRandom} from './random';

const MAJOR = 'MAJOR';
const MINOR = 'MINOR';
const SUS2 = 'SUS2';
const SUS4 = 'SUS4';
const DIM = 'DIM';
const AUG = 'AUG';

export const CHORD_TYPES = [
  MAJOR, MINOR, SUS2, SUS4, DIM, AUG,
];

const CHORDS = {
  [MAJOR]: [0, 4, 7],
  [MINOR]: [0, 3, 7],
  [SUS2]: [0, 2, 7],
  [SUS4]: [0, 5, 7],
  [DIM]: [0, 3, 6],
  [AUG]: [0, 4, 8],
};

export const CHORD_DISPLAY = {
  [MAJOR]: '',
  [MINOR]: 'm',
  [SUS2]: 'sus2',
  [SUS4]: 'sus4',
  [DIM]: 'dim',
  [AUG]: 'aug',
};

export const getChord = (chordType, root) => {
  const arr = [...NOTES, ...NOTES];
  const index = NOTES.findIndex(x => x === root);
  const chord = CHORDS[chordType];
  return [root, arr[index + chord[1]], arr[index + chord[2]]];
};

export const getRandomChordType = () => {
  if (Math.random() > 0.3) {
    return getRandom([MAJOR, MINOR]);
  } else if (Math.random() > 0.4) {
    return getRandom([SUS2, SUS4]);
  }
  return getRandom([DIM, AUG]);
};
