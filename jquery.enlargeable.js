/*
 * Jquery Enlargeable plugin - v0.6
 * Creation => 16-10-2013
 * Update => 17-10-2013
 * © 2013, Aurélien Dazy, Licensed MIT (https://github.com/popallo/enlargeable/blob/master/LICENSE)
 * 
 * DEPENDS : jquery >= 1.10.x, jquery ui >= 1.10.x (optional)
 * 
 * HOW TO : $(element).enlargeable({imgPath:'img/bt/'});
 * 
 * TODO add callbacks
 * TODO make the plugin more flexible
 * TODO more and more and more ...
 *
 */
(function ( $ ) {
    $.fn.enlargeable = function( options ) {
    	var $element = this; /* the enlargeable element */
    	var $elementWidth = $element.width(); /* element's width */
		var $elementHasMaxHeight = $element.css('max-height').length;
    	var $settings = $.extend({ /* setting options */
    		imgPath:'img/',
    		tooltip:true,
    		enlargeWidth:'958', //target width
    		enlargeMsg:'',
    		reduceMsg:'',
    		speed:'500'
        }, options );
        $element.each(function(){
        	/* in case of "tooltip" option is true, test if jquery ui is in da place ! */
	        if($settings.tooltip && !$.ui){
	        	throw new Error('jquery.enlargeable requires jQuery ui 1.10.x OR make "tooltip" option to FALSE');
	        }
	        /* make the enlarge button */
	        $element.parent().prepend('<p class="enlargeCT" title="Agrandir le tableau"><img class="enlargeBT" src="'+$settings.imgPath+'enlarge.png" /></p>');
	        if($settings.tooltip)
				$('.enlargeBT').tooltip({position: { my: "center bottom-20", at: "right top" }, content: $settings.enlargeMsg });
			$('.enlargeCT').on('click','img',function(){
				var $this = $(this);
				var $parent = $this.closest('div');
				/* enlarge bt action */
				if($this.hasClass('enlargeBT')){
					var $tooltipMsg=$settings.reduceMsg;
					$parentWidth = $parent.width();
					$parent.animate({width:$settings.enlargeWidth+'px'},$settings.speed);
					$element.animate({height:'100%', width:($settings.enlargeWidth)+'px'},$settings.speed);
					if($elementHasMaxHeight>0){ /* verify if element has a define max-height */
						$elementMaxHeight=$element.css('max-height');
						$element.css('max-height','100%');
					}
					$this.attr('src',$settings.imgPath+'reduce.png').removeClass('enlargeBT').addClass('reduceBT');
				/* reduce bt action */
				}else if($this.hasClass('reduceBT')){
					var $tooltipMsg=$settings.enlargeMsg;
					$parent.animate({width:$parentWidth+'px'},$settings.speed);
					$element.animate({width:$elementWidth+'px'},$settings.speed);
					if($elementHasMaxHeight>0){ /* verify if element has a define max-height */
						$element.css('max-height',$elementMaxHeight);
					}
					$this.attr('src',$settings.imgPath+'enlarge.png').removeClass('reduceBT').addClass('enlargeBT');
					
				}
				if($settings.tooltip)
					$this.tooltip({position: { my: "center bottom-20", at: "right top" }, content: $tooltipMsg });
			});
		});
    };
}( $ ));
