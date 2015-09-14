// ProductReviews.js
// -----------------
// Defines the ProductReviews module (Model, Collection, Views, Router)
// Mount to App also handles rendering of the reviews
// if the current view has any placeholder for them
define('ProductReviews'
,	['ProductReviews.Model', 'ProductReviews.Collection', 'ProductReviews.Views', 'ProductReviews.Router']
,	function (Model, Collection, Views, Router)
{
	'use strict';
    
    // @method Parse url options and return product reviews api params
    // @param {ApplicationSkeleton} application
    // @param {object} options url parameters
    // @return {object} reviews_params
    var getReviewParams = function(options, application)
    {
        var sort
        ,	filter
            // Cumputes Params for Reviews API
        ,	reviews_params = {};

        if (options)
        {
            // if there's a filter in the URL
            if (options.filter)
            {
                // we get it from the config file, based on its id
                filter = _.find(application.getConfig('productReviews.filterOptions'), function (i) {
                    return i.id === options.filter;
                }) || {};
            }
            else
            {
                // otherwise we just get the default one
                filter = _.find(application.getConfig('productReviews.filterOptions'), function (i) {
                    return i.isDefault;
                }) || {};
            }
            // and we add it to the reviews_params obj
            reviews_params = _.extend(reviews_params, filter.params);

            // same for sorting, if it comes as a parameter
            if (options.sort)
            {
                // we get it from the config file
                sort = _.find(application.getConfig('productReviews.sortOptions'), function (i) {
                    return i.id === options.sort;
                }) || {};
            }
            else
            {
                // otherwise we just get the default one
                sort = _.find(application.getConfig('productReviews.sortOptions'), function (i) {
                    return i.isDefault;
                }) || {};
            }
            // and we add it to the reviews_params obj
            reviews_params = _.extend(reviews_params, sort.params);
        }

        // If there's a specific page in the url, we pass that to
        // if there isn't, we just get the first oen
        reviews_params = _.extend(reviews_params, {page: options && options.page || 1});

        return reviews_params;
    };
    
    var ProductReviewsModule = {
		Views: Views
	,	Model: Model
	,	Router: Router
	,	Collection: Collection
	,	mountToApp: function (application)
		{
			Model.prototype.urlRoot = _.getAbsoluteUrl(Model.prototype.urlRoot);
			Collection.prototype.url = _.getAbsoluteUrl(Collection.prototype.url);
            
            Collection.prototype.getReviewParams = getReviewParams;
            Collection.prototype.application = application;
    
            // fetch and display product reviews
            application.showProductReviews = function (model, options, $placeholder)
            {
                // get the reviews api params
                var reviews_params = getReviewParams(options, application)
                ,   collection = new Collection()
                ,   self = this
                ,   view = new Views.ItemReviewCenter({
                        collection: collection
                    ,   baseUrl: 'product/' + model.get('internalid')
                    ,	queryOptions: options || {}
                    ,	item: model
                    ,	application: self
                    });

                // add the item internal id to the reviews api params
                reviews_params.itemid = model.get('internalid');

                // return the fetch 'promise'
                collection.fetch(
                { 
                    data: reviews_params
                ,	killerId: this.killerId
                }).done(function ()
                {
                    view.updateCannonicalLinks();
                    
                    // append and render the view
                    $placeholder.empty().append(view.$el);
                    view.render();
                    
                    collection.on('reset', function ()
                    {
                        view.render();
                    }, self);
                
                }); 
            };

			// default behaviour for mount to app
			return new Router(application);
		}
	};
    
    return ProductReviewsModule;
});
