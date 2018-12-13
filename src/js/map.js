var lat = 51.472163692141194;
var lon = -2.649276495463796;
var map = L.map('map').setView([lat, lon], 14);
var tiles = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
