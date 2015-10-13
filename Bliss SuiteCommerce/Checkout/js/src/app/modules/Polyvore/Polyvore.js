	define('Polyvore', function ()
	{
		var Polyvore = {

			// Based on the created SalesOrder we trigger each of the analytics
			// ecommerce methods passing the required information
			// [Ecommerce Tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce)
			trackTransaction: function (order)
			{
				if (order && order.get('confirmation'))
				{
                                        var transaction_id = order.get('confirmation').confirmationnumber
					,	order_summary = order.get('summary')
					,	item = null
					,   items = [];
                                        
                                        order.get('lines').each(function (line)
					{
						item = line.get('item');
                                                items.push(item.get('_sku'));
					});


					//var url = 'https://www.polyvore.com/conversion/beacon.gif?adv=blisshomeanddesign.com&amt=' + order_summary.subtotal + '&oid=' + transaction_id + '&skus=' + items.toString() + '&cur=usd';
                   
                    jQuery('<img width="1" height="1" src="https://www.polyvore.com/conversion/beacon.gif?adv=blisshomeanddesign.com&amt=' + order_summary.subtotal + '&oid=' + transaction_id + '&skus=' + items.toString() + '&cur=usd" />').appendTo(this.getLayout().currentView.$el);                   
				}
			}

		,	mountToApp: function (application)
			{
				var tracking = application.getConfig('tracking.polyvore');
				// Required tracking attributes to generate the pixel url
				if (tracking && tracking.id)
				{
					application.trackers && application.trackers.push(Polyvore);
				}	
			}
		};

		return Polyvore;
	});
