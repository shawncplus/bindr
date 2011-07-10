Bindr.namespace('Bindr.Mapping.Click');

Bindr.Mapping.Click.prototype = new Bindr.Mapping();
Bindr.Mapping.Click = function ()
{
	Bindr.Mapping.apply( this, arguments );
	var self = this;

	this.action = function (args)
	{
		var selector = self.config.data.replace(/%args%/, args.join(''));
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, false);
		var node = document.querySelector(selector);
		if (node) node.dispatchEvent(evt);
		else Bindr.showWarning('No element found for selector "' + selector + '"', 1000);
	};
}
