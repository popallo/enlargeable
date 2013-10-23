/*
 * Jquery Enlargeable plugin - https://github.com/popallo/enlargeable
 * Creation => 16-10-2013
 * Update => 22-10-2013
 * © 2013, Licensed MIT (https://github.com/popallo/enlargeable/blob/master/LICENSE)
 * @author popallo
 * @version 0.9.2
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
        		$tooltipTitle=$oSettings.enlargeTitle,
        		activeClick = true;
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
			$($enlargeBT,$element.parent()).on('click',function(){
				if(!activeClick){ //flood click protection ^^
					return;
				}
				activeClick = false;
				/* enlarge action */
				if(!$enlargeBT.hasClass('reduce')){
					$enlargeBT.toggleClass('enlargeAction');
					/* enlarge click callback */
					$oSettings.fnEnlargeClick($oSettings);
					/* enlarge function */
					$self.originalSize = Enlargeable.enlarge($oSettings, $element);
					/* redefine tooltip title -> return elements with their original sizes */
					$tooltipTitle=$oSettings.reduceTitle;
				/* reduce action */
				}else{
					$enlargeBT.toggleClass('enlargeAction');
					/* reduce click callback */
					$oSettings.fnReduceClick($oSettings);
					/* reduce function */
					Enlargeable.reduce($oSettings, $self.originalSize);
					/* redefine tooltip title */
					$tooltipTitle=$oSettings.enlargeTitle;
				}
				/* add or remove "reduce" class to the enlarge button */
				$enlargeBT.toggleClass('reduce'); //add or remove .reduce class
				/* set tooltip title */
				$oSettings.tooltip?$enlargeBT.tooltip({position: { my: "center bottom-20", at: "right top" }, content: $tooltipTitle }):'';
				/* reactive "click" when timeout = speed option */
				setTimeout(function() {activeClick = true;}, $oSettings.speed);
			});

		});
    };
    
    Enlargeable.settings = {
		tooltip:false,
		targetWidth:'958',						//target width
		enlargeTitle:'',						//tooltip title for enlarge action
		reduceTitle:'',							//tooltip title for reduce action
		speed:'500',							//animation speed
		fnInit: function($oSettings){},			//init callback
		fnEnlargeClick: function($oSettings){},	//enlarge click callback
		fnReduceClick: function($oSettings){},	//reduce click callback
		fnEnlarge: function($oSettings){},		//after enlarge callback
		fnReduce: function($oSettings){}		//after reduce callback
    };
    /*
     * Function enlarge
     * 
     * @param {obj}        $oSettings, enlargeable settings object
     * @param {jquery obj} $element, the enlargeable element
     * 
     */
    Enlargeable.enlarge = function($oSettings, $element) {
		var $oElement = {
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
			$this.animate({width:$oSettings.targetWidth,height:'100%'},$oSettings.speed);
		});
		$element.animate({height:'100%', width:$oSettings.targetWidth},$oSettings.speed, function(){
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
     * @param {obj}    $oSettings, enlargeable settings object
     * @param {obj}    $oSize, enlargeable element and enlargeablePrison elements originals sizes
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
