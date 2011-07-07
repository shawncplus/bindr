/*
 * Debug code for now until I load these from an actual database
 *
var bindr_leader = 92, bindr_seq_start = false, bindr_key_args = [];
var bindr_keys = [
new Bindr_Mapping({
	key : 'G',
	sites : ['.*'],
	type : 'scroll',
	data : {
		count : 10
	}
}),
new Bindr_Mapping({
	key : 'N',
	sites : ['.*'],
	type : 'custom',
	data : 'alert(\'Im going to \' + \'%args%\');'
})
];
/*
 * End debug code
 */

var bindr_leader = 92, bindr_seq_start = false, bindr_key_args = [], bindr_keys = [];

// respond to an popup events
chrome.extension.onRequest.addListener(function (request, sender, sendResponse)
{
	if (request.load === 'get')
	{
		return sendResponse(bindr_keys);
	}

	if (request.add === 'success')
	{
		window.close();
		Bindr.showPress("Your keybinding has been added. Refreshing window...", 2000);
		setTimeout(function () { window.location.href = window.location.href; }, 2000);
	}
});


// load and set keybindings
chrome.extension.sendRequest({load: 'mappings'}, function(response) {
	response = eval(response);
	if (!response.length)
	{
		Bindr.showWarning('Couldn\'t load mappings... sorry.');
		return false;
	}



	// create Bindr_Mappings from the response
	for (var i in response)
	{
		if (typeof response[i] === 'function') continue;
		var map = response[i];
		bindr_keys.push(new Bindr_Mapping(map));
	}

	$(document).keypress(function(e) {
		var keycode = e.keyCode, bindr_key = {};
		if (keycode < 48) return; // Ignore anything after 0
		// Set flag to start reading the key sequence
		if (!bindr_seq_start && keycode === bindr_leader)
		{
			Bindr.showPress(String.fromCharCode(bindr_leader));
			return bindr_seq_start = true;
		}
		else if (bindr_seq_start)
		{
			if (keycode === bindr_leader) return;
			// fetch the correct action for the command
			if (bindr_key = Bindr.findKeyAction(keycode, bindr_keys, window.location.href))
			{
				Bindr.showPress(String.fromCharCode(bindr_leader) + bindr_key_args.join('') + bindr_key.getKey());
				bindr_key.action(bindr_key_args, e);
				bindr_seq_start = false;
				bindr_key_args = [];
			}
			// numeric arguments to the command
			else if (!isNaN(parseInt(String.fromCharCode(keycode), 10)))
			{
				bindr_key_args.push(String.fromCharCode(keycode));
				Bindr.showPress(String.fromCharCode(bindr_leader) + bindr_key_args.join(''));
			}
			// bad/cancelled command
			else
			{
				Bindr.showWarning(String.fromCharCode(bindr_leader) + String.fromCharCode(keycode), 1);
				bindr_seq_start = false;
				bindr_key_args = [];
			}
		}
	});
});
