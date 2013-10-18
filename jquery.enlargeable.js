/*
 * Jquery Enlargeable plugin - v0.6 - https://github.com/popallo/enlargeable
 * Creation => 16-10-2013
 * Update => 17-10-2013
 * © 2013, Aurélien Dazy, Licensed MIT (https://github.com/popallo/enlargeable/blob/master/LICENSE)
 * 
 * DEPENDS : jquery >= 1.10.x, jquery ui >= 1.10.x (optional)
 * 
 * HOW TO : $(element).enlargeable({option:value});
 * 
 * HTML EXAMPLE 1 :
 * 	<div class="enlargeable">
 * 		<table>
 * 
 * HTML EXAMPLE 2 :
 * 	<div class="enlargeablePrison">
 * 		<div class="enlargeable">
 * 			<table>
 * 
 * TODO add callbacks
 * TODO make enlargeable fullscreenable... ^^
 * TODO make the plugin more flexible
 * TODO more and more and more ...
 *
 */
(function ( $ ) {
    var Enlargeable = function( options ) {
    	var $settings = $.extend({}, Enlargeable.settings, options);
        this.each(function(){
        	var $element = $(this); //the enlargeable element
	    	var $elementWidth = $element.width(); //element's width
			var $elementHasMaxHeight = $element.css('max-height').length;
			var $parentWidth = '';
        	/* in case of "tooltip" option is true, test if jquery ui is in da place ! */
	        if($settings.tooltip && !$.ui){
	        	throw new Error('jquery.enlargeable requires jQuery ui 1.10.x OR make "tooltip" option to FALSE');
	        }
	        /* make the enlarge button */
	        $element.parent().prepend('<div class="enlargeBT" title="Agrandir le tableau"></div>');
	        if($settings.tooltip)
				$('.enlargeBT').tooltip({position: { my: "center bottom-20", at: "right top" }, content: $settings.enlargeMsg });
			$('.enlargeBT',$element.parent()).on('click',function(){
				var $this = $(this);
				var $parents = $this.parents('.enlargeablePrison');
				/* enlarge bt action */
				if(!$this.hasClass('reduce')){
					var $tooltipMsg=$settings.reduceMsg;
					$parents.each(function(){
						$parentWidth = $parents.width();
						$(this).animate({width:$settings.enlargeWidth+'px'},$settings.speed);
					});
					$element.animate({height:'100%', width:($settings.enlargeWidth)+'px'},$settings.speed);
					if($elementHasMaxHeight>0){ //verify if element has a define max-height
						$elementMaxHeight=$element.css('max-height');
						$element.css('max-height','100%');
					}
					
				/* reduce bt action */
				}else{
					var $tooltipMsg=$settings.enlargeMsg;
					$parents.each(function(){
						$(this).animate({width:$parentWidth+'px'},$settings.speed);
					});
					$element.animate({width:$elementWidth+'px'},$settings.speed);
					if($elementHasMaxHeight>0){ //verify if element has a define max-height
						$element.css('max-height',$elementMaxHeight);
					}
					
					
				}
				$this.toggleClass('reduce');
				if($settings.tooltip)
					$this.tooltip({position: { my: "center bottom-20", at: "right top" }, content: $tooltipMsg });
			});
		});
    };
    
    Enlargeable.settings = {
		tooltip:false,
		enlargeWidth:'958', //target width
		enlargeMsg:'',
		reduceMsg:'',
		speed:'500'
    };
    
    /* jQuery aliases */
	$.fn.enlargeable = Enlargeable;
}( $ ));
