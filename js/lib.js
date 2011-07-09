/**
 * Bindr util object
 */
var Bindr = {
	/**
	 * Display the command box (mimics Vim's 'showcmd')
	 * @param {string} sequence Current sequence string
	 */
	showPress : function (sequence, time)
	{
		if (!jQuery('#bindr_showpress').length)
		{
			var div = document.createElement('div');
			div.id = 'bindr_showpress';
			jQuery('body').append(div);
			jQuery(div).css('position', 'fixed')
			  .css('bottom', '0')
			  .css('right',  '0')
			  .css('background-color', '#000')
			  .css('opacity', '0.4')
			  .css('width', 'auto')
			  .css('min-width', '100px')
			  .css('height', '20px')
			  .css('font-family', 'monospace')
			  .css('font-size', '16px')
			  .css('text-align', 'center')
			  .css('padding', '3px')
			  .css('color', 'white')
			  .css('display', 'none');
		
		}

		jQuery('#bindr_showpress').html(sequence).show();
		setTimeout(function() { jQuery('#bindr_showpress').fadeOut('slow') }, time || 1000);
	},

	showWarning : function (message, time)
	{
		if (!jQuery('#bindr_showwarn').length)
		{
			var div = document.createElement('div');
			div.id = 'bindr_showwarn';
			jQuery('body').append(div);
			jQuery(div).css('position', 'fixed')
			  .css('bottom', '0')
			  .css('right',  '0')
			  .css('background-color', '#A22')
			  .css('width', 'auto')
			  .css('min-width', '100px')
			  .css('height', '20px')
			  .css('font-family', 'monospace')
			  .css('font-size', '16px')
			  .css('text-align', 'center')
			  .css('padding', '3px')
			  .css('color', 'white')
			  .css('border', '2px solid #F00')
			  .css('display', 'none');
		
		}

		jQuery('#bindr_showwarn').html(message).show();
		setTimeout(function() { jQuery('#bindr_showwarn').fadeOut('slow') }, time || 5000);
	},

	/**
	 * Get a mapping based on a keypress
	 * @param {int}    keycode Keycode of command
	 * @param {array}  keys    Array of all the mappings
	 * @param {string} site    Current page's url
	 * @return Bindr_Mapping|false
	 */
	findKeyAction : function (keycode, keys, site)
	{
		for (var i in keys)
		{
			var bindr_key = keys[i];
			if (typeof bindr_key === 'function') continue;
			var sites = bindr_key.getSites();
			for (var j in sites)
			{
				if (typeof sites[j] === 'function') continue;

				var regex = new RegExp('^' + sites[j] + '$');

				if (regex.test(site) && bindr_key.getKeyCode() === keycode)
					return bindr_key;
			}
		}

		return false;
	}
};

/**
 * An action mapping for Bindr
 */
var Bindr_Mapping = function (config) {
	var self = this;

	/**
	 * general config
	 * @param {object}
	 */
	self.config = {
		bind  : null,  // Actual char of key pressed e.g., 'G'
		sites : [],  // Array of regexs for sites it should work on
		type  : null, // Type of action
		data  : {}    // Data for the action (changes based on type)
	};

	/**
	 * Shortcut method to execute an action based on the type
	 * @param {array} args  Current argument to the command e.g., \20G, the args are [2,0]
	 * @param {Event} event DOM Event for the keypress
	 */
	self.action = function (args, event)
	{
		self['exec_' + self.config.type.replace(/-/g, '_')](args);
	};

	/**
	 * Scroll type handler
	 * @param {array} args Command arguments (scroll pixel count)
	 */
	self.exec_scroll = function (args)
	{
		window.scrollBy(0, self.config.data.count || 20);
	};

	/**
	 * 'Custom' type handler
	 * @param {array} args Command arguments (scroll pixel count)
	 */
	self.exec_custom = function (args)
	{
		var code = self.config.data;
		code = code.replace(/%args%/, args.join(''));
		eval(code);
	};

	/**
	 * Scroll by selector type handler
	 * @param {array} args Command arguments (Nth item)
	 */
	self.exec_scroll_el = function (args)
	{
		if (args.length) self.elcounter += parseInt(args.join(''), 10);
		window.scrollTo(0, jQuery(jQuery.trim(self.config.data)).eq(self.elcounter++).prop('offsetTop'));
	};


	/**
	 * Go to a url, passing the command arg
	 * @param {array} args Command arguments
	 */
	self.exec_visit_url = function (args)
	{
		url = self.config.data.replace(/%args%/, args.join(''));
		window.location.href = url;
	};

	/**
	 * @return {int} Keycode for this mapping's key
	 */
	self.getKeyCode  = function () { return self.config.bind.charCodeAt(); }

	/**
	 * @return {string} Char of mapping's key
	 */
	self.getKey      = function () { return self.config.bind; }

	/**
	 * @return {array} array of sites which this binding is active
	 */
	self.getSites    = function () { return self.config.sites; }

	/**
	 * Initialize and apply the config
	 */
	self.__construct = function (config)
	{
		for (var i in config)
		{
			if (typeof self.config[i] !== 'undefined')
			{
				self.config[i] = config[i];
			}
		}
	};

	self.__construct(config);
};
