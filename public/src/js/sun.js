function getSunTimes(coords) {
	return SunCalc.getTimes(new Date(), coords.lat, coords.lng);
}

function renderSunTimes(coords) {
	var times = getSunTimes(coords);
	var sunriseTime = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
	var sunsetTime = times.sunset.getHours() + ':' + times.sunset.getMinutes();
	document.getElementById('sunrise-time').textContent = sunriseTime;
	document.getElementById('sunset-time').textContent = sunsetTime;
}

function getSunAzis(coords) {
	var times = getSunTimes(coords);
	return {
		sunrise: SunCalc.getPosition(times.sunrise, coords.lat, coords.lng).azimuth,
		sunset: SunCalc.getPosition(times.sunset, coords.lat, coords.lng).azimuth
	};
}