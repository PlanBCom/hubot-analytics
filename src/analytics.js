// Description
//   A hubot script to get google analytics reports
//
// Configuration:
//   GOOGLE_API_CLIENT_EMAIL
//   GOOGLE_API_PRIVATE_KEY
//
// Commands:
//   hubot analytics profiles - Shows profiles to which the bot has access
//   hubot pageviews 123123123 - Shows pageviews and visits of website with id 123123123
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   Plan B Comunicação <dev@planb.com.br>

var google = require("googleapis");
require('date-utils');

var analytics = google.analytics("v3");
var global_error;

module.exports = function(robot) {

  try {
    var GOOGLE_API_CLIENT_EMAIL = process.env.GOOGLE_API_CLIENT_EMAIL;
    var GOOGLE_API_PRIVATE_KEY = process.env.GOOGLE_API_PRIVATE_KEY.replace(/\\n/g, "\n");

    var oauth2Client = new google.auth.JWT(GOOGLE_API_CLIENT_EMAIL, null, GOOGLE_API_PRIVATE_KEY, ["https://www.googleapis.com/auth/analytics.readonly"], null);
  } catch(err) {
    global_error = "Error on load - check your environments variables GOOGLE_API_CLIENT_EMAIL and GOOGLE_API_PRIVATE_KEY.";
  }

  robot.hear(/analytics profiles/, function(res)
  {
    if(global_error) {
      return res.reply(global_error)
    }
    oauth2Client.authorize(function(err)
    {
      analytics.management.profiles.list(
        {
          auth: oauth2Client,
          accountId: "~all",
          webPropertyId: "~all"
        },
        function(err, entries) {
          if (err) {
            return res.reply(err);
          }

          var response = entries.items.map(function(item) {
            return item.id + " - " + item.name;
          }).join("\n");

          return res.reply(response);
        }
      );
    });
  });


  robot.hear(/analytics pageviews\s+(\d+)/i, function(res)
  {
    var siteId = res.match[1];
    var today = Date.today();
    var startDate = today.removeDays(30).toYMD("-");
    var endDate = today.toYMD("-");

    if(global_error) {
      return res.reply(global_error)
    }
    oauth2Client.authorize(function(err)
    {
      analytics.data.ga.get({
        auth: oauth2Client,
        "ids": "ga:"+siteId,
        "start-date": startDate,
        "end-date": endDate,
        "metrics": "ga:visits, ga:pageviews"
      },
      function(err, entries) {
        if (err) {
          console.log(err);
          return res.reply(err);
        }
        var visits = entries.totalsForAllResults["ga:visits"];
        var pageviews = entries.totalsForAllResults["ga:pageviews"];
        var profileName = entries.profileInfo.profileName;

        return res.reply(profileName+": "+visits+" visits and "+pageviews+" pageviews.");
      });
    });
  });

};
