// ProductReviews.Router.js
// ------------------------
// Handles the rendering of the different views depending on the URL route
define('ProductReviews.Router'
,	['ProductReviews.Model', 'ProductReviews.Collection', 'ProductReviews.Views', 'ItemDetails.Model']
,	function (Model, Collection, Views, ItemDetailsModel)
{
	'use strict';
	
	// http://backbonejs.org/#Router
	return Backbone.Router.extend({

		routes: { 
            'product/:id/newReview': 'createReviewById'
        ,	':url/newReview': 'createReviewByUrl'
		}
		
	,	initialize: function (Application)
		{
			this.application = Application;
		}

	,	createReviewByUrl: function (url)
		{
			// if there are any options in the URL
			if (~url.indexOf('?'))
			{
				url = url.split('?')[0];
			}
			
			// Now go grab the data and show it
			this.createReview({url: url});
		}
	
	,	createReviewById: function (id)
		{
			this.createReview({id: id});
		}
		
		// createReview:
		// renders the Product Reviews form
	,	createReview: function (api_params)
		{
			var item_details_model = new ItemDetailsModel()

			,	model = new Model()
				// creates a new instance of the Form View
			,	view = new Views.Form({
					item: item_details_model
				,	model: model
				,	application: this.application
				});
			
			// then we fetch for the data of the item
			item_details_model.fetch({
				data: api_params
			,	killerId: this.application.killerId
			}).done(function ()
			{
				// and we show the content on success
				view.showContent();
			});
		}
	});
});