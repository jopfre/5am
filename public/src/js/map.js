// EPSG27700 is the OS map projection
proj4.defs('EPSG27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs');

// OS coordinates to Lat Long
function os2ll(x, y) {
	var latLon = proj4('EPSG27700','WGS84',[x, y-1000]); //-1000 because leaflet uses top left corner but os uses bottom left;
	return latLon.reverse();
}

var bristolLatLon = os2ll(358000,174000);

// Init Leaflet.Map
var map = new L.Map('map', {
  crs: L.OSOpenSpace.CRS, //OS coordinate system
  attributionControl: true,
  maxZoom: 3,
  minZoom: 0,
});

// Leaflet.TileLayer.OSOpenSpace with API Key
var openspaceLayer = L.OSOpenSpace.tilelayer('7B57B508BCAC0D53E0530C6CA40AC62F');
map.addLayer(openspaceLayer);

// Add scale
L.control.scale({ position: 'bottomright' }).addTo(map);

// Set starting view and zoom
map.setView(bristolLatLon, 1);

// var zoomOutBtn = document.querySelector('.leaflet-control-zoom-out');
// zoomOutBtn.classList.remove('leaflet-disabled');
// zoomOutBtn.addEventListener('click', function() {
// 	// map._container.classList.add('zoom-neg-1');
// 	document.body.classList.add('zoom-neg-1');
// });
