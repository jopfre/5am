function os2ll(e,o){return proj4("EPSG27700","WGS84",[e,o-1e3]).reverse()}proj4.defs("EPSG27700","+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs");var map=new L.Map("map",{crs:L.OSOpenSpace.CRS,attributionControl:!0,maxZoom:2,minZoom:0}),openspaceLayer=L.OSOpenSpace.tilelayer("7B57B508BCAC0D53E0530C6CA40AC62F");map.addLayer(openspaceLayer),L.control.scale({position:"bottomright"}).addTo(map),map.setView(os2ll(358e3,174e3),0);