Bindr.namespace('Bindr.Mapping.Scroll');

Bindr.Mapping.Scroll.prototype = new Bindr.Mapping();
Bindr.Mapping.Scroll = function ()
{
	Bindr.Mapping.apply( this, arguments );
	var self = this;
	
	this.action = function (args)
	{
		window.scrollBy(0, self.config.data.count || 20);
	};
}
