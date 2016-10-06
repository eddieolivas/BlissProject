// PromoCodeSupport.js
// -------------------
// rewrite touchpoints when set promocode.
define('PromocodeSupport', ['UrlHelper'], function (UrlHelper)
{
	'use strict';

	return {
		mountToApp: function (application)
		{
			// Method defined in file UrlHelper.js
			UrlHelper.addTokenListener('promocode', function (value)
			{
				// Because this is passed from the URL and there might be spaces and special chars,
				// we need to fix this so it does not invalidate our promocode
				if(value)
				{
					value = unescape(value.replaceAll('+',' '));
				}

				// We get the instance of the ShoppingCart and apply the promocode
				// See method "update" of model Cart in file Models.js (ssp library file)
				application.getCart().save({promocode: {code: value}});

				return false;
			});
		}
	};

});
