/*
 * Jquery Enlargeable plugin - https://github.com/popallo/enlargeable
 * Creation => 16-10-2013
 * Update => 23-10-2013
 * © 2013, Licensed MIT (https://github.com/popallo/enlargeable/blob/master/LICENSE)
 * @author popallo
 * @version 0.9.4
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
 * 	<div class="enlargeJail">
 * 		<div class="enlargeable">
 * 			<table>
 * 
 * TODO make enlargeable fullscreenable... ^^
 * TODO make enlargeable skinnable... ^^
 * TODO make the plugin more flexible
 *
 */
;(function ( $ ) {
	'use strict';
	var Enlargeable = function( $options ) {
    	var $self = this;
		return this.each(function(){
        	var $oSettings = $.extend({}, Enlargeable.settings, $options),
				$element = $(this),
        		$enlargeBT = $('<div/>').addClass('enlargeBT').attr('title','');
        	/* set options */
        	$oSettings.fnInit($oSettings);
        	/* in case of "tooltip" option is true, test if jquery ui is in da place ! */
			if($oSettings.tooltip && !$.ui){
	        	throw new Error('jquery.enlargeable requires jQuery ui 1.10.x OR make "tooltip" option to FALSE');
			}
			/* make the enlarge/reduce button */
			$element.parent().prepend($enlargeBT);
			/* tooltip init if "tooltip" option is true */
			$oSettings.tooltip?$enlargeBT.tooltip({position: { my: "center bottom-20", at: "right top" }, content: $oSettings.enlargeTitle }):'';
			/* start "enlarge" ? */
			if($oSettings.start=='enlarge'){
				$oSettings.tooltip?$enlargeBT.tooltip({position: { my: "center bottom-20", at: "right top" }, content: $oSettings.reduceTitle }):'';
        		$enlargeBT.addClass('reduce');
        		$self.originalSize = Enlargeable.enlarge($oSettings, $element);
        	}
			/* click */
			$($enlargeBT,$element.parent()).on('click',function(){
				Enlargeable.click($oSettings, $enlargeBT, $element, $self);
			});
		});
    };
    /* default settings */
	Enlargeable.settings = {
    	start:'reduce',							//how enlargeable element start ? (enlarge or reduce)
		tooltip:false,							//jquery ui tooltip ? (true or false)
		targetWidth:'958px',					//target width (px, %, ..)
		targetHeight:'100%',					//target height (px, %, ..)
		enlargeTitle:'Enlarge',					//tooltip title for enlarge action
		reduceTitle:'Reduce',					//tooltip title for reduce action
		speed:'500',							//animation speed (ms)
		effect:'swing',							//easing effect (look at easing's doc)
		fnInit: function(settings){},			//init callback
		fnEnlargeClick: function(settings){},	//enlarge click callback
		fnReduceClick: function(settings){},	//reduce click callback
		fnEnlarge: function(settings){},		//after enlarge callback
		fnReduce: function(settings){}			//after reduce callback
	};
	/*
	 * Function click
	 * 
	 * @param {object}        $oSettings, enlargeable settings object
	 * @param {jquery object} $enlargeBT, the enlargeable button
	 * @param {jquery object} $element, the enlargeable element
	 * @param {jquery object} $element, enlargeable object
	 * 
	 */
	Enlargeable.click = function($oSettings, $enlargeBT, $element, $self){
		var $activeClick = true,
			$tipTitle;
		/* flood click protection ^^ */
		if(!$activeClick){return;}
		$activeClick = false;
		/* enlarge action */
		if(!$enlargeBT.hasClass('reduce')){
			/* enlarge click callback */
			$oSettings.fnEnlargeClick($oSettings);
			/* enlarge function */
			$self.originalSize = Enlargeable.enlarge($oSettings, $element);
			/* redefine tooltip title -> return elements with their original sizes */
			$tipTitle=$oSettings.reduceTitle;
		}else{ //reduce action
			/* reduce click callback */
			$oSettings.fnReduceClick($oSettings);
			/* reduce function */
			Enlargeable.reduce($oSettings, $self.originalSize);
			/* redefine tooltip title */
			$tipTitle=$oSettings.enlargeTitle;
		}
		/* add or remove "reduce" class to the enlarge button */
		$enlargeBT.toggleClass('reduce'); //add or remove .reduce class
		/* set tooltip title */
		$oSettings.tooltip?$enlargeBT.tooltip({position: { my: "center bottom-20", at: "right top" }, content: $tipTitle }):'';
		/* "reactive" click when timeout = speed option */
		setTimeout(function() {$activeClick = true;}, $oSettings.speed);
	};
    /*
     * Function enlarge
     * 
	 * @param {object}        $oSettings, enlargeable settings object
	 * @param {jquery object} $element, the enlargeable element
	 * 
	 */
    Enlargeable.enlarge = function($oSettings, $element) {
		var $oElement = {
				element:$element,
				width:$element.width(),
				height:$element.height()
			},
			$elementMaxHeight = $element.css('max-height').length, //useful if element has a max-height defined
			$parents = $element.parents('.enlargeJail'),
			$aParents = [],
			$o = {};
		$parents.each(function(){
			var $parent = $(this);
			$aParents.push({
				element:$parent,
				width:$parent.width(),
				height:$parent.height()
			});
			$parent.animate({width:$oSettings.targetWidth,height:$oSettings.targetHeight},$oSettings.speed,$oSettings.effect);
		});
		$element.animate({width:$oSettings.targetWidth,height:$oSettings.targetHeight},$oSettings.speed,$oSettings.effect,function(){
			$oSettings.fnEnlarge($oSettings);
		});
		if($elementMaxHeight>0){
			$element.css('max-height',$oSettings.targetHeight);
		}
		return $o = {
			oElement:$oElement,
			aParents:$aParents
		};
    };
    /*
	 * Function reduce
	 * 
	 * @param {object}    $oSettings, enlargeable settings object
	 * @param {object}    $oSize, enlargeable element and enlargeJail elements originals sizes
	 * 
	 */
    Enlargeable.reduce = function($oSettings, $oSize) {
    	var $element = $oSize.oElement.element;
    	$.each($oSize.aParents, function(){
			this.element.animate({width:this.width+'px',height:this.height+'px'},$oSettings.speed,$oSettings.effect);
    	});
		$element.animate({width:$oSize.oElement.width+'px',height:$oSize.oElement.height+'px'},$oSettings.speed,$oSettings.effect, function(){
			$oSettings.fnReduce($oSettings);
		});
    };
	/*
	 * Function Debug
	 * 
	 */
	Enlargeable.debug = function($msg){
		if(window.console && window.console.log) 
			console.log( "[debug] " + $msg ); 
	};
	/* jQuery aliases */
	$.fn.enlargeable = Enlargeable;
}( $ ));
