/**
 * Bindr util object
 */
var Bindr = {
	/**
	 * Display the command box (mimics Vim's 'showcmd')
	 * @param {string} sequence Current sequence string
	 */
	showPress : function (sequence)
	{
		if (jQuery('#bindr_showpress').empty())
		{
			var div = document.createElement('div');
			div.id = 'bindr_showpress';
			jQuery('body').append(div);
			jQuery(div).css('position', 'fixed')
			  .css('bottom', '0')
			  .css('right',  '0')
			  .css('background-color', '#000')
			  .css('opacity', '0.4')
			  .css('width', '100px')
			  .css('height', '20px')
			  .css('font-family', 'monospace')
			  .css('font-size', '16px')
			  .css('text-align', 'center')
			  .css('padding', '3px')
			  .css('color', 'white')
			  .css('display', 'none');
		
		}

		jQuery('#bindr_showpress').html(sequence).show().fadeOut('slow');
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
			for (var j in bindr_key.sites)
			{
				if (typeof bindr_key.sites[j] === 'function') continue;
				var regex = new RegExp('^' + bindr_key.sites[j].replace('/', '\\/') + '$');
				if (!regex.test(site)) return false;
			}
			if (bindr_key.getKeyCode() === keycode) return bindr_key;
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
		key : null,  // Actual char of key pressed e.g., 'G'
		sites : [],  // Array of regexs for sites it should work on
		type : null, // Type of action
		data : {}    // Data for the action (changes based on type)
	};

	/**
	 * Shortcut method to execute an action based on the type
	 * @param {array} args  Current argument to the command e.g., \20G, the args are [2,0]
	 * @param {Event} event DOM Event for the keypress
	 */
	self.action = function (args, event)
	{
		self['exec_' + self.config.type](args);
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
	 * @return {int} Keycode for this mapping's key
	 */
	self.getKeyCode  = function () { return self.config.key.charCodeAt(); }

	/**
	 * @return {string} Char of mapping's key
	 */
	self.getKey      = function () { return self.config.key; }

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
