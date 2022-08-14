export default (function () {
  var constructeur = function () {
    const gI = {
      sceneObjects: [],
      jumpState: 0,
      tick: 0,
      inventoryElement: document.querySelector('#inventory'),
      canvasElement: document.querySelector('#canvas'),
      levelElement: document.querySelector('#level'),
      levelElementPos: 0,
      inventory: [],
    };
    return gI;
  };

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
