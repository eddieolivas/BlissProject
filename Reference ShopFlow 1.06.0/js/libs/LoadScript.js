/* Define a function to load scripts at runtime, in the given order. Supports the SEO engine and older browsers. The script can be removed of the generated html by the server seo, please see Starter.js. */ 
(function(){
	var pendingScripts = []
	,	firstScriptTag = !SC.isPageGenerator() && document.getElementsByTagName('script')[0];//document.scripts[0] gives an ugly error in SEO ENGINE and is not used on it.

	window.loadScript = function loadScript(scripts) 
	{
		var src
		,	script;

		var typeof_scripts = typeof scripts;
		scripts = (typeof_scripts === 'string' || (typeof_scripts === 'object' && !scripts.length)) ? [scripts] : scripts;

		// loop through our script urls
		if (!SC.isCrossOrigin()) 
		{
			while (src = scripts.shift()) 
			{
				src = (typeof src === 'string') ? {url: src} : src; 

				// This is the SEO Engine case and very old browsers
				if (SC.isPageGenerator()) 
				{
					script = document.createElement('script');
					script.src = src.url;
					script.type = 'text/javascript';
					var seo_remove_element = document.createElement('div');
					seo_remove_element.className = 'seo-remove';
					seo_remove_element.appendChild(script);
					document.write(seo_remove_element.outerHTML);
				}
				// CASE 1: test for the ASYNC property on browsers
				else if ('async' in firstScriptTag) 
				{
					script = document.createElement('script');
					script.async = !!src.async; //Should manage both async and sync
					script.src = src.url;
					script.type = 'text/javascript';
					firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
				}
				//CASE 2: Test for the readystate. IE<10
				else if (firstScriptTag.readyState) 
				{
					// create a script and add it to our todo pile
					script = document.createElement('script');
					script.type = 'text/javascript';
					script.async = !!src.async;
					//IF script is not meant to load 100% async
					if (!src.async) 
					{
						// listen for state changes
						pendingScripts.push(script);
						// must set src AFTER adding onreadystatechange listener
						script.onreadystatechange = function() 
						{
							// Watch scripts load in IE
							// Execute as many scripts in order as we can
							var pendingScript;
							while (pendingScripts[0] && pendingScripts[0].readyState == 'loaded') 
							{
								pendingScript = pendingScripts.shift();
								// avoid future loading events from this script (eg, if src changes)
								pendingScript.onreadystatechange = null;
								// can't just appendChild, old IE bug if element isn't closed
								firstScriptTag.parentNode.insertBefore(pendingScript, firstScriptTag);
							}
						};
						// else we’ll miss the loaded event for cached scripts
					}
					script.src = src.url;
					if (src.async) 
					{
						//ASYNC IE, append now
						firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
					}
				}
				else 
				{
					//Fallback browser
					if (src.async) 
					{
						script = document.createElement('script');
						script.src = src.url;
						script.type = 'text/javascript';
						firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
					} 
					else 
					{
						document.write('<script src="' + src.url + '" defer></' + 'script>');
					}
				}
			}
		}
	}
})(); 