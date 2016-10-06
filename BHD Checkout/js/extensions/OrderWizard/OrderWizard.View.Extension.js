/*
 ***********************************************************************
 *
 * The following JavaScript code is created by ERP Guru,
 * a NetSuite Partner. It is a SuiteFlex component containing custom code
 * intented for NetSuite (www.netsuite.com) and use the SuiteScript API.
 * The code is provided "as is": ERP Guru shall not be liable
 * for any damages arising out the intended use or if the code is modified
 * after delivery.
 *
 * Company:		ERP Guru inc., www.erpguru.com
 * Author:		adam.carruthers@erpguru.com
 * Date:		Thu Jul 04 2014 10:04:20 GMT-0400 (EDT)
 * File:		OrderWizard.View.Extension.js
 ***********************************************************************/

define('OrderWizard.View.Extension', ['OrderWizard.View'], function (OrderWizardView) {
	'use strict';

	return OrderWizardView.extend({
		updateCartSummary: function() {
			var current_step = this.wizard.getCurrentStep()
			,	was_confirmation = this.wizard.model.previous('confirmation');

			/* Fix for shipping method change error (WR7575) */
			var shipping_methods = this.wizard.model.get('shipmethods');
			var order_delivery_method = this.wizard.model.get('shipmethod');

			/* If the ship method is not in the list of available ship methods... */
			if (!_.contains(_.pluck(shipping_methods.models, 'id'), order_delivery_method)) {
				/* ...change the order_delivery_method to the first available shipping method and update the model. */
				order_delivery_method = _.first(shipping_methods.models).get('internalid');
				this.wizard.model.set('shipmethod', order_delivery_method);
				this.wizard.model.save();
			}
			/* End WR7575 */

			if (!current_step.hideSummary && !was_confirmation) {
				this.$('#order-summary').empty().html(
					SC.macros.checkoutCartSummary({
						cart: this.wizard.model
					,	application: this.options.application
					,	stepPosition: this.wizard.getStepPosition()
					,	continueButtonLabel: current_step.changedContinueButtonLabel || current_step.continueButtonLabel || _('Place Order').translate()
					,	hideItems: current_step.hideSummaryItems
					})
				);				
			}
			
			this.$('[data-toggle="tooltip"]').tooltip({html: true});
		}
	});
});

(function (Checkout) {
	if (Checkout.Configuration.modules) {
		Checkout.Configuration.modules.push('OrderWizard.View.Extension');
	}
}(SC.Application('Checkout')));