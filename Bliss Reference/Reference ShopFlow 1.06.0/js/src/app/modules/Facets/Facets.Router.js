/* global nsglobal */
// Facets.Router.js
// ----------------
// Mixes the Translator, Model and View
define('Facets.Router', ['Facets.Views', 'Facets.Helper', 'Facets.Model', 'Categories'], function (Views, Helper, Model, Categories)
{
	'use strict';
	
	return Backbone.Router.extend({
		
		initialize: function (application)
		{
			this.application = application;
			this.translatorConfig = application.translatorConfig;
		}
	
	,	getFacetsAliasesMapping: function (corrections)
		{
			var facets_aliases_mapping = {};

			_.each(corrections, function(correction) 
			{
				facets_aliases_mapping[correction.usedAlias] = correction.url;
			});

			return facets_aliases_mapping;
		}

	,	unaliasUrl: function (aliased_url, corrections)
		{
			if (aliased_url.indexOf('http://') === 0 || aliased_url.indexOf('https://') === 0)
			{
				throw new Error('URL must be relative');
			}

			aliased_url = (aliased_url[0] === '/') ? aliased_url.substr(1) : aliased_url;

			var facet_delimiters = this.translatorConfig.facetDelimiters
			,	facets_n_options = aliased_url.split(facet_delimiters.betweenFacetsAndOptions)
			,	facets = (facets_n_options[0] && facets_n_options[0] !== this.translatorConfig.fallbackUrl) ? facets_n_options[0] : ''
			,	options = facets_n_options[1] || ''
			,	facet_tokens = facets.split(new RegExp('[\\'+ facet_delimiters.betweenDifferentFacets +'\\'+ facet_delimiters.betweenFacetNameAndValue +']+', 'ig'))
			,	translated_facets = ''
			,	facets_aliases_mapping = this.getFacetsAliasesMapping(corrections);

			while (facet_tokens.length > 0)
			{
				var facet_name = facet_tokens.shift()
				,	facet_value = facet_tokens.shift();

				if (facets_aliases_mapping[facet_name])
				{
					translated_facets += facets_aliases_mapping[facet_name] + facet_delimiters.betweenFacetNameAndValue + facet_value;
				}
				else
				{
					translated_facets += facet_name + facet_delimiters.betweenFacetNameAndValue + facet_value;
				}

				if (facet_tokens.length > 0)
				{
					translated_facets += facet_delimiters.betweenDifferentFacets;
				}			
			}

			var unaliased_url = translated_facets;
			
			if (options)
			{
				unaliased_url += facet_delimiters.betweenFacetsAndOptions + options;
			}

			return unaliased_url;
		}

		// router.facetLoading
		// This handles all the routes of the item list
	,	facetLoading: function ()
		{
			// If the previouse view was a Views.Browse (Item List) we 
			// re render the facets so links gets upated (For the nervous clicker)
			var current_view = this.application.getLayout().currentView;
			
			if (current_view instanceof Views.Browse)
			{
				current_view.renderFacets(Backbone.history.fragment); // calls parse url
			}
			
			// Creates a translator
			var translator = Helper.parseUrl(Backbone.history.fragment, this.translatorConfig)
			,	url = Backbone.history.fragment;

			// Should we show the category Page?
			if (this.isCategoryPage(translator))
			{
				return this.showCategoryPage(translator);
			}

			// Model
			var model = new Model()
			// and View
			,	view = new Views.Browse({
					translator: translator
				,	translatorConfig: this.translatorConfig
				,	application: this.application
				,	model: model
				})
			,	self = this;
			
			model.fetch({
				data: translator.getApiParams()
			,	killerId: this.application.killerId
			,	pageGeneratorPreload: true }).then(function (data) {

				if (data.corrections && data.corrections.length > 0)
				{
					var unaliased_url = self.unaliasUrl(url, data.corrections);

					if (SC.ENVIRONMENT.jsEnvironment === 'server')
					{			
						nsglobal.statusCode = 301;
						nsglobal.location = '/' + unaliased_url;
					}
					else
					{
						Backbone.history.navigate('#' + unaliased_url, {trigger: true});
					}
				}
				else
				{
					translator.setLabelsFromFacets(model.get('facets') || []);
					view.showContent();
				}
			});		
		}

		// router.¡sCategoryPage
		// Returs true if this is the top category page, 
		// override it if your implementation difers from this behavior 
	,	isCategoryPage: function(translator)
		{
			var current_facets = translator.getAllFacets()
			,	categories = Categories.getBranchLineFromPath(translator.getFacetValue('category'));

			return (current_facets.length === 1 && current_facets[0].id === 'category' && categories.length === 1 && _.size(categories[0].categories));
		}

	,	showCategoryPage: function(translator)
		{
			var view = new Views.BrowseCategories({
				translator: translator
			,	translatorConfig: this.translatorConfig
			,	application: this.application
			});
			
			view.showContent();
		}
	});
});
