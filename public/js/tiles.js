var sunPositionLayer;L.GridLayer.Lidar=L.GridLayer.extend({createTile:function(t,o){var l=document.createElement("canvas"),e=this.getTileSize();l.setAttribute("width",e.x),l.setAttribute("height",e.y);var d=l.getContext("2d"),r=t.x,a=Math.abs(t.y)-1;return fetch("/lidar?lat="+r+"&lon="+a).then(function(t){return t.json()}).then(function(t){for(var e=t.data,r=0;r<e.length;r++)for(var a=e[r],n=0;n<a.length;n++){a[n]<0&&(a[n]=0);var i=a[n]/120;d.fillStyle="rgba(0,0,0,"+i+")",d.fillRect(n,r,1,1)}o(null,l)}).catch(function(t){console.log(t)}),l}}),L.gridLayer.lidar=function(t){return new L.GridLayer.Lidar(t)},map.addLayer(L.gridLayer.lidar()),(sunPositionLayer=new(sunPositionLayer=L.CanvasLayer.extend({renderCircle:function(t,e,r){t.fillStyle="rgba(255, 60, 60, 0.2)",t.strokeStyle="rgba(255, 60, 60, 0.9)",t.beginPath(),t.arc(e.x,e.y,r,0,2*Math.PI,!0,!0),t.closePath(),t.fill(),t.stroke()},render:function(){var t=this.getCanvas(),e=t.getContext("2d");e.clearRect(0,0,t.width,t.height);var r=this._map.latLngToContainerPoint(bristolLatLon);this.renderCircle(e,r,300*(1+Math.sin(.001*Date.now()))),this.redraw()}}))).addTo(map);