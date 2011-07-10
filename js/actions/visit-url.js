Bindr.namespace('Bindr.Mapping.Visit_Url');

Bindr.Mapping.Visit_Url.prototype = new Bindr.Mapping();
Bindr.Mapping.Visit_Url = function ()
{
	Bindr.Mapping.apply( this, arguments );
	var self = this;
	this.action = function (args)
	{
		url = self.config.data.replace(/%args%/, args.join(''));
		window.location.href = url;
	};
}
