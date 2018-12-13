var map = L.map('map').setView([lat, lon], 14);
var tiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    attribution: 'Positron',
    maxZoom: 19
}).addTo(map);

var legend = [];
var levels = [];

for (var i = 0; i < 115; i++) {
    levels.push(i);
}
console.log(levels);
// var levels = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115];
for (var i = 0; i < levels.length; i++) {
    var level = levels[i];
    legend.push({ val: level, color: ColorExt.Utils.toColor(level, levels[0], levels[levels.length - 1], 180, 240) });
}
var overlay = L.canvasOverlay(drawFunction, {
    data: data,
    noDataValue: -9999,
    topLeftLat: lat,
    topLeftLon: lon,
    deltaLat: deltaLat,
    deltaLon: deltaLon,
    legend: legend
}).addTo(map);
function drawFunction(overlay, settings) {

    console.log(settings);
    // overlay;
    var map = this._map;
    var opt = settings.options;
    var row = opt.data.length, col = opt.data[0].length, size = settings.size, legend = opt.legend;
    var topLeft = map.latLngToContainerPoint(new L.LatLng(opt.topLeftLat, opt.topLeftLon)), botRight = map.latLngToContainerPoint(new L.LatLng(opt.topLeftLat + row * opt.deltaLat, opt.topLeftLon + col * opt.deltaLon));
    var startX = topLeft.x, startY = topLeft.y, deltaX = (botRight.x - topLeft.x) / col, deltaY = (botRight.y - topLeft.y) / row;
    var ctx = settings.canvas.getContext("2d");
    ctx.clearRect(0, 0, size.x, size.y);
    if (startX > size.x || startY > size.y || botRight.x < 0 || botRight.y < 0) {
        return;
    }
    var sI = 0, sJ = 0, eI = row, eJ = col;
    if (startX < -deltaX) {
        sJ = -Math.ceil(startX / deltaX);
        startX += sJ * deltaX;
    }
    if (startY < -deltaY) {
        sI = -Math.ceil(startY / deltaY);
    }
    if (botRight.x > size.x) {
        eJ -= Math.floor((botRight.x - size.x) / deltaX);
    }
    if (botRight.y > size.y) {
        eI -= Math.floor((botRight.y - size.y) / deltaY);
    }
    var noDataValue = opt.noDataValue;
    ctx.globalAlpha = 1;
    console.time('process');
    for (var i = sI; i < eI; i++) {
        var x = startX - deltaX;
        var y = startY + i * deltaY;
        for (var j = sJ; j < eJ; j++) {
            x += deltaX;
            var cell = data[i][j];
            if (cell === noDataValue)
                continue;
            var closest = legend.reduce(function (prev, curr) {
                return (Math.abs(curr.val - cell) < Math.abs(prev.val - cell) ? curr : prev);
            });
            ctx.fillStyle = closest.color;
            ctx.fillRect(x, y, deltaX, deltaY);
        }
    }
    console.timeEnd('process');
}