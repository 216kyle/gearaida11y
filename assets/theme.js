window.REBASE = window.REBASE || {};
REBASE.theme = {};

(function ($) {

  /*
	* ----------------------------------------
	* Main script
	* ----------------------------------------
	*/
  $(function () {

    // Initiate Lazy Loading
    var myLazyLoad = new LazyLoad({
      elements_selector: ".lazy",
      class_loading: "lazyloading",
      class_loaded: "lazyloaded"
    });

    // Initiate CSS animations
    AOS.init();

    // Setting Up Global Variables to be used in JS - Denotes which template is which so JavaScript is used only on proper templates
    var BODY                  = $('body'),
        IS_INDEX              = (BODY.hasClass('index-template')) ? true : false,
        IS_COLLECTION         = (BODY.hasClass('collection-template')) ? true : false,
        IS_COLLECTION_LISTING = (BODY.hasClass('list-collections-template')) ? true : false,
        IS_PRODUCT            = (BODY.hasClass('product-template')) ? true : false,
        IS_BLOG               = (BODY.hasClass('blog-template')) ? true : false,
        IS_ARTICLE            = (BODY.hasClass('article-template')) ? true : false,
        IS_SEARCH             = (BODY.hasClass('search-template')) ? true : false,
        IS_PAGE               = (BODY.hasClass('page-template')) ? true : false,
        IS_CART               = (BODY.hasClass('cart-template')) ? true : false,
        HAS_PRODUCTS          = ($('.product').length > 0) ? true : false;


    if (HAS_PRODUCTS) {
      function preloadImg(src) {
        $('<img/>')[0].src = src;
      }

      // collection swatches
      $('.product').hover(function () {
        $('.product-swatch').each(function (){
          preloadImg($(this).data('variant-image'));
        });
      });

      // collection product swatches image swap
      $('.product-swatch').on('click', function () {
        var featured_image = '#product__image--' + $(this).data('prod-id'),
            variant_image = $(this).data('variant-image'),
            default_image = $(featured_image).data('default-image'),
            default_image_srcset = $(this).data('variant-image-srcset'),
            variant_link = $(this).data('variant-url');

        if ($(this).hasClass('product-swatch--selected')){
          $(this).removeClass('product-swatch--selected');
        } else {
          $(this).addClass('product-swatch--selected').siblings().removeClass('product-swatch--selected');
        }

        var parentContainerElement = $(this).closest('.product__contents');
        var titleLink = parentContainerElement.find('.product__title a, .product__image-wrapper');
        
        $(featured_image).attr('src', variant_image).attr('srcset', default_image_srcset);
        parentContainerElement.attr('href', variant_link);
        titleLink.attr('href', variant_link);
      });
    }

    // Mobile Navigation
    var mmStatus = 'closed';
    function closeMM(){
      mmStatus = 'closed';
      $('#mobile-navigation-toggle').toggleClass('opened');
      $('html, body').removeClass('nav-opened');
    }
    function openMM(){
      mmStatus = 'opened';
      $('html, body').addClass('nav-opened');
      $('#mobile-navigation-toggle').toggleClass('opened');
    }

    $('#mobile-navigation-toggle').on('click', function (){
      if (mmStatus == 'closed'){
        openMM();
      } else if (mmStatus == 'opened') {
        closeMM();
      }
      return false;
    });

    $('.mobile-dropdown-toggle').on('click', function (){
      $(this).toggleClass('fa-plus fa-times');
      $(this).next().toggle();
    });

    // main navigation
    function toggleDD(){
      $(this).toggleClass('hovered');
      $('.sub-navigation-wrapper', this).toggleClass('sub-navigation-wrapper--shown');
    };

    var $nav = $('.site-navigation');
    var hoverConfig = {
      over: toggleDD,
      timeout: 250,
      interval: 50,
      out: toggleDD
    };

    $nav.find('li.has-sub-navigation').each(function (){
      $(this).hoverIntent(hoverConfig);
    });


    function handleScroll () {

      if ($(this).scrollTop() >= $('#shopify-section-header').height()) {
          $('.blog-page-sidebar').addClass('fixed');
      } else {
          $('.blog-page-sidebar').removeClass('fixed');
      }
      // Distance from top of document to top of footer.
      var topOfFooter = $('.site-content').length ? $('.site-content').position().top + $('.site-content').height() : 0;
      // Distance user has scrolled from top, adjusted to take in height of sidebar (570 pixels inc. padding).
      var scrollDistanceFromTopOfDoc = $(this).scrollTop() + $('.blog-page-sidebar').outerHeight() || 0;
      // Difference between the two.
      var scrollDistanceFromTopOfFooter = scrollDistanceFromTopOfDoc - topOfFooter;


      // If user has scrolled further than footer
      if (scrollDistanceFromTopOfDoc > topOfFooter) {
        $('.blog-page-sidebar').addClass('fixed-bottom');
      } else  {
        $('.blog-page-sidebar').removeClass('fixed-bottom');
      }
    }

    
    /* blog sidebar sticky */
    if ($('.blog-page-sidebar').length) {
      $(window).scroll($.throttle(100, handleScroll));

      handleScroll(); // NOTE: if page is refreshed in middle, needs to check sidebar on load!
    }
    


    /* sidebar nav toggle */

    $('.page-sidebar__section > h3').on('click', function(){
      var $this = $(this),
          parent = $this.closest('.page-sidebar__section'),
          toggle = $this.find('.toggle');
      if(parent.hasClass('active')) {
        parent.removeClass('active');
        toggle.html('+');
      } else {
        $('.page-sidebar__section').removeClass('active');
        $('.page-sidebar__section .toggle').html('+');
        parent.addClass('active');
        toggle.html('-');
      }
    });

    /* more videos toggle */
    $('.video-view-all-link').on('click', function(e) {
      var $this = $(this),
          parent = $this.closest('.video-view-all'),
          toggle = parent.siblings('.video-view-all-section');

      e.preventDefault();
      //console.log($this, $this.html);
      toggle.toggleClass('show');
      if ($this.html() == 'View All') {
        $this.html('View Less');
      } else {
        $this.html('View All');
      }
    });

    //Privacy Pop Up
    var popUpSeen = localStorage.getItem('popUpSeen');
    if (popUpSeen == null) {
      $('#privacy-pop-up').show();
    }
    $('#privacy-close').on('click', function () {
      $('#privacy-pop-up').hide();
      localStorage.setItem('popUpSeen', 1);
    });

    $('a[href^="#"]').on('click', function(e) {
      e.preventDefault();
      var target_id = $(this).attr('href');
      if (target_id != '#') {
        $('html, body').animate({ scrollTop: $(target_id).offset().top }, 500);
      }
    });

    // =================================
    //  Product Page - Quantity buttons, Tabs, Reviews, Image Gallery, Options Selects, Swatches
    // =================================
    if (IS_PRODUCT) {
      REBASE.theme.bindProductControls();
    }

  });


  /*
	* ----------------------------------------
	* Setup Product page controls (needs to run on product pages and when quickview is opened)
	* ----------------------------------------
	*/
  REBASE.theme.unbindProductControls = function () {
    $('#product-qty-input, #product-rating, #product-content-sections-nav, .image-gallery__thumbnail-wrapper').off('.rbProduct');
  };

  REBASE.theme.bindProductControls = function () {
    var product,
        is_video = $('#product-video-player').length > 0,
        photo_gallery,
        setActiveThumbnail = function (target) {
          var THUMB_ACTIVE_CLASS = 'image-gallery__thumbnail-wrapper--active';

          if (!target.hasClass(THUMB_ACTIVE_CLASS)) {
            target.addClass(THUMB_ACTIVE_CLASS).siblings().removeClass(THUMB_ACTIVE_CLASS);
          }
        };

    // Quantity buttons
    $('.qtyplus, .qtyminus').show();
    $('#product-qty-input').on('click.rbProduct', '.qtyplus, .qtyminus', function (e) {
      var quantity_input =  $('#quantity'),
          quant_val = parseInt(quantity_input.val());

      e.preventDefault();

      if ($(e.target).hasClass('qtyplus')) {
        if (!quant_val) { quant_val = 0; }
        quant_val += 1;
      } else {
        if (!quant_val) { quant_val = 1; }
        if (quant_val > 1) { quant_val -= 1; }
      }

      quantity_input.val(quant_val).trigger('change');
    });

    // Product Reviews
    $('#product-rating').on('click.rbProduct', function () {
      $('.product-content-sections-tab--reviews').trigger('click');
      $('html, body').animate({
        scrollTop: $('#product-reviews').offset().top - 90 // TODO - why 90?
      }, 500);
    });

    // Product Tabs
    $('#product-content-sections-nav').on('click.rbProduct', '.product-content-sections-tab, .product-content-section-title', function (e) {
      var ACTIVE_TAB_CLASS = 'product-content-sections-tab--active',
          ACTIVE_SECTION_CLASS = 'product-content-section--active',
          selected_tab_id = $(e.target).data('tab-id'),
          selected_section = $(selected_tab_id);

      // Remove existing active classes
      $('.' + ACTIVE_TAB_CLASS).removeClass(ACTIVE_TAB_CLASS);
      $('.' + ACTIVE_SECTION_CLASS).removeClass(ACTIVE_SECTION_CLASS);

      // Select new tab & section
      $('.product-content-sections-tab[data-tab-id="' + selected_tab_id + '"]').addClass(ACTIVE_TAB_CLASS);
      selected_section.addClass(ACTIVE_SECTION_CLASS);

      // Update font-awesome icons
      $('#product-content-sections .fa').removeClass('fa-minus').addClass('fa-plus');
      selected_section.prev().find('.fa').removeClass('fa-plus').addClass('fa-minus');

      // Mobile scroll
      if ($(window).width() < 417) { // TODO - why 417?
        $('html, body').animate({scrollTop: selected_section.offset().top - 53}, 500); // TODO - why 53?
      }
    });

    // Image Galleries
    if ($('.swiper-pagination').length) {

      photo_gallery = new Swiper('.image-gallery', {
        loop: false,
        effect: 'slide',
        speed: 300,
        spaceBetween: 1,
        preloadImages: false,
        lazyLoading: true,
        lazyLoadingInPrevNext: true,
        lazyLoadingOnTransitionStart: true,
        pagination: '.image-gallery .swiper-pagination',
        paginationClickable: true,
        nextButton: '.image-gallery .swiper-button-next',
        prevButton: '.image-gallery .swiper-button-prev',
        onSlideChangeStart: function () {
          var active_slide = $('.image-gallery .swiper-slide-active'),
              thumb_id = active_slide.data('main-image-id');

          setActiveThumbnail($('.image-gallery__thumbnail-wrapper[data-image-id="' + thumb_id + '"]'));

          if (is_video) {
            if (active_slide.hasClass('swiper-slide--video')) {
             player.playVideo();
            } else {
              player.pauseVideo();
            }
          }
        }
      });


      $('.image-gallery__thumbnail-wrapper').on('click.rbProduct', function (e) {
        var target = $(e.target),
            img_indx;

        e.preventDefault();

        if (target.hasClass('image-gallery__thumbnail')) {
          target = target.parent('.image-gallery__thumbnail-wrapper');
        }

        setActiveThumbnail(target);
        img_indx = $('.image-gallery').find('figure[data-main-image-id="' + target.data('image-id') + '"]').index();
        photo_gallery.slideTo(img_indx);
      });

      $('.image-gallery__thumbnails').imagesLoaded(function () {
        $('.image-gallery__thumbnails').addClass('image-gallery__thumbnails--loaded');
      });
    }


    // Option Selectors & Swatches
    // NOTE: must come after image gallery (for selected variant to show correct image when loading page)
    product = new REBASE.theme.Product({
      $container: $('#add-item-form')
    });
  };


  /*
	* ----------------------------------------
	* Product class
	* ----------------------------------------
	*/
  REBASE.theme.Product = (function () {
    function Product (options) {
      var inputs,
          input_type;

      this.variants = null;
      this.$container = options.$container;
      this.data = JSON.parse(document.getElementById('product__json').innerHTML);

      this.settings = {
        single_option_selector: '.single-option-select',
        original_select_id: 'select#product-select'
      };


      if (this.data) {
        this._initVariants();

        // Trigger change to sync up images, etc on initial page load
        inputs = $(this.settings.single_option_selector, this.$container);
        input_type = inputs.first().attr('type');

        if (input_type === 'radio' || input_type === 'checkbox') {
          inputs.filter(':checked:first').trigger('change');
        } else {
          inputs.first().trigger('change');
        }
      } else {
        if (console) { console.log('Missing product json data!'); }
      }
    }

    Product.prototype = $.extend({}, Product.prototype, {

      _initVariants: function () {
        var options = {
          $container: this.$container,
          enable_history_state: true,
          single_option_selector: this.settings.single_option_selector,
          original_select_id: this.settings.original_select_id,
          product: this.data
        };

        this.variants = new REBASE.theme.Variants(options);

        this.$container.on('variantChange', this._updateAddToCart.bind(this));
        this.$container.on('variantImageChange', this._updateImages.bind(this));
        this.$container.on('variantPriceChange', this._updatePrice.bind(this));
        this.$container.on('variantSKUChange', this._updateSKU.bind(this));
      },

      _updateAddToCart: function (e) {
        var variant = e.variant,
            target = $(e.target),
            input_type = target.attr('type'),
            add_to_cart_btn = $('#add-to-cart'),
            btn_txt = $('#add-to-cart-text');

        if (!variant) {
          add_to_cart_btn.addClass('disabled').attr('disabled', 'disabled');
          btn_txt.text('Not Available');
          $('.product-pricing .product-price').html('<span>Not Available</span>');
          $('.product-old-price').hide();
          $('.product-pricing .old-price').empty();
        } else {

          if (variant.available) {
            add_to_cart_btn.removeClass('disabled').removeAttr('disabled');
            btn_txt.text('Add To Cart');
          } else {
            add_to_cart_btn.addClass('disabled').attr('disabled', 'disabled');
            btn_txt.text('Sold Out');
          }
        }

        if (input_type === 'radio' || input_type === 'checkbox') {
          target.parent('.swatch-element').addClass('selected-swatch').siblings().removeClass('selected-swatch');
        }
      },
      _updateImages: function (e) {
        var variant = e.variant,
            selected_thumb = $('.image-gallery__thumbnail-wrapper[data-image-id="' + variant.featured_image.id + '"]');

        if (selected_thumb.length && !selected_thumb.hasClass('image-gallery__thumbnail-wrapper--active')) {
          selected_thumb.trigger('click');
        }
      },
      _updatePrice: function (e) {
        var variant = e.variant,
            main_price = $('.product-pricing .product-price'),
            old_price_wrapper = $('.product-old-price'),
            old_price = $('.product-pricing .old-price'),
            discount_type = main_price.data('discount-type'),
            discount_percentage = parseFloat(main_price.data('discount-percentage')) || 1,
            compare_price = variant.compare_at_price;

        if (discount_type === 'PRO') {
            main_price.html(Shopify.formatMoney(variant.price * discount_percentage, Shopify.money_format).replace('.00',''));
            old_price.html(Shopify.formatMoney(variant.price, Shopify.money_format).replace('.00',''));
            old_price_wrapper.show();
        } else {
        	main_price.html(Shopify.formatMoney(variant.price, Shopify.money_format).replace('.00',''));

            if (compare_price && compare_price > variant.price) {
              old_price.html(Shopify.formatMoney(compare_price, Shopify.money_format).replace('.00',''));
              old_price_wrapper.show();
            } else {
              old_price_wrapper.hide();
              old_price.empty();
            }
        }
      },
      _updateSKU: function (e) {
        $('#product-sku .product-meta-item-content').text(e.variant.sku);
      }
    });

    return Product;
  })();


  /*
	* ----------------------------------------
	* Product Variants class - based on Shopify debut
	* ----------------------------------------
	*/
  REBASE.theme.Variants = (function () {

    function Variants (options) {
      this.$container = options.$container;
      this.product = options.product;
      this.single_option_selector = options.single_option_selector;
      this.original_select_id = options.original_select_id;
      this.enable_history_state = options.enable_history_state;
      this.current_variant = {};

      $(this.single_option_selector, this.$container).on('change', this._onSelectChange.bind(this));
    }

    Variants.prototype = $.extend({}, Variants.prototype, {

      /**
			* Get the currently selected options from add-to-cart form. Works with all
			* form input elements.
			*
			* @return {array} options - Values of currently selected variants
			*/
      _getCurrentOptions: function () {
        var should_filter = false,
            the_options  = $.map($(this.single_option_selector, this.$container), function (element) {
              var $element = $(element),
                  type = $element.attr('type'),
                  current_option = {};


              if (type === 'radio' || type === 'checkbox') {
                should_filter = true;

                if ($element[0].checked) {
                  current_option.value = $element.val();
                  current_option.index = $element.data('index');
                  return current_option;
                } else {
                  return false;
                }
              } else {
                current_option.value = $element.val();
                current_option.index = $element.data('index');
                return current_option;
              }
            });

        // Remove any unchecked input values if using radio buttons or checkboxes
        // Removes all falsy values (Boolean constructor is a function, if the value is omitted or is 0, -0, null, false, NaN, undefined, or the empty string ("") then it will get removed)
        if (should_filter) {
          the_options = the_options.filter(Boolean);
        }

        return the_options;
      },

      /**
			* Find variant based on selected values.
			*
			* @param  {array} selected_values - Values of variant inputs
			* @return {object || undefined} found - Variant object from product.variants
			*/
      _getVariantFromOptions: function () {
        var selected_values = this._getCurrentOptions(),
            variants = this.product.variants,
            found;

        found = $.grep(variants, function (variant) {
          return selected_values.every(function (values) {
            return variant[values.index] === values.value;
          });
        });

        if (found.length) {
          found = found[0];
        } else {
          found = undefined;
        }

        return found;
      },

      /**
			* Event handler for when a variant input changes.
			*/
      _onSelectChange: function (e) {

        var variant = this._getVariantFromOptions();

        this.$container.trigger({
          type: 'variantChange',
          variant: variant,
          target: e.target
        });

        if (!variant) {
          this.current_variant = {};
          return;
        }

        this._updateMasterSelect(variant);
        this._updateImages(variant);
        this._updatePrice(variant);
        this._updateSKU(variant);
        this.current_variant = variant;

        if (this.enable_history_state) {
          this._updateHistoryState(variant);
        }
      },

      /**
			* Trigger event when variant image changes
			*
			* @param  {object} variant - Currently selected variant
			* @return {event}  variantImageChange
			*/
      _updateImages: function (variant) {
        var variant_image = variant.featured_image || {},
            current_variant_image = this.current_variant.featured_image || {};

        if (!variant.featured_image || variant_image.src === current_variant_image.src) {
          return;
        }

        this.$container.trigger({
          type: 'variantImageChange',
          variant: variant
        });
      },

      /**
			* Trigger event when variant price changes.
			*
			* @param  {object} variant - Currently selected variant
			* @return {event} variantPriceChange
			*/
      _updatePrice: function (variant) {

        if (variant.price === this.current_variant.price && variant.compare_at_price === this.current_variant.compare_at_price) {
          return;
        }

        this.$container.trigger({
          type: 'variantPriceChange',
          variant: variant
        });
      },

      /**
			* Trigger event when variant sku changes.
			*
			* @param  {object} variant - Currently selected variant
			* @return {event} variantSKUChange
			*/
      _updateSKU: function (variant) {
        if (variant.sku === this.current_variant.sku) {
          return;
        }

        this.$container.trigger({
          type: 'variantSKUChange',
          variant: variant
        });
      },

      /**
			* Update history state for product deeplinking
			*
			* @param  {variant} variant - Currently selected variant
			* @return {k}         [description]
			*/
      _updateHistoryState: function (variant) {
        if (!history.replaceState || !variant) {
          return;
        }

        var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
        window.history.replaceState({path: newurl}, '', newurl);
      },

      /**
			* Update hidden master select of variant change
			*
			* @param  {variant} variant - Currently selected variant
			*/
      _updateMasterSelect: function (variant) {
        $(this.original_select_id, this.$container).val(variant.id);
      }
    });

    return Variants;
  })();

})(jQuery);
