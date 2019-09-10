var fs = require("fs");
var zlib = require("zlib");
var express = require("express");
var compression = require("compression");

// Set up GET API
var app = express();
var port = "3030";

var directory = __dirname + "/saves/";

app.get("/api", function (req, res) {

  var save_name = req.query.save_name + ".dsave";
  var saves = fs.readdirSync(directory);

  if (!saves.includes(save_name)) {
    res.status(400);
    res.send("Invalid save.");
    return null;
  };

  // Perform in memory
  var data = Buffer.from(fs.readFileSync(directory + save_name, "utf8"), "base64");

  var out = JSON.parse(zlib.inflateSync(data));

  for (var i = 0; i < out.users.length; i++) {
    delete out.users[i].avatar_displayable;
  };

  for (var i = 0; i < out.guilds.length; i++) {
    delete out.guilds[i].icon;
  };

  for (var i = 0; i < out.channels.length; i++) {
    for (var j = 0; j < out.channels[i].messages.length; j++) {

      if (out.channels[i].messages[j].attachments) {
        for (var k = 0; k < out.channels[i].messages[j].attachments[k]; k++) {
          delete out.channels[i].messages[j].attachments[k].data;
        };
      };

    };
  };

  res.send(JSON.stringify(out));

});

app.use(compression());

app.listen(port, function () {
  console.log("Server ready at port %s", port)
});
