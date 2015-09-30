// GoogleAdWords.js
// ------------------
// Adds GoogleAdWords tracking pixel on the checkout confirmation page.
define('GoogleAdWords', function ()
{
	'use strict';

	var GoogleAdWords = {

		// Saves the configuration to be later used on the track transaction.
		setAccount: function (config)
		{
			this.config = config;

			return this;
		}

		      // Appends the tracking pixel to the dom, so the request is done.
   ,  trackTransaction: function (Order)
      {
         var config = GoogleAdWords.config,
            value = Order.get('summary').total;
 
         jQuery('<img/>', {
            src: '//www.googleadservices.com/pagead/conversion/' + config.id + '/?value=' + value + '&label=' + config.label + '&guid=ON&script=0'
         }).appendTo(this.getLayout().currentView.$el);
 
         return this;
      }

	,	mountToApp: function (application)
		{
			var tracking = application.getConfig('tracking.googleAdWordsConversion');
			// Required tracking attributes to generate the pixel url
			if (tracking && tracking.id && tracking.label)
			{
				GoogleAdWords.setAccount(tracking);

				application.trackers && application.trackers.push(GoogleAdWords);
			}	
		}
	};
	
	return GoogleAdWords;
});