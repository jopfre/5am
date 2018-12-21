function render() {
	MAP_CENTER = map.getCenter();
	sunPositionLayer.render(MAP_CENTER);
	renderSunTimes(MAP_CENTER);
}

map.addEventListener('moveend ', function() {
	render();
});

render();