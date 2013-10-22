/*
 * Jquery Enlargeable plugin - https://github.com/popallo/enlargeable
 * Creation => 16-10-2013
 * Update => 17-10-2013
 * © 2013, Licensed MIT (https://github.com/popallo/enlargeable/blob/master/LICENSE)
 * @author popallo
 * @version 0.9
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
 * TODO add more callbacks
 * TODO make enlargeable fullscreenable... ^^
 * TODO make enlargeable skinnable... ^^
 * TODO make it works for "enlarge" or "reduce" size first 
 * TODO make the plugin more flexible
 * TODO more and more and more ...
 *
 */
;(function ( $ ) {
	'use strict';
    var Enlargeable = function( options ) {
    	var $self = this;
        return this.each(function(){
        	var $oSettings = $.extend({}, Enlargeable.settings, options),
				$element = $(this),
        		$enlargeBT = $('<div/>').addClass('enlargeBT').attr('title',''),
        		$tooltipTitle=$oSettings.enlargeTitle;
        	/* set options */
        	$oSettings.fnInit($oSettings);
        	/* in case of "tooltip" option is true, test if jquery ui is in da place ! */
	        if($oSettings.tooltip && !$.ui){
	        	throw new Error('jquery.enlargeable requires jQuery ui 1.10.x OR make "tooltip" option to FALSE');
	        }
	        /* make the enlarge button */
	        $element.parent().prepend($enlargeBT);
	        /* tooltip init if "tooltip" option is true */
	        $oSettings.tooltip?$('.enlargeBT').tooltip({position: { my: "center bottom-20", at: "right top" }, content: $tooltipTitle }):'';
	        /* click */
			$('.enlargeBT',$element.parent()).on('click',function(){
				var $bt = $(this),
					$element = $bt.next();
				/* after click callback */
				$oSettings.fnAfterClick($oSettings);
				/* enlarge bt action */
				if(!$element.hasClass('reduce')){
					$self.originalSize = Enlargeable.enlarge($oSettings, $element);
					$tooltipTitle=$oSettings.reduceTitle;
				/* reduce bt action */
				}else{
					Enlargeable.reduce($oSettings, $self.originalSize);
					$tooltipTitle=$oSettings.enlargeTitle;
				}
				$element.toggleClass('reduce'); //add or remove .reduce class
				$oSettings.tooltip?$bt.tooltip({position: { my: "center bottom-20", at: "right top" }, content: $tooltipTitle }):'';
			});
		});
    };
    
    Enlargeable.settings = {
		tooltip:false,
		enlargeWidth:'958', //target width
		enlargeTitle:'',
		reduceTitle:'',
		speed:'500',
		fnInit: function($oSettings){},
		fnAfterClick: function($oSettings){},
		fnEnlarge: function($oSettings){},
		fnReduce: function($oSettings){}
    };
    /*
     * Function enlarge
     * 
     */
    Enlargeable.enlarge = function($oSettings, $element) {
		var $oElement = { //the enlargeable element
			element:$element,
			width:$element.width(),
			height:$element.height()
		},
		$elementMaxHeight = $element.css('max-height').length, //useful if element has a max-height defined
		$parents = $element.parents('.enlargeablePrison'),
		$aParents = [],
		$o = {};
		$parents.each(function(){
			var $this = $(this);
			$aParents.push({
				element:$this,
				width:$this.width(),
				height:$this.height()
			});
			$this.animate({width:$oSettings.enlargeWidth+'px',height:'100%'},$oSettings.speed);
		});
		$element.animate({height:'100%', width:($oSettings.enlargeWidth)+'px'},$oSettings.speed, function(){
			$oSettings.fnEnlarge($oSettings);
		});
		if($elementMaxHeight>0){
			$element.css('max-height','100%');
		}
		return $o = {
			oElement:$oElement,
			aParents:$aParents
		};
    };
    /*
     * Function reduce
     * 
     */
    Enlargeable.reduce = function($oSettings, $oSize) {
    	var $element = $oSize.oElement.element;
    	$.each($oSize.aParents, function(){
			this.element.animate({width:this.width+'px',height:this.height+'px'},$oSettings.speed);
    	});
		$element.animate({width:$oSize.oElement.width+'px',height:$oSize.oElement.height+'px'},$oSettings.speed, function(){
			$oSettings.fnReduce($oSettings);
		});
    };
    
    /* jQuery aliases */
	$.fn.enlargeable = Enlargeable;
}( $ ));