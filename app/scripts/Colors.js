Basic3D.loadModule("Colors", function () {

  const{ipcRenderer} = require('electron');

  let template = {
    VERTEX: 0xffffff,
    EDGE: 0xffffff,
    FACE: 0xffffff,
    VERTEX_SELECT: 0xff0000,
    EDGE_SELECT: 0xff0000,
    FACE_SELECT: 0xff0000,
    VERTEX_MARKER: 0x00ff00
  }
  function setColor(type, value){
    template[type] = value;
  }
  
  ipcRenderer.on('set_color', (event, arg1, arg2) => {
    setColor(arg1, arg2);
  });
  return template;
});
