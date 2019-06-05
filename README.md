# hubot-analytics

[![Build Status](https://circleci.com/gh/PlanBCom/hubot-analytics/tree/master.svg?style=shield)](https://circleci.com/gh/PlanBCom/hubot-analytics)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/f59fb080459140a497bd17f357147e2d)](https://www.codacy.com/app/godoy-ccp/hubot-analytics)
[![Open Source Helpers](https://www.codetriage.com/planbcom/hubot-analytics/badges/users.svg)](https://www.codetriage.com/planbcom/hubot-analytics)

A hubot script to get google analytics reports

See [`src/analytics.js`](src/analytics.js) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-analytics --save`

Then add **hubot-analytics** to your `external-scripts.json`:

```json
[
  "hubot-analytics"
]
```

### Configuration

1. Create a [`https://console.developers.google.com/project`](google project)
2. Enable "Analytics API" in your project (https://console.developers.google.com/apis/)
3. Create a service account https://console.developers.google.com/permissions/serviceaccounts and download JSON with private key
4. Configure the followings environments variables in your hubot server:
```
GOOGLE_API_PRIVATE_KEY - look for 'private_key' in JSON
GOOGLE_API_CLIENT_EMAIL - look for 'client_email' in JSON
```


## Sample Interaction
Run ```analytics help``` for full list of commands


### Shows profiles to which the bot has access and store in hubot brain
```
User> analytics profiles
SpikeBot> @User:
114783908 - Project X
123511123 - Site Plan B
128210353 - Hubot Chat
```

### Shows pageviews and visits of website with "Site Name or ID"
```
User> analytics pageviews "Site Name or ID"
SpikeBot> @User: SiteName: 6346 visits and 12317 pageviews.
```

### Get percentage mobile x desktop access of website with "Site Name or ID"
```
User> analytics devices "Site Name or ID"
SpikeBot> @User: desktop - 1450 sessions (21.75%)
mobile - 4903 sessions (73.54%)
tablet - 314 sessions (4.71%)
```

### Get browsers percentage access with "Site Name or ID"
```
User> analytics browser "Site Name or ID"
SpikeBot> @User: Chrome - 3885 sessions (75.68%)
Firefox - 290 sessions (21%)
Internet Explorer - 115 sessions (3.32%)
```

## Contributing

1. Fork it (https://github.com/PlanBCom/hubot-analytics/fork).
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Create a new Pull Request.
