var fs = require("fs");
var zlib = require("zlib");
var request = require("request-promise");

// Save in binary
var directory = __dirname + "/files/";

var Discord = require("discord.js");
var client = new Discord.Client();

client.on("ready", async function () {

  await run();
  process.exit();

});

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
  fs.writeFileSync(file, out);

  return null;

};

async function parse (out) {

  for (var i = 0; i < out.users.length; i++) {

    try {
      var user = await client.fetchUser(out.users[i].id);
    } catch (err) {
      var user = null;
    };

    if (!user) {
      out.users[i].avatar = null;
      continue;
    };

    out.users[i].avatar = user.displayAvatarURL.replace(/\?size=[0-9]{1,}/g, "?size=128");
    out.users[i].avatar_displayable = await attemptDownload(out.users[i].avatar);
    console.log("Downloaded avatar from: %s", out.users[i].avatar);

  };

  for (var i = 0; i < out.guilds.length; i++) {
    out.guilds[i].icon = await attemptDownload(out.guilds[i].icon_url);
    console.log("Downloaded icon from: %s", out.guilds[i].icon_url);
  };

  for (var i = 0; i < out.channels.length; i++) {
    for (var j = 0; j < out.channels[i].messages.length; j++) {

      if (out.channels[i].messages[j].attachments) {
        for (var k = 0; k < out.channels[i].messages[j].attachments.length; k++) {

          out.channels[i].messages[j].attachments[k].data = await attemptDownload(out.channels[i].messages[j].attachments[k].id);
          console.log("Downloaded attachment from: %s", out.channels[i].messages[j].attachments[k].id);

        };
      };

    };
  };

  return out;

  async function attemptDownload (url) {
    try {
      return await request({uri: url, encoding: null});
    } catch (err) {
      console.log("Error downloading %s, skipping", url);
      return null;
    };
  };

};

client.login();
