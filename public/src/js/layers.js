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
    .then(parseJSON)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.json.error);
      } else {
        var data = response.json.data;
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
      }
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

map.addLayer(L.gridLayer.lidar({
   tileSize: 250,  
}));


//Sun position
var SunPositionLayer = L.CanvasLayer.extend({
  render: function() {
    var canvas = this.getCanvas();
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var azis = getSunAzis(MAP_CENTER);
    var canvasCenter = this._map.latLngToContainerPoint(MAP_CENTER);

    ctx.fillStyle = 'rgba(255, 60, 60, 0.2)';
    ctx.strokeStyle = 'rgba(255, 60, 60, 0.9)';
    
    r =  canvas.width;

    var sunriseX = canvasCenter.x + r * Math.cos(Math.PI/2 + azis.sunrise);
    var sunriseY = canvasCenter.y + r * Math.sin(Math.PI/2 + azis.sunrise);
    var sunsetX = canvasCenter.x + r * Math.cos(Math.PI/2 + azis.sunset);
    var sunsetY = canvasCenter.y + r * Math.sin(Math.PI/2 + azis.sunset);
   
    //sunrise
    ctx.beginPath();
    ctx.moveTo(canvasCenter.x, canvasCenter.y);
    ctx.lineTo(sunriseX, sunriseY);
    ctx.stroke();
    //sunset
    ctx.beginPath();
    ctx.moveTo(canvasCenter.x, canvasCenter.y);
    ctx.lineTo(sunsetX, sunsetY);
    ctx.stroke();

    //bottom
    var bottomEdge = {
      startX: 0,
      startY: canvas.height,
      endX: canvas.width,
      endY: canvas.height
    };
    // ctx.beginPath();
    // ctx.moveTo(bottomEdge.startX, bottomEdge.startY -5);
    // ctx.lineTo(bottomEdge.endX, bottomEdge.endY -5);
    // ctx.stroke();

    var sunriseEdgePosition = computeIntersection(
      {x: bottomEdge.startX, y: bottomEdge.startY},
      {x: bottomEdge.endX, y: bottomEdge.endY},
      {x: canvasCenter.x, y: canvasCenter.y},
      {x: sunriseX, y: sunriseY}
    );

    var sunsetEdgePosition = computeIntersection(
      {x: bottomEdge.startX, y: bottomEdge.startY},
      {x: bottomEdge.endX, y: bottomEdge.endY},
      {x: canvasCenter.x, y: canvasCenter.y},
      {x: sunsetX, y: sunsetY}
    );

    ctx.drawImage(document.getElementById("sunrise-icon"), sunriseEdgePosition.point.x - 31, sunriseEdgePosition.point.y - 35, 62, 35);

    ctx.drawImage(document.getElementById("sunset-icon"), sunsetEdgePosition.point.x - 31, sunsetEdgePosition.point.y - 35, 62, 35);

  }
});

var sunPositionLayer = new SunPositionLayer();
sunPositionLayer.addTo(map);

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON, status from the response
 */
function parseJSON(response) {
  return new Promise(function(resolve) {
    response.json()
    .then(function(json) { 
      resolve({
        status: response.status,
        ok: response.ok,
        json: json,
      });
    });
  });
}

//https://jsfiddle.net/eokwL9mp/3/https://jsfiddle.net/eokwL9mp/3/
function computeIntersection(a, b, c, d) {
  var h1 = this.computeH(a, b, c, d);
  var h2 = this.computeH(c, d, a, b);
  var isParallel = isNaN(h1) || isNaN(h2);

  var f = {x: d.x-c.x, y: d.y-c.y };
  return {
    intersection: h1 >= 0 && h1 <= 1 && h2 >= 0 && h2 <= 1,
    // isParallel,
    // point: isParallel ? undefined :
    point: {
    // C + F*h
      x: c.x + f.x * h1,
      y: c.y + f.y * h1,
    },
  };
}
function computeH(a, b, c, d) {
  // E = B-A = ( Bx-Ax, By-Ay )
  var e = {x: b.x-a.x, y: b.y-a.y };
  // F = D-C = ( Dx-Cx, Dy-Cy ) 
  var f = {x: d.x-c.x, y: d.y-c.y };
  // P = ( -Ey, Ex )
  var p = {x: -e.y, y: e.x};

  // h = ( (A-C) * P ) / ( F * P )
  var intersection = f.x*p.x+f.y*p.y;
  if(intersection === 0) {
    // Paralel lines
    return NaN;
  }
  return ( (a.x - c.x) * p.x + (a.y - c.y) * p.y) / intersection;
}