// Description
//   A hubot script to get google analytics reports
//
// Configuration:
//   LIST_OF_ENV_VARS_TO_SET
//
// Commands:
//   hubot analytics - <what the respond trigger does>
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   Plan B Comunicação <dev@planb.com.br>

module.exports = function(robot) {

  robot.hear(/analytics/, function(res) {
    return res.reply("hello!");
  });


};
