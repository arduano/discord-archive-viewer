var request = require("request-promise");
var fs = require("fs");

var req2 = require("request");

async function run () {

  var pfp = await request({uri: "https://cdn.discordapp.com/avatars/108153479830241280/b71ada2b9261a5cd281a1554211799d7.png?size=256", encoding: null});

  console.log(pfp);

};

req2("https://cdn.discordapp.com/avatars/108153479830241280/b71ada2b9261a5cd281a1554211799d7.png?size=256", function (error, response, body) {

  var res = Buffer.from(body);
  console.log(res);
});

run();
