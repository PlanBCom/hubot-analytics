var _ = require("underscore");
var s = require("underscore.string");

function HubotAnalytics() {
  this.profilesNames = {};
}

HubotAnalytics.prototype.getSiteId = function(siteMatch) {
  siteMatch = siteMatch.replace(/"/g, '');

  var gaByName = this.profilesNames[siteMatch];

  if(gaByName != undefined) {
    return gaByName; //found by exact name
  } else {
    var gaByContainsName = _.find(this.profilesNames, function(item, key){
                return s.include(key, siteMatch);
              });

    if(gaByContainsName != undefined) {
      return gaByContainsName; //found by "like name"
    } else {
      return siteMatch; //return inputed ga code
    }
  }
};

module.exports = HubotAnalytics;
