const Player = require('./model');

module.exports.setUpDummyData = () => {
  var player = new Player();
  player.name = "Teemo"
  player.gender = "Unknown";
  player.email = "dartcoming@lol.com";
  player.phone = "61116";
  player.save();
  return player.id;
};
