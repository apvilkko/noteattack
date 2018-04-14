import init from './src/noteattack';

import('./src/Main.elm').then(Elm => {
  const mountNode = document.getElementById('main');
  const app = Elm.Main.embed(mountNode);

  const actions = {
    debug: msg => app.ports.debug.send(msg),
    changeNote: note => app.ports.changeNote.send(note),
    notePressed: args => app.ports.notePressed.send(args),
    endGame: msg => app.ports.endGame.send(msg),
    keyEvent: (event, key) => app.ports.keyEvent.send({event, key}),
  };

  init(actions);
  app.ports.newGame.subscribe(actions.newGame);
});
