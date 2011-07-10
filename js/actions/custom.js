Bindr.namespace('Bindr.Mapping.Custom');

Bindr.Mapping.Custom.prototype = new Bindr.Mapping();
Bindr.Mapping.Custom = function ()
{
	Bindr.Mapping.apply( this, arguments );
	var self = this;
	this.action = function (args)
	{

		var code = self.config.data;
		code = code.replace(/%args%/, args.join(''));
		eval(code);
	};
}
