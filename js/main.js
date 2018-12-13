/*
 Generic  Canvas Overlay for leaflet,
 Stanislav Sumbera, April , 2014

 - added userDrawFunc that is called when Canvas need to be redrawn
 - added few useful params for userDrawFunc callback
  - fixed resize map bug
  inspired & portions taken from  :   https://github.com/Leaflet/Leaflet.heat

*/
var L;
(function (L) {
    var CanvasOverlay = L.Class.extend({
        initialize: function (userDrawFunc, options) {
            this._userDrawFunc = userDrawFunc;
            L.Util.setOptions(this, options);
        },
        drawing: function (userDrawFunc) {
            this._userDrawFunc = userDrawFunc;
            return this;
        },
        params: function (options) {
            L.Util.setOptions(this, options);
            return this;
        },
        canvas: function () {
            return this._canvas;
        },
        redraw: function () {
            if (!this._frame) {
                this._frame = L.Util.requestAnimFrame(this._redraw, this);
            }
            return this;
        },
        onAdd: function (map) {
            this._map = map;
            this._canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');
            var size = this._map.getSize();
            this._canvas.width = size.x;
            this._canvas.height = size.y;
            var animated = this._map.options.zoomAnimation && L.Browser.any3d;
            L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
            map._panes.overlayPane.appendChild(this._canvas);
            map.on('moveend', this._reset, this);
            map.on('resize', this._resize, this);
            if (map.options.zoomAnimation && L.Browser.any3d) {
                map.on('zoomanim', this._animateZoom, this);
            }
            this._reset();
        },
        onRemove: function (map) {
            map.getPanes().overlayPane.removeChild(this._canvas);
            map.off('moveend', this._reset, this);
            map.off('resize', this._resize, this);
            if (map.options.zoomAnimation) {
                map.off('zoomanim', this._animateZoom, this);
            }
            this._canvas = null;
        },
        addTo: function (map) {
            map.addLayer(this);
            return this;
        },
        _resize: function (resizeEvent) {
            this._canvas.width = resizeEvent.newSize.x;
            this._canvas.height = resizeEvent.newSize.y;
        },
        _reset: function () {
            var topLeft = this._map.containerPointToLayerPoint([0, 0]);
            L.DomUtil.setPosition(this._canvas, topLeft);
            this._redraw();
        },
        _redraw: function () {
            var size = this._map.getSize();
            var bounds = this._map.getBounds();
            var zoomScale = (size.x * 180) / (20037508.34 * (bounds.getEast() - bounds.getWest()));
            var zoom = this._map.getZoom();
            if (this._userDrawFunc) {
                this._userDrawFunc(this, {
                    canvas: this._canvas,
                    bounds: bounds,
                    size: size,
                    zoomScale: zoomScale,
                    zoom: zoom,
                    options: this.options
                });
            }
            this._frame = null;
        },
        _animateZoom: function (e) {
            var scale = this._map.getZoomScale(e.zoom), offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());
            this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
        }
    });
    function canvasOverlay(userDrawFunc, options) {
        return new CanvasOverlay(userDrawFunc, options);
    }
    L.canvasOverlay = canvasOverlay;
})(L || (L = {}));
var ColorExt;
(function (ColorExt) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.hsv2rgb = function (h, s, v) {
            var rgb, i, data = [];
            if (s === 0) {
                rgb = [v, v, v];
            }
            else {
                h = h / 60;
                i = Math.floor(h);
                data = [v * (1 - s), v * (1 - s * (h - i)), v * (1 - s * (1 - (h - i)))];
                switch (i) {
                    case 0:
                        rgb = [v, data[2], data[0]];
                        break;
                    case 1:
                        rgb = [data[1], v, data[0]];
                        break;
                    case 2:
                        rgb = [data[0], v, data[2]];
                        break;
                    case 3:
                        rgb = [data[0], data[1], v];
                        break;
                    case 4:
                        rgb = [data[2], data[0], v];
                        break;
                    default:
                        rgb = [v, data[0], data[1]];
                        break;
                }
            }
            return '#' + rgb.map(function (x) {
                return ("0" + Math.round(x * 255).toString(16)).slice(-2);
            }).join('');
        };
        Utils.toColor = function (val, min, max, primaryColorHue, secondaryColorHue) {
            var h = primaryColorHue + Math.floor(val / (max - min) * (secondaryColorHue - primaryColorHue));
            return Utils.hsv2rgb(h, 1, 1);
        };
        return Utils;
    })();
    ColorExt.Utils = Utils;
})(ColorExt || (ColorExt = {}));
var map = L.map('map').setView([lat, lon], 14);
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
