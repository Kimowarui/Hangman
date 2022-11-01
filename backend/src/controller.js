// controller.js
// Import player model
Player = require('./model');
// Handle index actions
exports.index = function (req, res) {
    Player.get(function (err, players) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Players retrieved successfully",
            data: players
        });
    });
};
// Handle create player actions
exports.new = function (req, res) {
    var player = new Player();
    player.name = req.body.name ? req.body.name : player.name;
    player.gender = req.body.gender;
    player.email = req.body.email;
    player.phone = req.body.phone;
// save the player and check for errors
    player.save(function (err) {
        // Check for validation error
        if (err)
            res.json(err);
        else
            res.json({
                message: 'New player created!',
                data: player
            });
    });
};
// Handle view player info
exports.view = function (req, res) {
    Player.findById(req.params.player_id, function (err, player) {
        if (err)
            res.send(err);
        res.json({
            message: 'Player details loading..',
            data: player
        });
    });
};
// Handle update player info
exports.update = function (req, res) {
    Player.findById(req.params.player_id, function (err, player) {
        if (err)
            res.send(err);
        player.name = req.body.name ? req.body.name : player.name;
        player.gender = req.body.gender;
        player.email = req.body.email;
        player.phone = req.body.phone;
// save the player and check for errors
        player.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Player Info updated',
                data: player
            });
        });
    });
};
// Handle delete player
exports.delete = function (req, res) {
    Player.remove({
        _id: req.params.player_id
    }, function (err, player) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'Player deleted'
        });
    });
};