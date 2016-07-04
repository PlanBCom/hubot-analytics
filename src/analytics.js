// Description
//   A hubot script to get google analytics reports
//
// Configuration:
//   GOOGLE_API_CLIENT_EMAIL
//   GOOGLE_API_PRIVATE_KEY
//
// Commands:
//   analytics help - Returns a list of commands for this plugin
//   analytics profiles - Shows profiles to which the bot has access
//   analytics pageviews 123123 - Shows pageviews and visits of website with id 123123
//   analytics devices 123123 - Get percentage mobile x desktop access of website with id 123123
//   analytics browsers 123123 - Get browsers percentage access with id 123123
//   analytics show email - Get email account api configured to give access to others analytics profiles.
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   Plan B Comunicação <dev@planb.com.br>

var google = require("googleapis");
require("date-utils");

var HubotAnalytics = require('./lib/HubotAnalytics.js');
var hubotAnalytics = new HubotAnalytics();

var analytics = google.analytics("v3");
var globalError;

module.exports = function(robot) {
  hubotAnalytics.profilesNames = robot.brain.get('profilesNames');

  try {
    var GOOGLE_API_CLIENT_EMAIL = process.env.GOOGLE_API_CLIENT_EMAIL;
    var GOOGLE_API_PRIVATE_KEY = process.env.GOOGLE_API_PRIVATE_KEY.replace(/\\n/g, "\n");

    var oauth2Client = new google.auth.JWT(GOOGLE_API_CLIENT_EMAIL, null, GOOGLE_API_PRIVATE_KEY, ["https://www.googleapis.com/auth/analytics.readonly"], null);
  } catch(err) {
    globalError = "Error on load - check your environments variables GOOGLE_API_CLIENT_EMAIL and GOOGLE_API_PRIVATE_KEY.";
  }

  robot.hear(/analytics help/i, function(res)
  {
    var helpTxt = "\nanalytics help - Returns a list of commands for this plugin\n" +
    "analytics profiles - Shows profiles to which the bot has access\n" +
    "analytics pageviews 123123 - Shows pageviews and visits of website with id 123123\n" +
    "analytics devices 123123 - Get percentage mobile x desktop access of website with id 123123\n" +
    "analytics browsers 123123 - Get browsers percentage access with id 123123\n" +
    "analytics show email - Get email account api configured to give access to others analytics profiles.";

    return res.send(helpTxt);
  });


  robot.hear(/analytics profiles/, function(res)
  {
    if(globalError) {
      return res.reply(globalError);
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

          var mapProfilesNames = {};
          var response = entries.items.map(function(item) {
            mapProfilesNames[item.name] = item.id; //hash by name
            return item.id + " - " + item.name;
          }).join("\n");

          robot.brain.set('profilesNames', mapProfilesNames); // store in brain
          hubotAnalytics.profilesNames = mapProfilesNames;

          return res.reply(response);
        }
      );
    });
  });


  robot.hear(/analytics pageviews\s+("[\w .\-\[\]]+")$/i, function(res)
  {
    var site = hubotAnalytics.getSiteId(res.match[1]);
    var startDate = Date.today().removeDays(30).toYMD("-");
    var endDate = Date.today().toYMD("-");

    if(globalError) {
      return res.reply(globalError);
    }
    oauth2Client.authorize(function(err)
    {
      analytics.data.ga.get({
        auth: oauth2Client,
        "ids": "ga:" + site,
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


  robot.hear(/analytics devices?\s+("[\w .\-\[\]]+")$/i, function(res)
  {
    var site = hubotAnalytics.getSiteId(res.match[1]);

    var startDate = Date.today().removeDays(30).toYMD("-");
    var endDate = Date.today().toYMD("-");
    var result = "";

    if(globalError) {
      return res.reply(globalError);
    }
    oauth2Client.authorize(function(err)
    {
      analytics.data.ga.get({
        auth: oauth2Client,
        "ids": "ga:" + site,
        "start-date": startDate,
        "end-date": endDate,
        "metrics": "ga:sessions",
        "dimensions": "ga:deviceCategory"
      },
      function(err, entries) {
        if (err) {
          console.log(err);
          return res.reply(err);
        }

        var total = parseInt(entries.totalsForAllResults["ga:sessions"]);
        if(total>0) {
          result = entries.rows.map(function(item) {
            var percentage = (parseInt(item[1]) / total) * 100;
            return item[0] + " - " + item[1] + " sessions (" + (percentage.toFixed(2)) + "%)";
          }).join("\n");
        }

        return res.reply(result);
      });
    });
  });


  robot.hear(/analytics browsers?\s+("[\w .\-\[\]]+")$/i, function(res)
  {
    var site = hubotAnalytics.getSiteId(res.match[1]);

    var startDate = Date.today().removeDays(30).toYMD("-");
    var endDate = Date.today().toYMD("-");
    var result = "";

    if(globalError) {
      return res.reply(globalError);
    }
    oauth2Client.authorize(function(err)
    {
      analytics.data.ga.get({
        auth: oauth2Client,
        "ids": "ga:"+site,
        "start-date": startDate,
        "end-date": endDate,
        "metrics": "ga:sessions",
        "dimensions": "ga:browser",
        "sort": "-ga:sessions"
      },
      function(err, entries) {
        if (err) {
          console.log(err);
          return res.reply(err);
        }

        var total = parseInt(entries.totalsForAllResults['ga:sessions'])
        if(total>0) {
          result = entries.rows.map(function(item) {
            var percentage = (parseInt(item[1]) / total) * 100;
            return item[0] + " - " + item[1] + " sessions (" + (percentage.toFixed(2)) + "%)";
          }).join("\n");
        }

        return res.reply(result);
      });
    });
  });


  robot.hear(/analytics show email/i, function(res)
  {
    return res.send(GOOGLE_API_CLIENT_EMAIL||"Blank - you must config your environment variables.");
  });

};
