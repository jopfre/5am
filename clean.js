var fs = require('fs');
var osgf = require('./clean/osgridref.js');

var file = fs.readFileSync('./clean/data', 'utf8');
var lines = file.split("\n");

var ncols = parseInt(lines[0].split(' ').pop());
var nrows = parseInt(lines[1].split(' ').pop());
var xll = parseInt(lines[2].split(' ').pop());
var yll = parseInt(lines[3].split(' ').pop());
var cellSize = parseInt(lines[4].split(' ').pop());

// var xtl = xll - (cellSize * ncols);
// var ytl = yll - (cellSize * ncols);


var latlon = osgf.osGridToLatLon(osgf(xll, yll));
var lat = latlon.lat;
var lon = latlon.lon;

//https://gis.stackexchange.com/questions/2951/algorithm-for-offsetting-a-latitude-longitude-by-some-amount-of-meters
var deltaLat = cellSize/111111; 
var deltaLon = cellSize/(111111*Math.cos(lat*Math.PI/180));

 
var data = lines.slice(7);
	
if(!Boolean(data[data.length]-1)) { //last element is null
	data.pop();
}

var dataArray = data.map(function(line) {
	if(line.length) {
		return line.split(' ');
	};
});

dataArray.reverse();

var output = '';
output += 'var lat = '+lat+';\n';
output += 'var lon = '+lon+';\n';
output += 'var deltaLat = '+deltaLat+';\n';
output += 'var deltaLon = '+deltaLon+';\n';
output += 'var data = '+JSON.stringify(dataArray) +';'
fs.writeFileSync('data.js', output, 'utf8');