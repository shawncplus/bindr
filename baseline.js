/*
 * Debug code for now until I load these from an actual database
 */
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
		// fetch the correct action for the command
		if (bindr_key = Bindr.findKeyAction(keycode, bindr_keys, window.location.href))
		{
			Bindr.showPress(String.fromCharCode(bindr_leader) + bindr_key_args.join('') + bindr_key.getKey());
			bindr_key.action(bindr_key_args, e);
			bindr_seq_start = false;
			bindr_key_args = [];
		}
		// numeric arguments to the command
		else if (parseInt(String.fromCharCode(keycode), 10) !== NaN)
		{
			bindr_key_args.push(String.fromCharCode(keycode));
			Bindr.showPress(String.fromCharCode(bindr_leader) + bindr_key_args.join(''));
		}
		// bad/cancelled command
		else
		{
			bindr_seq_start = false;
			bindr_key_args = [];
		}
	}
});
