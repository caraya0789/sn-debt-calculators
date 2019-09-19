(function($) {

	"use strict";

	var Embed = {

		$btn 	: $('.js-generate-code'),
		$type 	: $('.js-calc-type'),
		$iframe	: $('#calc_Selected'),
		$code 	: $('.js-embed-code'),
		$title 	: $('.js-calc-title'),

		init : function() {
			Embed.$btn.on('click', Embed.generateCode);
			Embed.$type.on('change', Embed.updatePreview);
		},

		generateCode : function() {
			Embed.$iframe.attr('src', Embed.getURL);
			Embed.getCode();
			return false;
		},

		getCode : function() {
			Embed.$code.val('<iframe src="'+Embed.getURL()+'" width="100%" height="1040" frameborder="0" scrolling="yes" style="padding:0px;"></iframe>');
		},

		updatePreview : function() {
			Embed.$title.val($('option:selected', Embed.$type).text());
			Embed.$iframe.attr('src', Embed.getURL);
			Embed.getCode();
			return false;
		},

		getURL : function() {
			var url = 'http://' + window.location.hostname + '/embed/calculators?';
			url = url + 'type=' + Embed.$type.val();
			url = url + '&title=' + Embed.$title.val();
			return encodeURI(url);
		}
	};

	$( Embed.init );

})(window.jQuery);