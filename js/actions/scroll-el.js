Bindr.namespace('Bindr.Mapping.Scroll_El');

Bindr.Mapping.Scroll_El.prototype = new Bindr.Mapping();
Bindr.Mapping.Scroll_El = function ()
{
	Bindr.Mapping.apply( this, arguments );
	var self = this;
	self.elcounter = 0;
	this.action = function (args)
	{
		if (args.length) self.elcounter += parseInt(args.join(''), 10);
		window.scrollTo(0, jQuery(jQuery.trim(self.config.data)).eq(self.elcounter++).prop('offsetTop'));
	};
}
