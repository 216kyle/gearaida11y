// NOTE: Waiting for DOMContentLoaded event in case defer was used to load a library (like jquery)
document.addEventListener('DOMContentLoaded', function () {
  /* init
	======================================== */
  if (typeof window.jQuery === 'undefined') {
    console.warn('Rebase theme custom auto-lists: jQuery is missing');
  } else {
    window.jQuery(function($){
      var $lp = $('.landing-product');
    
      $lp.on('hover', function () {
          console.log("You just hovered on a product!!!");
      });
    });
  }
});

