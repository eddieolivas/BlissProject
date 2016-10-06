/*!
* Description: SuiteCommerce Reference ShopFlow
*
* @copyright (c) 2000-2013, NetSuite Inc.
* @version 1.0
*/

// Application.js
// --------------
// Extends the application with Shopping specific core methods

/*global _:true, SC:true, jQuery:true, Backbone:true*/

(function (Shopping)
{
	'use strict';

	// Get the layout from the application
	var Layout = Shopping.getLayout();

	// This will change the url when a "select" DOM element
	// of the type "navigator" is changed
	_.extend(Layout, {

		changeUrl: function (e)
		{
			// Disable other navigation links before redirection
            this.$('select[data-type="navigator"], .pagination-links a').attr('disabled','disabled');
            
            // Get the value of the select and navigate to it
			// http://backbonejs.org/#Router-navigate
			Backbone.history.navigate(this.$(e.target).val(), {trigger: true});
		}
		
	});

	_.extend(Layout.events, {
		'change select[data-type="navigator"]': 'changeUrl'
	});

	// Wraps the SC.Utils.resizeImage and passes in the settings it needs
	_.extend(Shopping, {

		resizeImage: function (url, size)
		{
			var mapped_size = Shopping.getConfig('imageSizeMapping.' + size, size);
			return SC.Utils.resizeImage(Shopping.getConfig('siteSettings.imagesizes', []), url, mapped_size);
		}	
	});

	// This is necessary for showing Cases menu option in header_profile_macro menu. Cases should only be available in My Account application.
	// By doing so, we are avoiding copying the entire module to ShopFlow but we preserve the same logic. We need to check if backend 
	// configuration is present and if the feature is enabled, keeping the same behavior My Account currently has.
	_.extend(Shopping, {
		
		CaseModule: {
			
			// Is Case functionality available for this application?
			isEnabled: function () 
			{
				return !_.isUndefined(SC.ENVIRONMENT.CASES) && !_.isUndefined(SC.ENVIRONMENT.CASES.CONFIG) && SC.ENVIRONMENT.CASES.enabled;
			}
		}
	});

	// Setup global cache for this application
	jQuery.ajaxSetup({cache:true});

	jQuery.ajaxPrefilter(function(options)
	{
		if (options.url)
		{
			if (options.type === 'GET' && options.data)
			{
				var join_string = ~options.url.indexOf('?') ? '&' : '?';
				options.url = options.url + join_string + options.data;
				options.data = '';
			}

			options.url = SC.Utils.reorderUrlParams(options.url);
		}

		if (options.pageGeneratorPreload && SC.ENVIRONMENT.jsEnvironment === 'server')
		{
			jQuery('<img />', { src: options.url }).prependTo('head').hide();
		}
	});

	//It triggers main nav collapse when any navigation occurs
	Backbone.history.on('all', function()
	{
		jQuery('.main-nav.in').collapse('hide');
	});


})(SC.Application('Shopping'));
