// api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to Hangman',
    });
});
// Import contact controller
var playController = require('./controller');
// Contact routes
router.route('/players')
    .get(playController.index)
    .post(playController.new);

router.route('/players/:player_id')
    .get(playController.view)
    .patch(playController.update)
    .put(playController.update)
    .delete(playController.delete);


// Export API routes
module.exports = router;