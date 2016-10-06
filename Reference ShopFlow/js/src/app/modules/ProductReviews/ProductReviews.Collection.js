// ProductReviews.Collection.js
// ----------------------------
// Returns an extended version of the CachedCollection constructor
// (file: Backbone.cachedSync.js)
define('ProductReviews.Collection', ['ProductReviews.Model'], function (Model)
{
	'use strict';
	
	return Backbone.CachedCollection.extend({
		
		url: 'services/product-reviews.ss'
		
	,	model: Model
		
		// pre-processes the data after fetching
		// http://backbonejs.org/#Model-parse
	,	parse: function (data)
		{
			// We set up some global attributes to the Collection
			this.page = data.page;
			this.recordsPerPage = data.recordsPerPage;
			this.totalRecordsFound = data.totalRecordsFound;
			this.totalPages = Math.ceil(this.totalRecordsFound / this.recordsPerPage);
			
			// and we return only the collection from the server
			return data.records;
		}
        
    ,   parseOptions: function (options)
        {
            if (options)
            {
                if (options.filter)
                {
                    options.filter = options.filter.id;
                }
                
                if (options.sort)
                {
                    options.sort = options.sort.id;
                }
                
                options.itemid = this.itemId;
            }
            
            return options;
        }
        
        // Collection.update:
		// custom method called by ListHeader view
		// it receives the currently applied filter,
		// currently applied sort and currently applied order
	,	update: function (options)
		{
            var data = this.getReviewParams(this.parseOptions(options), this.application);
            
            if (data.order)
            {
                // check for inverse results
                data.order = options.order && options.order < 0 ? data.order.replace('ASC', 'DESC') : data.order.replace('DESC', 'ASC');
            }
            
			this.fetch({
				data: data
            ,   reset: true
			,	killerId: options.killerId
			});
		}
	});
});