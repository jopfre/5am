var lat = bristolLatLon[0];
var lon = bristolLatLon[1];
var times = SunCalc.getTimes(new Date(), lat, lon);
var sunriseStr = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
var sunrisePos = SunCalc.getPosition(times.sunrise, lat, lon);
console.log(times);
console.log(sunriseStr);
console.log(sunrisePos);

document.getElementById('sunrise-time').textContent = sunriseStr;