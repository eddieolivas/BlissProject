define(['Facets.Router', 'Application'], function ()
{
	'use strict';

	describe('Module: Facets.Router', function () {

		var is_started = false
			,	application
			,	facets_helper
			,	facets
			,	router
			,	default_translator
			,	bike_color_map = {
					'Black': 'black'
				,	'Blue': 'blue'
				,	'Gray': 'gray'
				,	'Green': 'green'
				,	'Red': 'red'
				,	'Silver Black': '#333'
				,	'Violet': 'violet'
				,	'White': 'white'
				,	'Chrome': '#F5F5F5'
				,	'Silver': 'silver'
				};

		beforeEach(function ()
		{
			// Here is the appliaction we will be using for this tests
			application = SC.Application('Facets.Translator');
			// This is the configuration needed by the modules in order to run
			application.Configuration =  {
					modules: [ 'Facets', 'UrlHelper' ]
				,	searchApiMasterOptions: {
						Facets: {
							include: 'facets'
						,	fieldset: 'search'
						//,	custitem_exclude_from_search: 'false'
						}
					,	itemDetails: {
							fieldset: 'details'
						}	
					}

					// Facet View

				,	facets: [
						{
							id: 'category'
						,	name: 'Category'
						,	max: 10
						,	behavior: 'single'
						,	url: ''
						,	macro: 'facetCategories'
						,	priority: 11
						,	uncollapsible: true
						}
					,	{
							id: 'custitem_bike_brands'
						,	name: 'Brand'
						,	max: 10
						,	behavior: 'single'
						,	url: 'brand'
						,	priority: 10
						,	uncollapsible: true
						}
					,	{
							id: 'custitem_bike_type'
						,	name: 'Style'
						,	max: 10
						,	behavior: 'multi'
						,	url: 'style'
						,	priority: 9
						,	uncollapsible: true
						}
					,	{
							id: 'custitem_bike_colors'
						,	name: 'Color'
						,	max: 5
						,	behavior: 'multi'
						,	url: 'color'
						,	macro: 'facetColor'
						,	priority: 8
						,	colors: bike_color_map
						}
					,	{
							id: 'custitem_gt_matrix_colors'
						,	name: 'GT Colors'
						,	max: 5
						,	behavior: 'multi'
						,	url: 'gt-colors'
						,	macro: 'facetColor'
						,	priority: 6
						,	colors: bike_color_map
						}
					,	{
							id: 'custitem_matrix_tire_size'
						,	name: 'Matrix Tire Size'
						,	max: 5
						,	behavior: 'multi'
						,	url: 'mtire'
						,	priority: 2
						}
					,	{
							id: 'custitem_tire_size'
						,	name: 'Tire Size'
						,	max: 5
						,	behavior: 'multi'
						,	url: 'tire'
						,	priority: 2
						}
					,	{
							id: 'pricelevel5'
						,	name: 'Price'
						,	url: 'price'
						,	priority: 0
						,	max: 5
						,	behavior: 'range'
						,	macro: 'facetRange'
						,	step: 50
						,	parser: function (value) 
							{
								return _.formatCurrency(value);
							} 
						}
					]
					
				,	facetDelimiters: {
						betweenFacetNameAndValue: '/'
					,	betweenDifferentFacets: '/'
					,	betweenDifferentFacetsValues: ','
					,	betweenRangeFacetsValues: 'to'
					,	betweenFacetsAndOptions: '?'
					,	betweenOptionNameAndValue: '='
					,	betweenDifferentOptions: '&'
					}
				,	resultsPerPage: [
						{ items: 10, name: '10 Items' }
					,	{ items: 25, name: '25 Items', isDefault: true }
					,	{ items: 50, name: '50 Items' }
					]

				,	itemsDisplayOptions: [
						{ id: 'list', name: 'List', macro: 'itemListingDisplayList', columns: 1, icon: 'icon-th-list' }
					,	{ id: 'table', name: 'Table', macro: 'itemListingDisplayTable', columns: 2, icon: 'icon-th-large' }
					,	{ id: 'grid', name: 'Grid', macro: 'itemListingDisplayGrid', columns: 4, icon: 'icon-th', isDefault: true }
					]
					
				,	sortOptions: [
						{ id: 'relevance:asc', name: 'Relevance', isDefault: true }
					,	{ id: 'pricelevel5:asc', name: 'Price, Low to High' }
					,	{ id: 'pricelevel5:desc', name: 'Price, High to Low ' }
					]
			};
			
			// Starts the application
			jQuery(application.start(function () { is_started = true; }));
			
			// Makes sure the application is started before 
			waitsFor(function() {
				if (is_started)
				{
					facets = require('Facets');
					facets_helper = require('Facets.Translator');					
					default_translator = new facets.Translator('/color/blue,red/gender/male/price/10to100?page=3&order=price', null ,application.translatorConfig);					
					router = new facets.Router(application);

					return default_translator && is_started && facets; 
				}
				else
				{
					return false;
				}
			});
		});

		it('#1: getFacetAliasesMapping method should generate data correctly', function() {

			var corrections = [{usedAlias: 'product1_alias', url: 'product1'}, {usedAlias: 'product2_alias', url: 'product2'}, {usedAlias: 'product3_alias', url: 'product3'}]
			,	expected_mapping = {product1_alias: 'product1', product2_alias: 'product2', product3_alias: 'product3'}
			,	result_mapping = router.getFacetsAliasesMapping(corrections);

			expect(_.isEqual(result_mapping, expected_mapping)).toBe(true);
		});

		it('#2: getFacetAliasesMapping method generate data correctly if no corrections are received', function() {

			var corrections = []
			,	expected_mapping = {}
			,	result_mapping = router.getFacetsAliasesMapping(corrections);

			expect(_.isEqual(result_mapping, expected_mapping)).toBe(true);
		});

		it('#3: unaliasUrl method should unalias an aliased URL (One facet alias)', function() {

			var corrections = [{usedAlias: 'colour', url: 'color'}, {usedAlias: 'some_cost', url: 'price'}]			
			,	aliased_url = '/colour/red'
			,	unaliased_url = router.unaliasUrl(aliased_url, corrections);			

			expect(_.isEqual(unaliased_url, 'color/red')).toBe(true);
		});

		it('#4: unaliasUrl method should unalias an aliased URL (Two facet alias)', function() {

			var corrections = [{usedAlias: 'colour', url: 'color'}, {usedAlias: 'some_cost', url: 'price'}]
			,	aliased_url = '/colour/red/some_cost/10'
			,	unaliased_url = router.unaliasUrl(aliased_url, corrections);			

			expect(_.isEqual(unaliased_url, 'color/red/price/10')).toBe(true);
		});

		it('#5: unaliasUrl method should unalias an aliased URL (One facet alias - left)', function() {

			var corrections = [{usedAlias: 'colour', url: 'color'}, {usedAlias: 'some_cost', url: 'price'}]
			,	aliased_url = '/colour/red/some_cost/10'
			,	unaliased_url = router.unaliasUrl(aliased_url, corrections);			

			expect(_.isEqual(unaliased_url, 'color/red/price/10')).toBe(true);
		});

		it('#6: unaliasUrl method should unalias an aliased URL (One facet alias - right)', function() {

			var corrections = [{usedAlias: 'colour', url: 'color'}, {usedAlias: 'some_cost', url: 'price'}]
			,	aliased_url = '/color/red/some_cost/10'
			,	unaliased_url = router.unaliasUrl(aliased_url, corrections);

			expect(_.isEqual(unaliased_url, 'color/red/price/10')).toBe(true);
		});

		it('#6: unaliasUrl method should unalias an aliased URL (Two facet alias - one unexistent))', function() {

			var corrections = [{usedAlias: 'colour', url: 'color'}, {usedAlias: 'some_cost', url: 'price'}]
			,	aliased_url = '/color/red/unexistent_alias/10'
			,	unaliased_url = router.unaliasUrl(aliased_url, corrections);

			expect(_.isEqual(unaliased_url, 'color/red/unexistent_alias/10')).toBe(true);
		});

		it('#7: unaliasUrl method should unalias an aliased URL (Two facet alias - two unexistent))', function() {

			var corrections = [{usedAlias: 'colour', url: 'color'}, {usedAlias: 'some_cost', url: 'price'}]
			,	aliased_url = '/unexistent_alias_1/red/unexistent_alias_2/10'
			,	unaliased_url = router.unaliasUrl(aliased_url, corrections);

			expect(_.isEqual(unaliased_url, 'unexistent_alias_1/red/unexistent_alias_2/10')).toBe(true);
		});

		it('#7: unaliasUrl method should unalias an aliased URL (URL with options))', function() {

			var corrections = [{usedAlias: 'colour', url: 'color'}, {usedAlias: 'some_cost', url: 'price'}]
			,	aliased_url = '/colour/red/price/10?quantity=1&custcol1=1'
			,	unaliased_url = router.unaliasUrl(aliased_url, corrections);

			expect(_.isEqual(unaliased_url, 'color/red/price/10?quantity=1&custcol1=1')).toBe(true);
		});

		it('#8: unaliasUrl method should throw if an aliased URL is absolute', function() {

			var corrections = [{usedAlias: 'colour', url: 'color'}, {usedAlias: 'some_cost', url: 'price'}]
			,	aliased_url = 'https://www.site.com/colour/red';

			expect(function() { router.unaliasUrl(aliased_url, corrections); }).toThrow();
		});
	});
});