
function HubotAnalytics() {
  this.profilesNames = "ok";
}

HubotAnalytics.prototype.getSiteId = function(siteMatch) {
  var site = siteMatch;
  var targetGa = site.replace(/"/g, '');

  var tryValueByName = this.profilesNames[targetGa];
  if(tryValueByName != undefined) {
    targetGa = tryValueByName;
  }

  return targetGa;
};


module.exports = HubotAnalytics;
