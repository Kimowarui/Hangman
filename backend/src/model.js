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
var Player = module.exports = mongoose.model('contact', playerSchema);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}