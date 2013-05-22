(function( $ ){

  $.fn.ML_Paint = function( options ) {  
    console.log(options);
    var settings = $.extend( {
      width: 500,
      height : 600
    }, options);

    console.log(this);

  };
})( jQuery );