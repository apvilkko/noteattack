import {midiToNote} from './convert';

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

const midiHandler = actions => e => {
  // console.log('MIDI message:', e);
  // console.log(e.data);
  const [command, note, velocity] = e.data;
  switch (command) {
    case NOTE_ON:
      // actions.debug(`note on ${note} ${midiToNote(note)} ${velocity}`);
      actions.notePressed({note, scaleNote: midiToNote(note)});
      actions.noteOn(note, velocity);
      break;
    case NOTE_OFF:
      // actions.debug(`note off ${note} ${midiToNote(note)} ${velocity}`);
      actions.noteOff(note, velocity);
      break;
    default:
      break;
  }
};

export default midiHandler;
