var fs = require("fs");
var zlib = require("zlib");
var stream = require("stream");
var crypto = require("crypto");

var express = require("express");
var compression = require("compression");

var path = require("path");

var config = JSON.parse(fs.readFileSync(__dirname + "/config.json"));

// Set up GET API
var app = express();
var port = config["port"];

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(express.json());

// Store files in memory
var memory_cache = new Object();
var saves_directory = __dirname + config["saves-directory"];

app.get(config["message-header"], function (req, res) {

  var saves = fs.readdirSync(saves_directory);

  if (!req.query.save_name) {

    res.send(saves.filter(x => x.endsWith(".dsave")).map(x => x.substring(0, x.length - 6)));
    return null;

  };

  var save_name = req.query.save_name + ".dsave";

  if (!saves.includes(save_name)) {
    res.status(400);
    res.send("Invalid save.");
    return null;
  };

  // Perform in memory
  var data = Buffer.from(fs.readFileSync(saves_directory + save_name), "binary");
  var out = JSON.parse(zlib.inflateSync(data));

  for (var i = 0; i < out.users.length; i++) {
    out.users[i]._tid = generateCache(out.users[i].avatar_displayable, out.users[i].id);
    delete out.users[i].avatar_displayable;
  };

  for (var i = 0; i < out.guilds.length; i++) {
    out.guilds[i]._tid = generateCache(out.guilds[i].icon, out.guilds[i].id);
    delete out.guilds[i].icon;
  };

  for (var i = 0; i < out.channels.length; i++) {
    for (var j = 0; j < out.channels[i].messages.length; j++) {

      if (out.channels[i].messages[j].attachments) {
        for (var k = 0; k < out.channels[i].messages[j].attachments.length; k++) {

          if (config["save-attachments"]) {
            out.channels[i].messages[j].attachments[k]._tid = generateCache(out.channels[i].messages[j].attachments[k].data, out.channels[i].messages[j].attachments[k].id);
          } else {
            out.channels[i].messages[j].attachments[k]._tid = null;
          };

          delete out.channels[i].messages[j].attachments[k].data;
        };
      };

    };
  };

  res.send(JSON.stringify(out));

});

app.get(config["file-header"], function (req, res) {

  var id = req.query.id;

  if (!memory_cache[id]) {
    res.status(400);
    res.send("Not available");
    return null;
  };

  res.status(200).end(memory_cache[id].data);

  return null;

});

app.get("**", (req, res) => {
  if (fs.existsSync(path.join(__dirname, "build", req.url)) && req.url != "/") {
    res.sendFile(path.join(__dirname, "build", req.url));
  } else {
    res.sendFile("build/index.html", { root: __dirname });
  };
});

// Cache handler
setInterval(function () {

  var keys = Object.keys(memory_cache);
  for (var i = 0; i < keys.length; i++) {

    var key = keys[i];
    if (memory_cache[key].timeout < new Date().getTime()) {
      // Delete cache
      delete memory_cache[key];
    };

  };

}, 1000);

if (config["use-compression"]) {
  app.use(compression());
};

app.listen(port, function () {
  console.log("Server ready at port %s", port)
});

function generateCache (data, identiphrase=null) {

  if (identiphrase) {

    var keys = Object.keys(memory_cache);

    // The identiphrase acts as a double-buffer
    for (var i = 0; i < keys.length; i++) {

      var entry = memory_cache[keys[i]];
      if (entry.identiphrase === identiphrase) {
        // Add time
        entry.timeout = new Date().getTime() + config["cache-duration"] * 1000;

        // Return identifier
        return keys[i];
      };

    };

  };

  if (!data) {
    return null;
  };

  // Add new entry
  var identifier = crypto.randomBytes(16).toString("hex");

  data = Buffer.from(data);

  memory_cache[identifier] = {
    data: data,
    identiphrase: identiphrase,
    timeout: new Date().getTime() + config["cache-duration"] * 1000
  };

  return identifier;

  function bufferToStream(buffer) {

    var readable_stream = new stream.Readable();
    readable_stream.push(buffer);
    readable_stream.push(null);

    return readable_stream;

  };

};
