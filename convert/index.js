var fs = require("fs");

// Save in binary
var directory = __dirname + "/files/";

var saves = fs.readdirSync(directory);
for (var i = 0; i < saves.length; i++) {

  if (!saves[i].endsWith(".dsave")) {
    continue;
  };

  // Open
  var file = directory + saves[i];
  var data = Buffer.from(fs.readFileSync(file, "binary"), "base64");

  fs.writeFileSync(file, data, "binary");

};
