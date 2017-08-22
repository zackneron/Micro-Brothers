/*
  Undefined is used here as the undefined global variable in ECMAScript 3 and
  is mutable (i.e. it can be changed by someone else). Undefined is not being
  passed in so we can ensure that its value is truly undefined. In ES5,
  undefined is no longer mutable.

  Window and document are passed through as localvariables rather than as
  globals, because this (slightly) quickens the resolution process improving
  minification (especially when referenced multiple times).
*/

(function(window, document, $, undefined) {

  'use strict';

  var scope = {
    // Initializes all functions.
    init: function() {
      // Adds a '+' or '-' glyphicon to FAQ accordions.
      scope.accordionIcons('glyphicon-chevron-down', 'glyphicon-chevron-up');
      // Identifies which Bootstrap environment is being used.
      scope.whichBootstrap();
      // Adds accessibility tags to Bootstrap Nav.
      scope.accessibleNav();
      // Contains and initializes all Chocolat elements.
      scope.callChocolat();
      // Inform users about browser-updates if they are on deprecated browsers.
      scope.browserUpdate();
      // Google Events Tracking
      scope.gaTrackEvents();
      // Initialise scroll reveal on selected elements.
      scope.initScrollReveal();
      // Hides & Shows a scroll to top button when window is offset.
      scope.scrollToTop();
      // Contains and initializes all Slick elements.
      scope.sliders();
      // Handles flash of unstyled content.
      scope.fouc();
      scope.callMatchHeight();
      // Make fields readonly
      //scope.initReadOnlyFields();
      // Initialise read/more less element
      scope.initReadMoreLess();
    },
    initReadMoreLess: function() {
      if ($('#readmorelink').length > 0) {
        var contentdiv = document.getElementById('readmorelink');
        var position = contentdiv.offsetTop;
        console.log(position);
        $(contentdiv).hide();

        $('.td-entry-content').readmore({ //needs to be the top-most container element containing the text you want to clip
          speed: 500,
          collapsedHeight: position,
          moreLink: '<span class="btn btn-primary btn-lg btn-read-more">Read More</span>',
          lessLink: '<span class="btn btn-primary btn-lg btn-read-less">Read Less</span>',
          blockCSS: false
        });
      }
    },

    accordionIcons: function(iconWhenCollapsed, iconWhenExpanded) {
      $('.panel a').on('click', function() {
        if ($(this).hasClass('collapsed')) {
          $('.panel a span').removeClass(iconWhenExpanded).addClass(iconWhenCollapsed);
          $(this).find('span').removeClass(iconWhenCollapsed).addClass(iconWhenExpanded);
        } else {
          $(this).find('span').removeClass(iconWhenExpanded).addClass(iconWhenCollapsed);
        }
      });
    },

    accessibleNav: function() {
      var currentPageItem = $('current_page_item');
      var accessibilityTag = '<span class="sr-only">(current)</span>';
      $('.current_page_item').find('a').append(accessibilityTag);
    },

    whichBootstrap: function() {
      var environments = ['xs', 'sm', 'md', 'lg'];
      var el = $('<div>');

      el.appendTo($('body'));

      for (var i = environments.length - 1; i >= 0; i--) {
        var currentEnvironment = environments[i];

        el.addClass('hidden-' + currentEnvironment);
        if (el.is(':hidden')) {
          el.remove();
          return currentEnvironment;
        }
      }
    },

    callChocolat: function() {
      if ($('.chocolat-parent').length) {
        $('.chocolat-parent').Chocolat();
      }
    },

    browserUpdate: function() {
      var $buoop = {
        c: 2
      };

      function $buo_f() {
        var e = document.createElement('script');
        e.src = '//browser-update.org/update.min.js';
        document.body.appendChild(e);
      }

      try {
        document.addEventListener('DOMContentLoaded', $buo_f, false);
      } catch (e) {
        window.attachEvent('onload', $buo_f);
      }
    },

    gaTrackEvents: function() {
      $('.td-track-event').on('click', function(e) {
        var $this = $(this);

        ga('send', 'event', {
          eventCategory: $this.data('ga-category'),
          eventAction: $this.data('ga-action'),
          eventLabel: $this.data('ga-label')
        });
      });
    },

    // Creates a match height by row or default class.
    callMatchHeight: function() {
      var matchClass = $('.match-height');
      var matchClassRow = $('.match-height-row');

      if (matchClass.length) {
        matchClass.matchHeight({
          byRow: false
        });
      }
      if (matchClassRow.length) {
        matchClassRow.matchHeight();
      }
    },

    initScrollReveal: function(args) {
      window.sr = ScrollReveal({
        reset: false
      });

      var srArray = [];
      var srOptions = {
        viewOffsetTop: 10,
        viewFactor: 0.3,
        duration: 1000,
        reset: false,
        opacity: 0,
        scale: 1
      };

      $('.scrollreveal').each(function() {
        var srElement = $(this)[0];
        srArray.push(srElement);
      });

      for (var i = 0; i < srArray.length; i++) {

        if ($(srArray[i]).data('sr-viewOffsetTop')) {
          srOptions.top = $(srArray[i]).data('sr-viewOffsetTop');
        }
        if ($(srArray[i]).data('sr-viewFactor')) {
          srOptions.viewFactor = $(srArray[i]).data('sr-viewFactor');
        }
        if ($(srArray[i]).data('sr-duration')) {
          srOptions.duration = $(srArray[i]).data('sr-duration');
        }
        if ($(srArray[i]).data('sr-reset')) {
          srOptions.reset = $(srArray[i]).data('sr-reset');
        }
        if ($(srArray[i]).data('sr-opacity')) {
          srOptions.opacity = $(srArray[i]).data('sr-opacity');
        }
        if ($(srArray[i]).data('sr-scale')) {
          srOptions.scale = $(srArray[i]).data('sr-scale');
        }

        sr.reveal(srArray[i], {
          viewOffset: {
            top: srOptions.viewOffsetTop
          },
          viewFactor: srOptions.viewFactor,
          duration: srOptions.duration,
          reset: srOptions.reset,
          opacity: srOptions.opacity,
          scale: srOptions.scale
        });
      }
    },

    scrollToTop: function() {
      var scrollElement = $('.scroll-top--button');
      var scrollDuration = 700;
      var offsetOpacity = 1200;
      var offset = 300;

      $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
          scrollElement.addClass('scroll-top--visible');
        } else {
          scrollElement.removeClass('scroll-top--visible scroll-top--fade-out');
        }
        if ($(this).scrollTop() > offsetOpacity) {
          scrollElement.addClass('scroll-top--fade-out');
        }
      });

      scrollElement.on('click', function(e) {
        $('body, html').animate({
          scrollTop: 0
        }, scrollDuration);
      });
    },

    sliders: function() {
      // Homepage Banner Slider
      if ($('.banner-slider').length) {
        $('.banner-slider__images-wrapper').slick({
          autoplay: true,
          autoplaySpeed: 7000,
          infinite: true,
          arrows: true,
          dots: false,
          asNavFor: '.banner-slider__content-wrapper'
        });
        $('.banner-slider__content-wrapper').slick({
          autoplay: true,
          autoplaySpeed: 7000,
          infinite: true,
          arrows: false,
          dots: false,
          asNavFor: '.banner-slider__images-wrapper'
        });
      }
    },

    fouc: function() {
      $('html').removeClass('no-js').addClass('js');
    }
  };
  $('.single-leadins').slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            }, {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });

  // Header search icon toggle mobile mode
  $('.business-details__search a').click(function() {
    $('.search__toggle').slideToggle(500);
  });

  // Products single Slider
    if ($('.products-single-item').length) {
        $('.products-slider-main').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: true,
            asNavFor: '.products-slider-nav'
        });
        $('.products-slider-nav').slick({
            slidesToShow: 8,
            slidesToScroll: 1,
            asNavFor: '.products-slider-main',
            dots: true,
            arrows: true,
            centerMode: false,
            focusOnSelect: true,
            responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4
                }
            }, {
                breakpoint: 481,
                settings: {
                    slidesToShow: 2
                }
            }]
        });
    }

  scope.init();
})(window, document, jQuery);
