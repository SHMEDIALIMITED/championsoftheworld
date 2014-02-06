

module.exports = function (app, config) { 

	var pages = require('../app/controllers/pages')(config);

	// Web App index
	app.get('/', pages.index);

    // Update tweet
    app.put('/:id', pages.updateItem);

}