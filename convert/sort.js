var fs = require("fs");
var zlib = require("zlib");
var request = require("request-promise");

// Save in binary
var directory = __dirname + "/files/";

run();

async function run () {

  var cache = new Array();

  var saves = fs.readdirSync(directory);
  for (var i = 0; i < saves.length; i++) {

    if (!saves[i].endsWith(".dsave")) {
      continue;
    };

    // Open
    var file = directory + saves[i];
    var data = Buffer.from(fs.readFileSync(file));

    var json = JSON.parse(zlib.inflateSync(data));

    console.log("Parsing %s", saves[i]);

    cache.push(saveParse(file, json));

  };

  return Promise.all(cache);

};

async function saveParse (file, json) {

  json = await parse(json);

  var out = zlib.deflateSync(JSON.stringify(json));
  //fs.writeFileSync(file, out);

  return null;

};

async function parse (out) {

  for (var i = 0; i < out.channels.length; i++) {

    for (var j = 0; j < out.channels[i].messages.length; j++) {
      console.log(out.channels[i].messages[j].createdTimestamp);
    };

  };

  return out;

};
