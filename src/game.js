import NOTES from './notes';
import {CHORD_TYPES, getChord, CHORD_DISPLAY} from './chord';

const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];
const randomRange = (min, max) => (Math.random() * (max - min) + min);

const STEP_MS = 50;

const tweenProgress = (start, delay) => {
  if (start < delay) {
    let percentage = start / delay * 100;
    const el = document.querySelector('.progress-inner');
    if (el) {
      el.style.width = `${percentage}%`;
    }
  }
  setTimeout(() => {
    tweenProgress(start + STEP_MS, delay);
  }, STEP_MS);
};

export const showNote = (actions, notes, index) => {
  if (index < notes.length) {
    actions.changeNote({
      display: notes[index].display || notes[index].notes[0],
      notes: notes[index].notes,
      index,
    });
    const delay = notes[index].time * 1000;
    tweenProgress(0, delay);
    setTimeout(() => {
      showNote(actions, notes, index + 1);
    }, delay);
  } else {
    actions.endGame('');
  }
};

const singleDelayRange = [0.8, 2.5];
const chordDelayRange = [1.2, 3.2];

const maybeSwitchAccidental = note => {
  if (note.indexOf('#') > -1) {
    const index = NOTES.indexOf(note);
    if (Math.random() > 0.5) {
      let newIndex = index + 1;
      if (newIndex >= 12) {
        newIndex = 0;
      }
      const newNote = `${NOTES[newIndex]}b`;
      return newNote;
    }
    return note;
  }
  return note;
};

export default mode => {
  const chordMode = mode === 'chord';
  const gameLength = 10;
  const notes = [];
  const numNotes = chordMode ? 3 : 1;
  for (let i = 0; i < gameLength; ++i) {
    const item = {
      time: chordMode ? randomRange(...chordDelayRange) :
        randomRange(...singleDelayRange),
      notes: [],
    };
    const root = getRandom(NOTES);
    const chordType = getRandom(CHORD_TYPES);
    const chord = getChord(chordType, root);
    item.display = `${maybeSwitchAccidental(root)}${chordMode ?
        CHORD_DISPLAY[chordType] : ''}`;
    for (let j = 0; j < numNotes; ++j) {
      item.notes.push(chord[j]);
    }
    notes.push(item);
  }
  return {
    notes,
  };
};
