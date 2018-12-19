// Preps and inserts gov.uk 2m Composite DSM Lidar Data into MongoDB
// Data source: https://environment.data.gov.uk/ds/survey/index.jsp#/survey?grid=ST57

var fs = require('fs');
var path = require("path");
var mongoClient = require('./mongo-client.js');

var readFiles = function(dir, filelist) {
  if( dir[dir.length-1] != '/') {
    dir=dir.concat('/');
  } else {
    files = fs.readdirSync(dir);
  }
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = readFiles(dir + file + '/', filelist);
    } else {
      filelist.push(dir+file);
    }
  });
  return filelist;
};
var files = readFiles('./assets/lidar/');

// For testing single files
// var single = [files[0]];
// files = single;

mongoClient.connect(err => {
  let db = mongoClient.getDb();
  const lidar = db.collection("lidar");

  // Empty the collection
  // lidar.deleteMany();

  files.forEach(function(file) {    
    var thisFile = fs.readFileSync(file, 'utf8');

    var lines = thisFile.split("\n");

    var xll = parseInt(lines[2].split(' ').pop());
    var yll = parseInt(lines[3].split(' ').pop());

    var data = lines.slice(6);

    if(!Boolean(data[data.length]-1)) { //last element is null
      data.pop();
    }

    data = data.map(function(line) {
      if(line.length) {
        return line.split(' ');
      };
    });

    data = data.map(function(line) {
      return line.map(function(point) {
        return parseFloat(point);
      });
    });

    data = averageData(data);

    var doc = {
      _id: path.basename(file).split('_')[0],
      lat: xll,
      lon: yll,
      data: data
    }

    console.log('Inserting '+doc._id);

    // Write to file for testing
    // fs.writeFileSync('public/js/data.js', JSON.stringify(doc), 'utf8');
    
    // Insert to db  
    lidar.insertOne(doc, function() {
      console.log(doc._id+' Inserted');
    }); 
  
  });

  // mongoClient.close();

});

// The lidar data comes in 500x500 format but our map tiles are 250x250px. This function halfs the size of the matrix by averaging values.
function averageData(data) {
 
  // Take the average of successive array pairs
  let averagedRows = [];
  for (var i = 0; i < data.length - 1; i+=2) {
    averagedRows.push([]);
    for(var j = 0; j < data[i].length; j++){
      //use available value when averaging if one pair has no data
      if (data[i][j] === -9999) {
        data[i][j] = data[i+1][j];
      }
      if (data[i+1][j] === -9999) {
        data[i+1][j] = data[i][j];
      }
      var average = (data[i][j] + data[i+1][j])/2;
      averagedRows[i/2].push(average); 
    }
  }
  
  // Take the average of successive value pairs (for even length arrays)
  let averagedCols = averagedRows.map(function (arr) {
    return arr.reduce(function (avs, num, index, self) {
      if (index % 2) {
        if (num === -9999) {
          num = self[index - 1];
        }
        if (self[index - 1] === -9999) {
          self[index - 1] = num;
        }
        avs.push(Math.round((num + self[index - 1]) / 2)) ;
      }
      return avs;
    }, [])
  })
  return averagedCols;
}
