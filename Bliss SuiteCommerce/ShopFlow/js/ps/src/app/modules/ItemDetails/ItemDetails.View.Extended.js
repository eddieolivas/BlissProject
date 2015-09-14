define('ItemDetails.View.Extended', ['ItemDetails.View', 'ItemDetails.Model'], function (View, Model)
{
	'use strict';

	_.extend(View.prototype, {

	 	checkTemplate: function () 
		{
			var facets = (this.model.attributes && this.model.attributes.facets)? this.model.attributes.facets : []
			,	category = _.where(facets, {id: "category"})
			,	parent_category = (category.length > 0)? category[0].values[0] : undefined
			,	specialCategories = /(get-the-look)/i
			,	first_level_id;

			if (parent_category && parent_category.values.length > 0) {
				first_level_id = parent_category.values[0].id;

				if (specialCategories.test(first_level_id)) {
					console.log('change the template');
					this.template = "product_details_special";
				} else {
					console.log('keep the old template');
				}
			}
			// Find first level category
			if (category.length > 0) {
				category = category[0];



/*
				var categories = category.values,
					current_category;

				for (var i = 0; i < categories.length; i++)
				{
					current_category = categories[i];


				}*/
			}
		}

	});

});
