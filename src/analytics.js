// Description
//   A hubot script to get google analytics reports
//
// Configuration:
//   GOOGLE_API_CLIENT_EMAIL
//   GOOGLE_API_PRIVATE_KEY
//
// Commands:
//   hubot analytics profiles - <what the respond trigger does>
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   Plan B Comunicação <dev@planb.com.br>

var google = require('googleapis');
var analytics = google.analytics('v3');

var GOOGLE_API_CLIENT_EMAIL = process.env.GOOGLE_API_CLIENT_EMAIL;
var GOOGLE_API_PRIVATE_KEY = process.env.GOOGLE_API_PRIVATE_KEY.replace(/\\n/g, '\n');

var oauth2Client = new google.auth.JWT(GOOGLE_API_CLIENT_EMAIL, null, GOOGLE_API_PRIVATE_KEY, ["https://www.googleapis.com/auth/analytics.readonly"], null);

module.exports = function(robot) {

  robot.hear(/analytics profiles/, function(res) {

    oauth2Client.authorize(function(err, tokens) {
      if (err) {
        console.log(err);
        return res.reply(err);
      }

      analytics.management.profiles.list(
        {
          auth: oauth2Client,
          accountId: '~all',
          webPropertyId: '~all'
        },
        function(err, entries) {
          if (err) {
            console.log(err);
            return res.reply(err);
          }

          var response = entries.items.map(function(item) {
            return item.id + " - " + item.name;
          }).join("\n");

          return res.reply(response);
        }
      );
      // analytics.data.ga.get({
      //   auth: oauth2Client,
      //   accountId: "72403604",
      //   webPropertyId: "UA-72403604-1",
      //     "ids": "ga:114783808",
      //     "start-date": '2016-01-02',
      //     "end-date": '2016-03-02',
      //     "metrics": "ga:visits"
      // },
      // function(err, entries) {
      //   if (err) {
      //     console.log(err);
      //     return res.reply(err);
      //   }
      //   console.log(entries);
      //   return res.reply(entries);
      // });

    });

  });

};
