var lat = bristolLatLon[0];
var lon = bristolLatLon[1];
var times = SunCalc.getTimes(new Date(), lat, lon);
var sunriseTime = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
var sunsetTime = times.sunset.getHours() + ':' + times.sunset.getMinutes();
var sunrisePos = SunCalc.getPosition(times.sunrise, lat, lon);
console.log(times);
console.log(sunrisePos);

document.getElementById('sunrise-time').textContent = sunriseTime;
document.getElementById('sunset-time').textContent = sunsetTime;