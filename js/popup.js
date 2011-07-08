var showWarning = function (message)
{
	jQuery('#warnings').html(message).show();
	setTimeout(function () { jQuery('#warnings').fadeOut(2000); }, 3000);
};

jQuery(document).ready(function ()
{
	chrome.tabs.getSelected(null,function(tab) {
		jQuery('#sites').val(tab.url);
	});

	jQuery('#bindr_key_display').keypress(function (e)
	{
		jQuery(this).attr('disabled', true);
		jQuery('#bindr_key').val(String.fromCharCode(e.keyCode));
		jQuery(this).val(String.fromCharCode(e.keyCode));
	});

	jQuery('#assign_key').click(function ()
	{
		jQuery('#bindr_key_display').attr('disabled', false).focus();
	});

	jQuery('#typeopt').change(function (e)
	{
		if (/[\w\-]+/.test(e.target.value))
		{
			jQuery('#container *[id^=typecontainer-]').hide();
			jQuery('#typecontainer-' + e.target.value).show().focus();
		}
		else return false;
	});

	jQuery('#scroll-data').keypress(function (e)
	{
		if (isNaN(parseInt(String.fromCharCode(e.keyCode), 10))) return false;
	});

	jQuery('#addform').submit(function ()
	{
		var values = {
			bind  : jQuery('#bindr_key').val(),
			sites : jQuery.trim(jQuery('#sites').val()).split(/[\r\n]/),
			type  : jQuery('#typeopt').val()
		};


		if (!values.bind)
		{
			showWarning('You didn\'t specify a key to bind. Sorry, telepathy isn\'t an option.');
			return false;
		}

		if (!values.sites[0] || !values.sites.length)
		{
			showWarning('So... it\'s just not gonna work anywhere? *points to the "sites" field*');
			return false;
		}

		if (!(/\w+/.test(values.type)))
		{
			showWarning('You must select a type');
			return false;
		}


		values.data = jQuery('#' + values.type + '-data').val();

		if (!values.data)
		{
			showWarning('You have to elaborate on the action for your ' + values.type + ' action.');
			return false;
		}

		chrome.extension.sendRequest({load : 'addMapping', data : values}, function (response)
		{
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(tab.id, {add: "success"}, function(response) {
					window.close();
				});
			});
		});
		return false;
	});

	var renderMappings = function (mappings)
	{
		mappings = mappings ? eval(mappings) : [];
		chrome.tabs.getSelected(null,function(tab) {
			var url = tab.url, site_mappings = [];
			
			for (var i in mappings)
			{
				var mapping = mappings[i];
				if (typeof mapping === 'function') continue;

				var sites = mapping.sites;
				for (var j in sites)
				{
					if (typeof sites[j] === 'function') continue;
					var regex = new RegExp('^' + sites[j].replace(/\//g, '\\/') + '$');
					if (!regex.test(url)) continue;
					else
					{
						site_mappings.push(mapping);
						break;
					}
				}
			}


			// fresh start
			var container = jQuery('#mappings_container');
			container.empty();

			for (var i in site_mappings)
			{
				var mapping = site_mappings[i];
				if (typeof mapping === 'function') continue;

				var div = document.createElement('div');
				jQuery(container).append(div);
				jQuery(div).addClass('map_wrapper');

				var title = document.createElement('div');
				jQuery(div).append(title);
				jQuery(title).addClass('map_title');
				jQuery(title).html(mapping.bind);

				var remove = document.createElement('div');
				jQuery(title).append(remove);
				jQuery(remove).addClass('remove_button').html('Del');

				var data = document.createElement('div');
				jQuery(div).append(data);
				jQuery(data).addClass('map_data');
				jQuery(data).html(mapping.type + ':' + mapping.data);
				jQuery(data).hide();


				(function (el, binding) {
					jQuery(title).click(function()
					{
						jQuery("div.map_data", el).toggle();
					});

					jQuery(remove).click(function()
					{
						showRemoveConfirm(binding);
					});
				})(div, mapping);
			}
		});
	};

	function removeMapping(mapping)
	{
		chrome.extension.sendRequest({load : 'delMapping', data : mapping}, function (response)
		{
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(tab.id, {add: "success"}, function(response) {
					window.close();
				});
			});
		});
	}

	function showRemoveConfirm(mapping)
	{
		jQuery('#mappings_display').hide();
		var deldis = jQuery('#delete_display');

		jQuery('h4', deldis).html('Delete binding (' + mapping.bind + ')?');
		jQuery('#selyes').unbind('click').click(function ()
		{
			removeMapping(mapping);
		});

		jQuery('#selno').unbind('click').click(function ()
		{
			jQuery('#delete_display').hide();
			jQuery('#popup_display').show();
		});

		jQuery('#delete_display').show();

	};

	jQuery('#show_add').click(function ()
	{
		jQuery('#popup_display').hide();
		jQuery('#add_mapping').show();
	});

	jQuery('#show_mappings').click(function ()
	{
		jQuery('#popup_display').hide();
		jQuery('#mappings_display').show();
	});

	jQuery('#back_to_from_add').click(function ()
	{
		jQuery('#add_mapping').hide()
		jQuery('#popup_display').show()
	});

	jQuery('#back_to_from_map').click(function ()
	{
		jQuery('#mappings_display').hide()
		jQuery('#popup_display').show()
	});

	jQuery('#refresh_mappings').click(function ()
	{
		// Force a refresh of the mappings
		chrome.extension.sendRequest({load : 'forceRefresh'}, function (response)
		{
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(tab.id, {add: "success"}, function(response) {
					window.close();
				});
			});
		});

	});

	renderMappings(localStorage.getItem('bindrMappings'));
});
