// model.js
var mongoose = require('mongoose');
// Setup schema
var playerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: String,
    phone: String,
    create_date: {
        type: Date,
        default: Date.now
    }
});
// Export Player model
var Player = module.exports = mongoose.model('player', playerSchema);
module.exports.get = function (callback, limit) {
    Player.find(callback).limit(limit);
}