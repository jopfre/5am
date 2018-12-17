//Coordinates
L.GridLayer.DebugCoords = L.GridLayer.extend({
  createTile: function (coords) {
    var tile = document.createElement('div');
    tile.innerHTML = [coords.x, coords.y-1, coords.z].join(', ');
    // tile.style.outline = '1px solid red';
    return tile;
  }
});

L.gridLayer.debugCoords = function(opts) {
  return new L.GridLayer.DebugCoords(opts);
};

map.addLayer( L.gridLayer.debugCoords({tileSize: 250}) );

//Lidar
L.GridLayer.Lidar = L.GridLayer.extend({
  createTile: function (coords, done) {
    var tile = document.createElement('canvas');
    var tileSize = this.getTileSize();
    tile.setAttribute('width', tileSize.x);
    tile.setAttribute('height', tileSize.y);

    var ctx = tile.getContext('2d');
    var lat = coords.x;
    var lon = Math.abs(coords.y) - 1; //adjust for top left v bottom left discrepancy between leaflet and os

    var domain = 'http://138.68.84.71:3002/';
    // var domain = 'http://localhost:3002/';
    var url = domain+"lidar?lat="+lat+"&lon="+lon;
    fetch(url)
      .then(function(res) {
        return res.json();
      })
      .then(function(res) {
        let data = res.data;
        // consider using image data for performance https://stackoverflow.com/questions/7812514/drawing-a-dot-on-html5-canvas
        for(var y = 0; y < data.length; y++) {
          var row = data[y];
          for(var x = 0; x < row.length; x++) {
            if(row[x]<0) {
              row[x] = 0;
            }
            ctx.fillStyle = "rgba(0,0,0,"+row[x]/100+")";
            ctx.fillRect(x,y,1,1);
          }
        }
        done(null, tile);
      })
      .catch(function(error) {
        console.log(error);
      });
      
    return tile;
  }
});

L.gridLayer.lidar = function(opts) {
  return new L.GridLayer.Lidar(opts);
};

map.addLayer( L.gridLayer.lidar({tileSize: 250}) );