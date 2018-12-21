  //Coordinates
  // L.GridLayer.DebugCoords = L.GridLayer.extend({
  //   createTile: function (coords) {
  //     var tile = document.createElement('div');
  //     tile.innerHTML = [coords.x, coords.y-1, coords.z].join(', ');
  //     return tile;
  //   }
  // });

  // L.gridLayer.debugCoords = function(opts) {
  //   return new L.GridLayer.DebugCoords(opts);
  // };

  // map.addLayer( L.gridLayer.debugCoords({tileSize: 250}) );

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

      var url = "/lidar?lat="+lat+"&lon="+lon;
      var maxHeight = 120; //harcoded for now

      fetch(url)
        .then(function(res) {
          return res.json();
        })
        .then(function(res) {

          var data = res.data;
          // consider using image data for performance https://stackoverflow.com/questions/7812514/drawing-a-dot-on-html5-canvas
          for(var y = 0; y < data.length; y++) {
            var row = data[y];
            for(var x = 0; x < row.length; x++) {
              if(row[x]<0) {
                row[x] = 0;
              }
              var scaledHeight = row[x]/maxHeight;
              ctx.fillStyle = "rgba(0,0,0,"+scaledHeight+")";
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

  map.addLayer(L.gridLayer.lidar());


  //Sun position
  var SunPositionLayer = L.CanvasLayer.extend({
    render: function() {
      var canvas = this.getCanvas();
      var ctx = canvas.getContext('2d');

      // console.log(MAP_CENTER);
      // clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      console.log(getSunAzis(MAP_CENTER));
      // render
      var canvasCenter = this._map.latLngToContainerPoint(MAP_CENTER);
      ctx.fillStyle = 'rgba(255, 60, 60, 0.2)';
      ctx.strokeStyle = 'rgba(255, 60, 60, 0.9)';
      ctx.beginPath();
      ctx.moveTo(canvasCenter.x, canvasCenter.y);
      ctx.lineTo(300, 150);
      ctx.stroke();

    }
  });

  var sunPositionLayer = new SunPositionLayer();
  sunPositionLayer.addTo(map);