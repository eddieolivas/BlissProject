define(['ImageLoader', 'TestHelper', 'Application'],function (ImageLoader, TestHelper)
{
	'use strict';

	var helper = new TestHelper({
		applicationName: 'ImageLoaderTest1'
	,	simpleLayout: true
	});
	ImageLoader.mountToApp(helper.application); 

	describe('ImageLoader', function ()
	{
		it('on click all images should be loaded', function ()
		{			
			SC.templates.ImageLoaderTest0_tmpl = '<p>somecontent<img src="foo.png"></img></p>';
			var view = new Backbone.View({
				application: helper.application
			});
			view.template = 'ImageLoaderTest0';
			view.render(); 

			expect(view.$('img').data('src')).toBe('foo.png');
			expect(view.$('img').attr('src')).not.toBeDefined();

			expect(view.$('img').attr('style').indexOf('min-height:'+ImageLoader.default_height+'px')>=0).toBe(true); 
			expect(view.$('img').attr('style').indexOf('min-width:'+ImageLoader.default_height+'px')>=0).toBe(true); 

			expect(view.$('img').data('image-status')).toBe('pending'); 

			view.$el.appendTo('body'); 

			view.$el.click();

			expect(view.$('img').attr('src')).toBe('foo.png');

			expect(view.$('img').data('image-status')).toBe('done'); 
			
		});

		it('should preserve other attributes', function ()
		{
			SC.templates.ImageLoaderTest1_tmpl = '<p>somecontent<img data-attr1="foo" src="data.png" data-attr2="bar"></img></p>';
			var view = new Backbone.View({
				application: helper.application
			});
			view.template = 'ImageLoaderTest1';
			view.render(); 

			expect(view.$('img').data('src')).toBe('data.png');
			expect(view.$('img').attr('src')).not.toBeDefined();
			expect(view.$('img').data('attr1')).toBe('foo'); 
			expect(view.$('img').data('attr2')).toBe('bar');
		});

		it('should detect urls with param resizeh to size the initial image', function ()
		{
			SC.templates.ImageLoaderTest2_tmpl = '<p>somecontent<img data-attr1="foo" src="pepe.png?resizeh=412" data-attr2="bar"></img></p>';
			var view = new Backbone.View({
				application: helper.application
			});
			view.template = 'ImageLoaderTest2';
			view.render(); 
			view.$el.appendTo('body'); 

			expect(view.$('img').data('src')).toBe('pepe.png?resizeh=412');
			expect(view.$('img').attr('src')).not.toBeDefined();

			view.$el.click();

			expect(view.$('img').attr('src')).toBe('pepe.png?resizeh=412');
			expect(view.$('img').attr('style').indexOf('min-width:412px')>=0).toBe(true); 

		});

		it('should not modify images marked with attr data-loader="false"', function ()
		{
			SC.templates.ImageLoaderTest3_tmpl = '<p>somecontent<img data-loader="false" src="pepe.png"></img></p>';
			var view = new Backbone.View({
				application: helper.application
			});
			view.template = 'ImageLoaderTest3';
			view.render(); 

			expect(view.$('img').data('src')).not.toBeDefined();
			expect(view.$('img').attr('src')).toBe('pepe.png');
		});

		it('rectangleIntercept', function ()
		{
			expect(ImageLoader.rectangleIntercept({top:10,bottom:50,left:10,right:50},{top:10,bottom:50,left:10,right:50})).toBe(true); 
			expect(ImageLoader.rectangleIntercept({top:50,bottom:90,left:10,right:50},{top:10,bottom:50,left:10,right:50})).toBe(true); 
			expect(ImageLoader.rectangleIntercept({top:51,bottom:90,left:10,right:50},{top:10,bottom:50,left:10,right:50})).toBe(false);			
			expect(ImageLoader.rectangleIntercept({top:50,bottom:90,left:51,right:80},{top:10,bottom:50,left:10,right:50})).toBe(false);
		});

		it('fixImagesForLoader', function ()
		{
			var result = ImageLoader.fixImagesForLoader('<img src="foo.jpg"></img>'); 
			expect(result.indexOf('data-image-status="pending"') !== -1).toBe(true); 
			expect(result.indexOf('data-src="foo.jpg"') !== -1).toBe(true); 
		});

		
		
	});
});
