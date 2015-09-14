/*jshint laxcomma:true*/
define(['ProductReviews', 'ProductReviews.Model', 'ProductReviews.Collection', 'ProductReviews.Views', 'ProductReviews.Router', 'Application'], function (Module, Model, Collection, Views)
{
	'use strict';

	describe('Product Reviews module', function ()
	{
		var is_started = false
		,	application;

		beforeEach(function ()
		{
			is_started = false; 
			if (!is_started)
			{
				application = SC.Application('ProductReviews');
				application.Configuration = {
					modules: ['ProductReviews']
                ,   productReviews: {
                        filterOptions: [
                            {id: 'filter1', name: 'filter1', params: { filterValue: 1}, isDefault: true}
                        ,   {id: 'filter2', name: 'filter2', params: { filterValue: 2}}
                        ,   {id: 'filter3', name: 'filter3', params: { filterValue: 3}}

                        ]
                    ,	sortOptions: [
                            {id: 'sort1', name: 'sort1', params: {order: 'sort1'}, isDefault: true}
                        ,   {id: 'sort2', name: 'sort2', params: {order: 'sort2'},}
                        ,   {id: 'sort3', name: 'sort3', params: {order: 'sort3'}}

                        ]
                    }
				};

				jQuery(application.start(function () { is_started = true; }));
				waitsFor(function() { return is_started; });
			}
		});
        
        it('#1 "getReviewParams" should be defined in the collection', function (){
            expect(Collection.prototype.getReviewParams).toBeDefined();
        });
        
        it('#2 "getReviewParams" should return no params values if no parameters', function (){
            var getReviewsParams = Collection.prototype.getReviewParams;
            var result = getReviewsParams();

            expect(result).toEqual({page: 1});
            
        });
        
        it('#3 "getReviewParams" should dismiss wrong options values', function (){
            var getReviewsParams = Collection.prototype.getReviewParams;
            
            var options = {foo: 'bar', filter: 'filter1', sort: 'sort1'};
            var result = getReviewsParams(options, application);
            
            expect(result.order).toEqual('sort1');
            expect(result.page).toEqual(1);
            expect(result.foo).toBeUndefined();
        });
        
        it('#4 "getReviewParams" should return the specified options values', function (){
            var getReviewsParams = Collection.prototype.getReviewParams;
            
            var options = {filter: 'filter3', sort: 'sort2', page: 5};
            var result = getReviewsParams(options, application);
            
            expect(result.filterValue).toBe(3);
            expect(result.order).toBe('sort2');
            expect(result.page).toBe(5);
        }); 
        
        it('#5 "getReviewParams" should include the current page', function (){
            var getReviewsParams = Collection.prototype.getReviewParams;
            
            var options = {filter: 'filter3', sort: 'sort2', page: 5};
            var result = getReviewsParams(options, application);

            expect(result.page).toBe(5);
        });
    
        it('#6 "getReviewParams" should return default values if no id match', function (){
            var getReviewsParams = Collection.prototype.getReviewParams;
            
            var options = {foo: 'filter3', bar: 'sort2', tar: 5};
            var result = getReviewsParams(options, application);

            expect(result.filterValue).toBe(1);
            expect(result.order).toBe('sort1');
            expect(result.page).toBe(1);
        });

        it('#7 "showProductReviews" should be defined within the application', function ()
        {
            expect(application.showProductReviews).toBeDefined();
        });
        
        it('#8 "showProductReviews" should render the view', function ()
        {
            spyOn(Collection.prototype, 'fetch').andCallFake(function(){ return jQuery.Deferred().resolve(); });
            spyOn(Views.ItemReviewCenter.prototype, 'render');
            
            var model = new Model({internalid: 1});
            
            application.showProductReviews(model, null, jQuery(''));
            
            expect(Views.ItemReviewCenter.prototype.render).toHaveBeenCalled();
        });
        
        it('#9 "showProductReviews" should render the view when collection is fetched (on reset)', function ()
        {
            var model = new Model({internalid: 1})
            ,   collection;
            
            spyOn(Collection.prototype, 'fetch').andCallFake(function(){ return jQuery.Deferred().resolve(); });
            spyOn(Views.ItemReviewCenter.prototype, 'render').andCallFake(function(){ collection = this.collection; });
            
            application.showProductReviews(model, null, jQuery(''));
            
            expect(Views.ItemReviewCenter.prototype.render.callCount).toEqual(1);
            
            collection.reset();
            expect(Views.ItemReviewCenter.prototype.render.callCount).toEqual(2);
        });
        
        it('#10 "showProductReviews" should fetch the collection with the correct data params', function ()
        {
            var model = new Model({internalid: 1})
            ,   options = {filter: 'filter3', sort: 'sort2', page: 5};
            
            spyOn(Collection.prototype, 'fetch').andCallThrough();
            
            application.showProductReviews(model, options, jQuery(''));
            
            var expected = { data: { filterValue: 3, order: 'sort2', page: 5, itemid: 1}, killerId: undefined };
            expect(Collection.prototype.fetch).toHaveBeenCalledWith(expected);
        });
	});
    
    describe('Product Reviews collection', function ()
    {
        it('#1 Collection methods should defined', function()
        {
            expect(Collection.prototype.parse).toBeDefined();
            expect(Collection.prototype.parseOptions).toBeDefined();
            expect(Collection.prototype.update).toBeDefined();
        });
        
        it('#2 Collection should have the application instance', function()
        {
            expect(Collection.prototype.application).toBeDefined();
            expect(Collection.prototype.application.getConfig).toBeDefined();
        });

        it('#3 "update" should fetch the collection', function()
        {
            // plan
            var collection = new Collection();
            
            spyOn(collection, 'fetch');
            spyOn(collection, 'parseOptions');
            
            // do
            collection.update({});
            
            // assert
            expect(collection.fetch).toHaveBeenCalled();
        });
        
        it('#4 "update" should fetch the collection with the correct parameters', function()
        {  
            // plan
            var collection = new Collection()
            ,   options = {filter: {id: 'filter3'}, sort: { id: 'sort2'}, page: 5}
            ,   expected = { data: { filterValue: 3, order: 'sort2', page: 5}, reset: true, killerId: undefined };
            
            spyOn(collection, 'fetch');
            
            // do
            collection.update(options);
            
            // assert
            expect(collection.fetch).toHaveBeenCalledWith(expected);
        });
    });
    
    describe('Product Reviews Views.ItemReviewCenter', function ()
    {
        it('#1 view should be defined', function()
        {
            expect(Views.ItemReviewCenter).toBeDefined();
        });
        
        it('#2 "getRelPrev" should return null if first page', function()
        {
            var item = { get: function(){ return 1; } }
            ,   application = SC.Application('ProductReviews')
            ,   options = { item: item, queryOptions: { page: 1 }, collection: {}, application: application}
            ,   view = new Views.ItemReviewCenter(options);
            
            var result = view.getRelPrev()
            ,   expected = null;
            
            expect(result).toBe(expected);
        });
        
        it('#3 "getRelPrev" should return baseUrl if second page', function()
        {
            var item = { get: function(){ return 1; } }
            ,   application = SC.Application('ProductReviews')
            ,   options = { item: item, queryOptions: { page: 2 }, collection: {}, application: application, baseUrl: 'foo.bar'}
            ,   view = new Views.ItemReviewCenter(options);
            
            var result = view.getRelPrev()
            ,   expected = 'foo.bar';
            
            expect(result).toBe(expected);
        });
        
        it('#4 "getRelPrev" should return baseUrl plus page params if third page or more', function ()
        {
            var item = { get: function(){ return 1; } }
            ,   application = SC.Application('ProductReviews')
            ,   options = { item: item, queryOptions: { page: '5' }, collection: {}, application: application, baseUrl: 'foo.bar'}
            ,   view = new Views.ItemReviewCenter(options);
            
            var result = view.getRelPrev()
            ,   expected = 'foo.bar?page=4';
            
            expect(result).toBe(expected);
        });
        
        it('#5 "getRelNext" should return null if its last page', function ()
        {
            var item = { get: function(){ return 1; } }
            ,   application = SC.Application('ProductReviews')
            ,   options = { item: item, queryOptions: { page: 2 }, collection: { totalPages: 1}, application: application, baseUrl: 'foo.bar'}
            ,   view = new Views.ItemReviewCenter(options);
            
            var result = view.getRelNext()
            ,   expected = null;
            
            expect(result).toBe(expected);
        });
        
        it('#6 "getRelNext" should return baseUrl and page param', function ()
        {
            var item = { get: function(){ return 1; } }
            ,   application = SC.Application('ProductReviews')
            ,   options = { item: item, queryOptions: { page: 2 }, collection: { totalPages: 5}, application: application, baseUrl: 'foo.bar'}
            ,   view = new Views.ItemReviewCenter(options);
            
            var result = view.getRelNext()
            ,   expected = 'foo.bar?page=3';
            
            expect(result).toBe(expected);
        });
        
        it('#7 "getUrlForOption" default values from queryOptions', function ()
        {
            var item = { get: function(){ return 1; } }
            ,   application = SC.Application('ProductReviews')
            ,   options = { item: item, queryOptions: { sort: 'sort1', filter: 'filter1' }, collection: { totalPages: 1}, application: application, baseUrl: 'foo.bar'}
            ,   view = new Views.ItemReviewCenter(options);
            
            var result = view.getUrlForOption()
            ,   expected = 'foo.bar?filter=filter1&sort=sort1';
            
            expect(result).toBe(expected);
        });
        
        it('#8 "getUrlForOption" appropiate param values', function ()
        {
            var item = { get: function(){ return 1; } }
            ,   application = SC.Application('ProductReviews')
            ,   options = { item: item, queryOptions: { sort: 'sort1', filter: 'filter1' }, collection: { totalPages: 1}, application: application, baseUrl: 'foo.bar'}
            ,   view = new Views.ItemReviewCenter(options)
            ,   option = { filter: 'filter2' };
            
            var result = view.getUrlForOption(option)
            ,   expected = 'foo.bar?filter=filter2&sort=sort1';
            
            expect(result).toBe(expected);
        });
        
        it('#9 "setupListHeader" should define the listHeader var', function ()
        {
            var application = SC.Application('ProductReviews');
            
            application.Configuration = {
                modules: ['ProductReviews']
            ,   productReviews: {
                    filterOptions: [
                        {id: 'filter1', name: 'filter1', params: { filterValue: 1}, isDefault: true}
                    ,   {id: 'filter2', name: 'filter2', params: { filterValue: 2}}
                    ,   {id: 'filter3', name: 'filter3', params: { filterValue: 3}}

                    ]
                ,	sortOptions: [
                        {id: 'sort1', name: 'sort1', params: {order: 'sort1'}, isDefault: true}
                    ,   {id: 'sort2', name: 'sort2', params: {order: 'sort2'},}
                    ,   {id: 'sort3', name: 'sort3', params: {order: 'sort3'}}

                    ]
                }
            };   
            
            spyOn(Views.ItemReviewCenter.prototype, 'setupListHeader').andCallThrough();
            var options = { item: { get: function(){ return 1; }}, collection: {}, application: application}
            ,   view = new Views.ItemReviewCenter(options);
                       
            expect(view.setupListHeader).toHaveBeenCalled();
            expect(view.listHeader).toBeDefined();
        });
        
        it('#10 "updateCannonicalLinks" should add canonical links to head element ', function ()
        {
            var application = SC.Application('ProductReviews')
            ,   options = { item: { get: function(){ return 1; } }, queryOptions: { page: 3 }, collection: { totalPages: 5}, application: application, baseUrl: 'foo.bar'}
            ,   view = new Views.ItemReviewCenter(options);
            
            view.updateCannonicalLinks();

            var $rel_prev = jQuery('head').find('link[rel="prev"]')
            ,   $rel_next = jQuery('head').find('link[rel="next"]');
            

            expect($rel_prev.attr('href')).toEqual('foo.bar?page=2');
            expect($rel_next.attr('href')).toEqual('foo.bar?page=4');
        });
        
        xit('#11 "handleMarkSuccess" TODO', function(){});
        xit('#12 "handleMarkError" TODO', function(){});
        xit('#13 "markReview" TODO', function(){});
        xit('#14 "getBreadcrumb" TODO', function(){});
        
    });
    
    describe('Product Reviews Views.Form', function ()
    {
        it('#1 view should be defined', function()
        {
            expect(Views.Form).toBeDefined();
        });
        
        xit('#2 "rate" TODO', function() {});
        xit('#3 "sanitize" TODO', function() {});
        xit('#4 "preview" TODO', function() {});
        xit('#5 "getBreadcrumb" TODO', function() {});
        xit('#6 "updateMetaTags" TODO', function() {});
    });
    
    describe('Product Reviews Views.FormPreview', function ()
    {
        it('#1 view should be defined', function()
        {
            expect(Views.FormPreview).toBeDefined();
        });
        
        xit('#2 "edit" TODO', function (){});
        xit('#3 "save" TODO', function (){});
        xit('#4 "getBreadcrumb" TODO', function (){});
    });
    
    describe('Product Reviews Views.FormConfirmation', function ()
    {
        it('#1 view should be defined', function()
        {
            expect(Views.FormConfirmation).toBeDefined();
        });
        
        xit('#2 "getBreadcrumb" TODO', function (){});
    });
    
    
});