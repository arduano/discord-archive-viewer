var fs = require("fs");
var zlib = require("zlib");

var directory = __dirname + "/saves/hexacross.dsave";

var data = Buffer.from(fs.readFileSync(directory, "utf8"), "base64");

var out = JSON.parse(zlib.inflateSync(data));

console.log(out.channels[6].name);
