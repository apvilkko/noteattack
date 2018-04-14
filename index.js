import init from './src/noteattack';

import('./src/Main.elm').then(Elm => {
  const mountNode = document.getElementById('main');
  const app = Elm.Main.embed(mountNode);

  const actions = {
    debug: msg => app.ports.debug.send(msg),
  };
  init(actions);
});
