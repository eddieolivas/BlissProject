define('Home', function ()
{
	'use strict';

	var View = Backbone.View.extend({

		template: 'home'

	,	title: _('Welcome to the store').translate()

	,	page_header: _('Welcome to the store').translate()

	,	attributes: {
			'id': 'home-page'
		,	'class': 'home-page'
		}

	,	events:
		{
			'click .carousel .carousel-control': 'carouselSlide'
		}

	,	initialize: function (options)
		{
			var application = options.application;
			this.config = application.getConfig('homePage');
		}

	,	carouselSlide: function (e)
		{
			var direction = this.$(e.target).data('slide');
			this.$('.carousel').carousel(direction);
		}

	});

	var Router = Backbone.Router.extend({

		routes: {
			'': 'homePage'
		,	'?*params': 'homePage'
		}

	,	initialize: function (Application)
		{
			this.application = Application;
		}

	,	homePage: function ()
		{
			var view = new View({
				application: this.application
			});

			view.showContent();
		}
	});

	return {
		View: View
	,	Router: Router
	,	mountToApp: function (Application)
		{
			return new Router(Application);
		}
	};
});
