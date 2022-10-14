'use strict';

/**
 * Wrapper to eliminate json errors
 * @param {string} str - JSON string
 * @returns {object} - parsed or empty object
 */
function parseJSON ( str ) {
	try {
		if ( str )  return JSON.parse( str );
		else return {};
	} catch ( error ) {
		return {};
	}
}

/**
 * Merging of two objects
 * @param {Object} source
 * @param {Object} merged
 * @return {Object}
 */
function merge( source, merged ) {
	for ( let key in merged ) {
		if ( merged[ key ] instanceof Object && merged[ key ].constructor.name === 'Object' ) {
			if ( typeof( source[ key ] ) !== 'object' ) source[ key ] = {};
			source[ key ] = merge( source[ key ], merged[ key ] );
		} else if ( merged[ key ] !== null ) {
			source[ key ] = merged[ key ];
		}
	}

	return source;
}

/**
 * Check element position relative to viewport (vertical only)
 * @param {Element} node
 */
function inViewport ( node ) {
	let bound = node.getBoundingClientRect();
	return !( bound.bottom < 0 || bound.top > window.innerHeight );
}

// Main
document.addEventListener( 'DOMContentLoaded', function () {
	let core = window.core = new ZemezCore({
		onReady: function ( priority ) {
			if ( priority === 0 ) {
				window.dispatchEvent( new Event( 'resize' ) );
				document.documentElement.classList.add( 'page-loaded' );
			}
		}
	});


	core.register({
		name: 'fontHeebo',
		style: 'https://fonts.googleapis.com/css?family=Heebo:100,300,400,500,700&display=swap'
	});

	core.register({
		name: 'fontAwesome',
		selector: '[class*="fa-"]',
		style: './components/font-awesome/font-awesome.css'
	});

	core.register({
		name: 'mdi',
		selector: '[class*="mdi-"]',
		style: './components/mdi/mdi.css'
	});

	core.register({
		name: 'intenseIcons',
		selector: '[class*="int-"]',
		style: './components/intense-icons/intense-icons.css'
	});

	core.register({
		name: 'intenseThin',
		selector: '[class*="ith-"]',
		style: './components/intense-thin/intense-thin.css'
	});

	core.register({
		name: 'lazyImage',
		selector: '.lazy-img',
		observer: new IntersectionObserver( function ( entries, observer ) {
			entries.forEach( function ( entry ) {
				if ( entry.isIntersecting ) {
					entry.target.loadImage();
					observer.unobserve( entry.target );
				}
			});
		}),
		init: function ( node ) {
			return new Promise( ( function ( resolve ) {
				let
					parentWidth = node.parentElement.offsetWidth,
					imageWidth = node.getAttribute( 'width' ),
					imageHeight = node.getAttribute( 'height' );

				// Fix for lazy images adjusted to the width of the parent
				if ( parentWidth < imageWidth ) {
					node.style.height = ( imageHeight / imageWidth * parentWidth ) + 'px';
				}

				node.loadImage = ( function () {
					this.setAttribute( 'src', this.getAttribute( 'data-src' ) );
				}).bind( node );

				node.addEventListener( 'load', function () {
					node.style.height = null;
				});

				this.observer.observe( node );
				resolve();
			}).bind( this ));
		}
	});

	core.register({
		name: 'pendedImage',
		selector: '.pended-img',
		init: function ( node ) {
			node.setAttribute( 'src', node.getAttribute( 'data-src' ) );
			node.addEventListener( 'load', function () {
				this.classList.add( 'img-loaded' );
				if ( this.hasAttribute( 'data-target' ) ) {
					document.querySelector( this.getAttribute( 'data-target' ) ).classList.add( 'active' );
				}
			});
		}
	});

	core.register({
		name: 'serviceSection',
		selector: '.service-section',
		style: './components/service-section/service-section.css'
	});

	core.register({
		name: 'footer',
		selector: 'footer',
		style: './components/footer/footer.css'
	});

	core.register({
		name: 'button',
		selector: '.btn',
		style: './components/button/button.css'
	});

	core.register({
		name: 'link',
		selector: '.link',
		style: './components/link/link.css'
	});

	core.register({
		name: 'input',
		selector: '.form-group, .input-group, .form-check, .custom-control, .form-control',
		style: './components/input/input.css'
	});

	core.register({
		name: 'checkboxColor',
		selector: '.checkbox-color',
		style: './components/checkbox-color/checkbox-color.css'
	});

	core.register({
		name: 'checkboxTag',
		selector: '.checkbox-tag',
		style: './components/checkbox-tag/checkbox-tag.css'
	});

	core.register({
		name: 'figure',
		selector: '.figure',
		style: './components/figure/figure.css'
	});

	core.register({
		name: 'imageMask',
		selector: '.image-mask',
		style: './components/image-mask/image-mask.css'
	});

	core.register({
		name: 'position',
		selector: '[class*="position-"], [class*="fixed-"], [class*="sticky-"]',
		style: './components/position/position.css'
	});

	core.register({
		name: 'code',
		selector: 'code',
		style: [
			'./components/code/code.css',
			'https://fonts.googleapis.com/css?family=IBM+Plex+Mono:500&display=swap'
		]
	});

	core.register({
		name: 'effect',
		selector: '.effect',
		style: './components/effect/effect.css'
	});

	core.register({
		name: 'dropCap',
		selector: '.drop-cap',
		style: './components/drop-cap/drop-cap.css'
	});

	core.register({
		name: 'textBox',
		selector: '.text-box',
		style: './components/text-box/text-box.css'
	});

	core.register({
		name: 'contentRow',
		selector: '.content-row',
		style: './components/content-row/content-row.css'
	});

	core.register({
		name: 'rd-range',
		selector: '.rd-range',
		style: './components/rd-range/rd-range.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/rd-range/rd-range.min.js'
		],
		init: function ( node ) {
			$( node ).RDRange({});
		}
	});

	core.register({
		name: 'rdNavbar',
		selector: '.rd-navbar',
		style: [
			'./components/rd-navbar/rd-navbar.css',
			'./components/intense-icons/intense-icons.css'
		],
		script: [
			'./components/current-device/current-device.min.js',
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/util/util.min.js',
			'./components/rd-navbar/rd-navbar.min.js'
		],
		init: function ( node ) {
			return new Promise ( function ( resolve ) {
				let
					click = device.ios() ? 'touchstart' : 'click',
					backButtons = node.querySelectorAll( '.navbar-navigation-back-btn' ),
					params = merge({
						stickUpClone:  false,
						anchorNav:     false,
						autoHeight:    false,
						stickUpOffset: '1px',
						responsive:    {
							0: {
								layout:       'rd-navbar-fixed',
								deviceLayout: 'rd-navbar-fixed',
								// TODO focusOnHover: 'ontouchstart' in window,
								focusOnHover: false,
								stickUp:      false
							},
							992: {
								layout:       'rd-navbar-fixed',
								deviceLayout: 'rd-navbar-fixed',
								// TODO focusOnHover: 'ontouchstart' in window,
								focusOnHover: false,
								stickUp:      false
							},
							1200: {
								layout:        'rd-navbar-fullwidth',
								deviceLayout:  'rd-navbar-fullwidth',
								stickUp:       true,
								stickUpOffset: '1px',
								autoHeight:    true
							}
						},
						callbacks: {
							onStuck: function () {
								document.documentElement.classList.add( 'rd-navbar-stuck' );
							},
							onUnstuck: function () {
								document.documentElement.classList.remove( 'rd-navbar-stuck' );
							},
							onDropdownToggle: function () {
								if ( this.classList.contains( 'opened' ) ) {
									this.parentElement.classList.add( 'overlaid' );
								} else {
									this.parentElement.classList.remove( 'overlaid' );
								}
							},
							onDropdownClose: function () {
								this.parentElement.classList.remove( 'overlaid' );
							}
						}
					}, parseJSON( node.getAttribute( 'data-rd-navbar' ) ) );

				if ( window.xMode ) {
					merge( params, {
						stickUpClone: false,
						anchorNav: false,
						responsive: {
							0: {
								stickUp: false,
								stickUpClone: false
							},
							992: {
								stickUp: false,
								stickUpClone: false
							},
							1200: {
								stickUp: false,
								stickUpClone: false
							}
						},
						callbacks: {
							onDropdownOver: function () { return false; }
						}
					});
				}

				let navbar = node.RDNavbar = new RDNavbar( node, params );

				if ( backButtons.length ) {
					backButtons.forEach( function ( btn ) {
						btn.addEventListener( click, function () {
							let submenu = this.closest( '.rd-navbar-submenu' );

							console.log( click, this );
							console.log( submenu );
							console.log( navbar );

							navbar.dropdownToggle.call( submenu, navbar );
						});
					});
				}

				setTimeout( function () {
					node.classList.add( 'rd-navbar-ready' );
					resolve();
				}, 250 );
			});
		}
	});

	core.register({
		name: 'multiswitch',
		selector: '[data-multi-switch]',
		style: './components/multiswitch/multiswitch.css',
		script: [
			'./components/current-device/current-device.min.js',
			'./components/multiswitch/multiswitch.min.js'
		],
		init: function ( node ) {
			let click = device.ios() ? 'touchstart' : 'click';

			if ( node.tagName === 'A' ) {
				node.addEventListener( click, function ( event ) {
					event.preventDefault();
				});
			}

			MultiSwitch( Object.assign( {
				node: node,
				event: click,
			}, parseJSON( node.getAttribute( 'data-multi-switch' ) ) ) );
		}
	});

	core.register({
		name: 'multiswitchTargetSlide',
		selector: '[data-multi-switch-target-slide]',
		script: './components/jquery/jquery-3.4.1.min.js',
		init: function ( node ) {
			let params = parseJSON( node.getAttribute( 'data-multi-switch-target-slide' ) );

			if ( !node.multiSwitchTarget ) {
				node.addEventListener( 'target:ready', function () {
					if ( !this.multiSwitchTarget.groups.active.state ) this.style.display = 'none';
				});
			} else {
				if ( !node.multiSwitchTarget.groups.active.state ) node.style.display = 'none';
			}

			node.addEventListener( 'target:statechange', function () {
				let $this = $( this );

				if ( this.multiSwitchTarget.groups.active.state ) {
					$this.stop().slideDown( params );
				} else {
					$this.stop().slideUp( params );
				}
			});
		}
	});

	// TODO Take Swiper with plugins from cmt.finance site template
	// TODO Update builder plugin
	core.register({
		name: 'swiper',
		selector: '.swiper-container',
		style: [
			'./components/animate/animate.css',
			'./components/swiper/swiper.css'
		],
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/swiper/swiper.min.js'
		],
		init: function ( node ) {
			let
				slides = node.querySelectorAll( '.swiper-slide[data-slide-bg]' ),
				animate = node.querySelectorAll( '.swiper-wrapper [data-caption-animate]' ),
				videos = node.querySelectorAll( '.swiper-wrapper video' ),
				params = merge({
					speed: 500,
					loop: true,
					pagination: {
						el: '.swiper-pagination',
						clickable: true
					},
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					},
					scrollbar: {
						el: '.swiper-scrollbar'
					},
					autoplay: {
						delay: 5000
					}
				}, parseJSON( node.getAttribute( 'data-swiper' ) ) );

			// Specific params for Novi builder
			if ( window.xMode ) {
				params = merge( params, {
					autoplay: false,
					loop: false,
					simulateTouch: false
				});
			}

			// Set background image for slides with `data-slide-bg` attribute
			slides.forEach( function ( slide ) {
				slide.style.backgroundImage = 'url('+ slide.getAttribute( 'data-slide-bg' ) +')';
			});

			// Animate captions with `data-caption-animate` attribute
			if ( animate.length ) {
				if ( !params.on ) params.on = {};
				params.on.transitionEnd = function () {
					let
						active = this.wrapperEl.children[ this.activeIndex ],
						prev = this.wrapperEl.children[ this.previousIndex ];

					active.querySelectorAll( '[data-caption-animate]' ).forEach( function ( node ) {
						node.classList.add( node.getAttribute( 'data-caption-animate' ) );
						node.classList.add( 'animated' );
						node.classList.remove( 'not-animated' );
					});

					prev.querySelectorAll( '[data-caption-animate]' ).forEach( function ( node ) {
						node.classList.remove( node.getAttribute( 'data-caption-animate' ) );
						node.classList.add( 'not-animated' );
						node.classList.remove( 'animated' );
					})
				}
			}

			// Stop video on inactive slides
			if ( videos.length ) {
				if ( !params.on ) params.on = {};
				params.on.transitionStart = function () {
					let
						active = this.wrapperEl.children[ this.activeIndex ],
						prev = this.wrapperEl.children[ this.previousIndex ];

					active.querySelectorAll( 'video' ).forEach( function ( video ) { if ( video.paused ) video.play(); });
					prev.querySelectorAll( 'video' ).forEach( function ( video ) { if ( !video.paused ) video.pause(); })
				}
			}

			// Initialization if there are related swipers
			if ( params.thumbs && params.thumbs.swiper ) {
				let target = document.querySelector( params.thumbs.swiper );

				if ( !target.swiper ) {
					target.addEventListener( 'swiper:ready', function () {
						params.thumbs.swiper = target.swiper;
						new Swiper( node, params );
						node.dispatchEvent( new CustomEvent( 'swiper:ready' ) );
					});
				} else {
					params.thumbs.swiper = target.swiper;
					new Swiper( node, params );
					node.dispatchEvent( new CustomEvent( 'swiper:ready' ) );
				}
			} else {
				new Swiper( node, params );
				node.dispatchEvent( new CustomEvent( 'swiper:ready' ) );
			}
		}
	});

	// TODO get rid of Owl and use the newest Swiper
	core.register({
		name: 'owl',
		selector: '.owl-carousel',
		style: './components/owl-carousel/owl.carousel.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/owl-carousel/owl.carousel.min.js'
		],
		init: function ( node ) {
			let
				params = merge({
					items: 1,
					margin: 40,
					loop: true,
					mouseDrag: true,
					stagePadding: 0,
					nav: false,
					navText: [],
					dots: false,
					autoplay: true,
					autoplayHoverPause: true
				}, parseJSON( node.getAttribute( 'data-owl' ) ) ),
				generated = {
					autoplay: node.getAttribute( 'data-autoplay' ) !== 'false',
					loop: node.getAttribute( 'data-loop' ) !== 'false',
					mouseDrag: node.getAttribute( 'data-mouse-drag' ) !== 'false',
					responsive: {}
				},
				aliaces = [ '-', '-xs-', '-sm-', '-md-', '-lg-', '-xl-', '-xxl-' ],
				values =  [ 0, 480, 576, 768, 992, 1200, 1600 ],
				responsive = generated.responsive;

			for ( let j = 0; j < values.length; j++ ) {
				responsive[ values[ j ] ] = {};

				for ( let k = j; k >= -1; k-- ) {
					if ( !responsive[ values[ j ] ][ 'items' ] && node.getAttribute( 'data' + aliaces[ k ] + 'items' ) ) {
						responsive[ values[ j ] ][ 'items' ] = k < 0 ? 1 : parseInt( node.getAttribute( 'data' + aliaces[ k ] + 'items' ), 10 );
					}
					if ( !responsive[ values[ j ] ][ 'stagePadding' ] && responsive[ values[ j ] ][ 'stagePadding' ] !== 0 && node.getAttribute( 'data' + aliaces[ k ] + 'stage-padding' ) ) {
						responsive[ values[ j ] ][ 'stagePadding' ] = k < 0 ? 0 : parseInt( node.getAttribute( 'data' + aliaces[ k ] + 'stage-padding' ), 10 );
					}
					if ( !responsive[ values[ j ] ][ 'margin' ] && responsive[ values[ j ] ][ 'margin' ] !== 0 && node.getAttribute( 'data' + aliaces[ k ] + 'margin' ) ) {
						responsive[ values[ j ] ][ 'margin' ] = k < 0 ? 30 : parseInt( node.getAttribute( 'data' + aliaces[ k ] + 'margin' ), 10 );
					}
				}
			}

			merge( params, generated );

			if ( window.xMode ) {
				merge( params, {
					autoplay: false,
					loop: false,
					mouseDrag: false
				});
			}

			node.owl = $( node );
			$( node ).owlCarousel( params );
		}
	});

	// TODO get rid of slick and use the newest swiper (need to fully organize the ability to synchronize sliders)
	// TODO problem with pendedImage inside
	core.register({
		name: 'slick',
		selector: '.slick-slider',
		style: './components/slick/slick.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/slick/slick.min.js'
		],
		init: function ( node ) {
			return new Promise ( function ( resolve ) {
				let
					breakpoint = { sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1600 }, // slick slider uses desktop first principle
					responsive = [];

				// Making responsive parameters
				for ( let key in breakpoint ) {
					if ( node.hasAttribute( 'data-slick-'+ key ) ) {
						responsive.push({
							breakpoint: breakpoint[ key ],
							settings: parseJSON( node.getAttribute( 'data-slick-'+ key ) )
						});
					}
				}

				$( node ).on( 'init', function() {
					node.classList.add( 'slick-ready' );
					resolve();
				});

				$( node ).slick({ responsive: responsive });
			});
		}
	});

	core.register({
		name: 'animate',
		selector: '[data-animate]',
		style: './components/animate/animate.css',
		script: './components/current-device/current-device.min.js',
		observer: new IntersectionObserver( function ( entries, observer ) {
			entries.forEach( function ( entry ) {
				if ( entry.isIntersecting ) {
					entry.target.startAnimate();
					observer.unobserve( entry.target );
				}
			});
		}),
		init: function ( node ) {
			if ( !window.xMode && !device.macos() && !inViewport( node ) ) {
				let params = parseJSON( node.getAttribute( 'data-animate' ) );

				node.startAnimate = ( function () {
					node.classList.add( 'animated', params.class );
					node.classList.remove( 'not-animated' );
				}).bind( node );

				node.classList.add( 'not-animated' );
				if ( params.delay ) node.style.animationDelay = params.delay;
				if ( params.duration ) node.style.animationDuration = params.duration;
				this.observer.observe( node );
			}
		}
	});

	// TODO update aCounter and get rid of Util, simplify initialization
	core.register({
		name: 'counter',
		selector: '[data-counter]',
		style: './components/counter/counter.css',
		script: [
			'./components/util/util.min.js',
			'./components/counter/counter.min.js',
		],
		observer: new IntersectionObserver( function ( entries, observer ) {
			entries.forEach( function ( entry ) {
				if ( entry.isIntersecting ) {
					entry.target.counter.run();
					observer.unobserve( entry.target );
				}
			});
		}, {
			rootMargin: '0px',
			threshold: 1.0
		}),
		init: function ( node ) {
			let counter = aCounter( Object.assign( {
				node: node,
				duration: 1000
			}, parseJSON( node.getAttribute( 'data-counter' ) ) ) );

			if ( window.xMode ) {
				counter.run();
			} else {
				this.observer.observe( node );
			}
		}
	});

	// TODO update aCounter and get rid of Util, simplify initialization
	core.register({
		name: 'progressLinear',
		selector: '.progress-linear',
		style: './components/progress-linear/progress-linear.css',
		script: [
			'./components/util/util.min.js',
			'./components/counter/counter.min.js'
		],
		observer: new IntersectionObserver( function ( entries, observer ) {
			entries.forEach( function ( entry ) {
				if ( entry.isIntersecting ) {
					entry.target.counter.run();
					observer.unobserve( entry.target );
				}
			});
		}, {
			rootMargin: '0px',
			threshold: 1.0
		}),
		init: function ( node ) {
			let
				bar = node.querySelector( '.progress-linear-bar' ),
				counter = node.counter = aCounter({
					node: node.querySelector( '.progress-linear-counter' ),
					duration: 500,
					onStart: function ( value ) {
						bar.style.width = this.params.to +'%';
					}
				});

			if ( window.xMode ) {
				counter.run();
			} else {
				this.observer.observe( node );
			}
		}
	});

	// TODO update aCounter, aProgressCircle, get rid of Util, simplify initialization
	core.register({
		name: 'progressCircle',
		selector: '.progress-circle',
		style: './components/progress-circle/progress-circle.css',
		script: [
			'./components/util/util.min.js',
			'./components/counter/counter.min.js',
			'./components/progress-circle/progress-circle.min.js'
		],
		observer: new IntersectionObserver( function ( entries, observer ) {
			entries.forEach( function ( entry ) {
				if ( entry.isIntersecting ) {
					entry.target.counter.run();
					observer.unobserve( entry.target );
				}
			});
		}, {
			rootMargin: '0px',
			threshold: 1.0
		}),
		init: function ( node ) {
			let
				progress = new ProgressCircle({
					node: node.querySelector( '.progress-circle-bar' )
				}),
				counter = node.counter = aCounter({
					node: node.querySelector( '.progress-circle-counter' ),
					duration: 500,
					onUpdate: function ( value ) {
						progress.render( value * 3.6 );
					}
				});

			if ( window.xMode ) {
				counter.run();
			} else {
				this.observer.observe( node );
			}
		}
	});

	// TODO update aCountdown, aProgressCircle, get rid of Util, simplify initialization
	core.register({
		name: 'countdown',
		selector: '[ data-countdown ]',
		style: './components/countdown/countdown.css',
		script: [
			'./components/util/util.min.js',
			'./components/progress-circle/progress-circle.min.js',
			'./components/countdown/countdown.min.js'
		],
		init: function ( node ) {
			aCountdown( Object.assign( {
				node: node,
				tick: 100
			}, parseJSON( node.getAttribute( 'data-countdown' ) ) ) );
		}
	});

	core.register({
		name: 'select2',
		selector: '.select2-original',
		style: './components/select2/select2.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/select2/select2.min.js'
		],
		init: function ( node ) {
			let
				params = parseJSON( node.getAttribute( 'data-select2-options' ) ),
				defaults = {
					dropdownParent: $( '.page' ),
					minimumResultsForSearch: Infinity
				};

			$( node ).select2( $.extend( defaults, params ) );

			// Passing an event for regula
			$( node ).on( 'change', function () {
				node.dispatchEvent( new CustomEvent( 'propertychange' ) );
			});

			// Input cleaner for rd-mailform
			node.cleaner = ( function () {
				$( this ).val( null ).trigger( 'change.select2' );
			}).bind( node );
		}
	});

	core.register({
		name: 'rdSearch',
		selector: '[data-rd-search]',
		style: './components/rd-search/rd-search.css',
		script: './components/rd-search/rd-search.js',
		init: function ( node ) {
			new RDSearch( Object.assign( {
				form: node,
				handler: 'components/rd-search/rd-search.php',
				output: '.rd-search-results'
			}, parseJSON( node.getAttribute( 'data-rd-search' ) ) ) );
		}
	});

	core.register({
		name: 'maskedinput',
		selector: '[data-masked]',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/maskedinput/jquery.maskedinput.min.js'
		],
		init: function ( node ) {
			$( node ).mask( node.getAttribute( 'data-masked' ) );
		}
	});

	core.register({
		name: 'spinner',
		selector: '[data-spinner]',
		style: './components/spinner/spinner.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/jquery/jquery-ui.min.js'
		],
		init: function ( node ) {
			let
				params = parseJSON( node.getAttribute( 'data-spinner' ) ),
				defaults = {
					min: 0,
					step: 1
				};

			$( node ).spinner( $.extend( defaults, params ) );
		}
	});

	core.register({
		name: 'lightgallery',
		selector: '[data-lightgallery]',
		style: './components/lightgallery/lightgallery.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/lightgallery/lightgallery.min.js'
		],
		init: function ( node ) {
			if ( !window.xMode ) {
				$( node ).lightGallery( merge( {
					thumbnail: true,
					selector: '.lightgallery-item',
					youtubePlayerParams: {
						modestbranding: 1,
						showinfo: 0,
						rel: 0,
						controls: 0
					},
					vimeoPlayerParams: {
						byline : 0,
						portrait : 0,
						color : 'A90707'
					}
				}, parseJSON( node.getAttribute( 'data-lightgallery' ) ) ) );
			}
		}
	});

	// TODO optimize or replace
	core.register({
		name: 'datetimepicker',
		selector: '[data-datetimepicker]',
		style: [
			'./components/button/button.css',
			'./components/dropdown/dropdown.css',
			'./components/intense-icons/intense-icons.css',
			'./components/datetimepicker/datetimepicker.css'
		],
		script: [
			'./components/current-device/current-device.min.js',
			'./components/moment-js/moment-js.min.js',
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/datetimepicker/datetimepicker.min.js'
		],
		init: function ( node ) {
			let
				$node = $( node ),
				params = parseJSON( $node.attr( 'data-datetimepicker' ) ),
				defaults = {
					format: 'L LT',
					widgetParent: $node.parent().hasClass( 'input-group' ) ? $node.parent().parent() : $node.parent(),
					icons: {
						time: 'int-clock',
						date: 'int-calendar',
						up: 'int-arrow-up',
						down: 'int-arrow-down',
						previous: 'int-arrow-left',
						next:     'int-arrow-right',
					}
				};

			if ( params.inline && params.target ) {
				let $target = $( params.target );
				delete params.target;

				$node.on( 'dp.change', function( event ) {
					$target.val( event.date.format( params.format || 'L LT' ) );
				});

				params.widgetParent = null;
			}

			if ( ( device.ios() || device.android() ) && !params.inline ) {
				let
					windowClickHandler = ( function ( event ) {
						if ( !this.data( 'DateTimePicker' ).widgetParent()[0].contains( event.target ) ) {
							this.data( 'DateTimePicker' ).hide();
							window.removeEventListener( 'touchstart', windowClickHandler );
						}
					}).bind( $node ),
					inputClickHandler = ( function ( event ) {
						event.preventDefault();
						this.data( 'DateTimePicker' ).show();
						window.addEventListener( 'touchstart', windowClickHandler );
					}).bind( $node );

				params.focusOnShow = false;
				$node.on( 'mousedown', inputClickHandler );
			}

			$node.datetimepicker( $.extend( defaults, params ) );
		}
	});

	core.register({
		name: 'fullcalendar',
		selector: '.fullcalendar',
		style: './components/fullcalendar/fullcalendar.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/jquery/jquery-ui.min.js',
			'./components/moment-js/moment-js.min.js',
			'./components/fullcalendar/fullcalendar.min.js',
		],
		init: function ( node ) {
			$( node ).fullCalendar({
				header: {
					left: '',
					center: 'prev,title,next',
					right: '',
				},
				editable: true,
				droppable: true,
				drop: function() {
					// is the "remove after drop" checkbox checked?
					if (!$(this).hasClass('event-recurring')) {
						$(this).remove();
					}
				},
				eventRender: function(event, element) {
					$(element).append( "<span class='event-close int-close'></span>" );
					$(element).find('.event-close').click(function() {
						$( node ).fullCalendar('removeEvents',event._id);
					});
				},
				weekNumbers: false,
				weekNumbersWithinDays : true,
				eventLimit: true,
				events: node.hasAttribute( 'data-fullcalendar-event' ) ? parseJSON( node.getAttribute( 'data-fullcalendar-event' ) ) : null
			});
		}
	});

	core.register({
		name: 'video',
		selector: '.video',
		style: './components/video/video.css'
	});

	core.register({
		name: 'vide',
		selector: '.vide',
		style: './components/vide/vide.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/vide/vide.min.js',
		],
		init: function ( node ) {
			let
				$element = $( node ),
				path = $element.data( 'vide-bg' ),
				options = $element.data( 'vide-options' );

			$element.vide( path, options );

			if ( window.xMode ) {
				let video = node.querySelector( 'video' );
				video.pause();
			}
		}
	});

	core.register({
		name: 'gmap',
		selector: '.google-map',
		style: './components/google-map/google-map.css',
		script: [
			'//maps.google.com/maps/api/js?key=AIzaSyBHij4b1Vyck1QAuGQmmyryBYVutjcuoRA&libraries=geometry,places&v=quarterly',
			'./components/google-map/google-map.js'
		],
		init: function ( node ) {
			let
				defaults = {
					node: node,
					center: { lat: 0, lng: 0 },
					zoom: 4,
				},
				params = parseJSON( node.getAttribute( 'data-settings' ) ),
				sMap = new SimpleGoogleMap( Object.assign( defaults, params ) );


			sMap.map.addListener( 'tilesloaded', function() {
				node.classList.add( 'gmap-loaded' )
			} );
		}
	});

	core.register({
		name: 'nav',
		selector: '.nav',
		style: './components/nav/nav.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/bootstrap/js/popper.js',
			'./components/bootstrap/js/bootstrap.min.js'
		],
		init: function ( node ) {
			$( node ).on( 'click', function ( event ) {
				event.preventDefault();
				$( this ).tab( 'show' );
			});
			$( node ).find( 'a[data-toggle="tab"]' ).on( 'shown.bs.tab', function () {
				window.dispatchEvent( new Event( 'resize' ) );
			});
		}
	});

	core.register({
		name: 'isotope',
		selector: '.isotope-wrap',
		style: './components/isotope/isotope.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/isotope/isotope.min.js'
		],
		setFilterActive: function ( filterGroup, activeItem ) {
			if ( !activeItem.classList.contains( 'active' ) ) {
				for ( let n = 0; n < filterGroup.length; n++ ) filterGroup[ n ].classList.remove( 'active' );
				activeItem.classList.add( 'active' );
			}
		},
		init: function ( node ) {
			let
				component = this,
				isotopeItem = $( '.isotope' ),
				isotopeFilters = node.querySelectorAll( '[data-isotope-filter]' );

			isotopeItem.isotope({
				itemSelector: '.isotope-item'
			});

			isotopeFilters.forEach( function ( filter ) {
				filter.addEventListener( 'click', function () {
					component.setFilterActive( isotopeFilters, filter );
					isotopeItem.isotope( {
						filter: $( this ).attr( 'data-isotope-filter' )
					});
				});
			});
		}
	});

	core.register({
		name: 'pendedIFrame',
		selector: '[data-pended-iframe]',
		init: function ( node ) {
			let loader = ( function () {
				node.setAttribute( 'src', node.getAttribute( 'data-pended-iframe' ) );
			}).bind( node );

			document.documentElement.addEventListener( 'ready', loader );
		}
	});

	core.register({
		name: 'parallax',
		selector: '.parallax',
		style: './components/parallax/parallax.css',
		script: './components/parallax/parallax.min.js',
		init: function ( node ) {
			new Parallax({ node: node });
		}
	});

	// TODO Replace with something simpler and better
	core.register({
		name: 'parallaxJs',
		selector: '.parallax-js',
		style: './components/mouse-parallax/parallax-js.css',
		script: './components/mouse-parallax/parallax-js.min.js',
		init: function ( node ) {
			new Parallax( node );
		}
	});

	core.register({
		name: 'toTop',
		style: [
			'./components/to-top/to-top.css',
			'./components/intense-icons/intense-icons.css'
		],
		script: './components/jquery/jquery-3.4.1.min.js',
		init: function () {
			if ( !window.xMode ) {
				let
					node = document.createElement( 'div' ),
					scrollHandler = function () {
						if ( window.scrollY > window.innerHeight ) node.classList.add( 'show' );
						else node.classList.remove( 'show' );
					};

				node.className = 'to-top int-arrow-up';
				document.body.appendChild( node );

				node.addEventListener( 'mousedown', function () {
					this.classList.add( 'active' );

					$( 'html, body' ).stop().animate( { scrollTop: 0 }, 500, 'swing', ( function () {
						this.classList.remove( 'active' );
					}).bind( this ));
				});

				scrollHandler();
				document.addEventListener( 'scroll', scrollHandler );
			}
		}
	});

	core.register({
		name: 'textRotator',
		selector: '.text-rotator',
		style: [
			'./components/animate/animate.css',
			'./components/text-rotator/text-rotator.css'
		],
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/text-rotator/text-rotator.min.js'
		],
		init: function ( node ) {
			$( node ).rotator();
		}
	});

	core.register({
		name: 'anchorLink',
		selector: '[data-anchor-link]',
		script: './components/jquery/jquery-3.4.1.min.js',
		init: function ( node ) {
			let
				anchor = document.querySelector( node.getAttribute( 'href' ) ),
				offset = 50;

			node.addEventListener( 'click', function ( event ) {
				event.preventDefault();
				let top = $(anchor).offset().top - offset;
				$( 'html, body' ).stop().animate( { scrollTop: top }, 500, 'swing' );
			});
		}
	});

	core.register({
		name: 'liveAnchor',
		selector: '[data-live-anchor]',
		style: './components/live-anchor/live-anchor.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/live-anchor/live-anchor.js'
		],
		init: function ( node ) {
			new LiveAnchor({
				link: node,
				anchor: node.getAttribute( 'href' ),
				offset: 100
			});
		}
	});

	core.register({
		name: 'notifications-area',
		selector: '#notifications-area',
		script: './components/notification/notification.js',
		style: [
			'./components/notification/notification.css',
			'./components/snackbar/snackbar.css'
		],
		init: function ( node ) {
			node.stack = [];

			node.notification = function ( fields, params ) {
				let notification = new SimpleNotification( merge({
					parent: node,
					template: '<div class="snackbar {cls}"><div class="snackbar-inner"><div class="snackbar-title">{icon}{text}</div></div></div>',
					fields: merge( { text: null, cls: 'snackbar-secondary', icon: null }, fields )
				}, params || {} ));

				if ( notification.timeout ) {
					node.stack.push( notification );
				}

				if ( node.stack.length > 5 ) {
					node.stack.shift().hide();
				}

				return notification;
			}
		}
	});

	core.register({
		name: 'regula',
		selector: '[data-constraints]',
		style: './components/regula/regula.css',
		script: [
			'./components/regula/regula.min.js',
			'./components/regula/constraints.js'
		],
		init: function ( node ) {
			node.classList.add( 'form-control-has-validation' );
			let out = document.createElement( 'span' );
			out.className = 'form-validation';
			node.parentElement.insertBefore( out, node.nextElementSibling );

			regula.bind({
				element: node,
				constraints: ( function () {
					let parsed = regula._modules.Parser.parse( node, node.getAttribute( 'data-constraints' ) );
					return parsed.data.map( function ( item ) {
						return {
							constraintType: regula.Constraint[ item.constraintName ],
							params: item.definedParameters
						};
					});
				})()
			});

			node.validator = ( function () {
				let result = regula.validate({ elements: [ this ] });

				if ( result.length ) {
					this.parentElement.classList.add( 'has-error' );
					out.innerText = result[ result.length - 1 ].message;
				} else {
					this.parentElement.classList.remove( 'has-error' );
					out.innerText = '';
				}

				return !( result.length );
			}).bind( node );

			node.addEventListener( 'input', node.validator );
			node.addEventListener( 'change', node.validator );
			node.addEventListener( 'blur', node.validator );
			node.addEventListener( 'propertychange', node.validator );
		}
	});

	core.register({
		name: 'reCaptcha',
		selector: '.recaptcha',
		script: [
			'./components/reCaptcha/reCaptcha.js',
			'//www.google.com/recaptcha/api.js?onload=onCaptchaReady&render=explicit&hl=en'
		],
		init: function ( node ) {
			new ReCaptcha({
				node: node,
				sitekey: node.getAttribute( 'data-sitekey' ),
				size: node.hasAttribute( 'data-size' ) ? node.getAttribute( 'data-size' ) : 'normal',
				theme: node.hasAttribute( 'data-theme' ) ? node.getAttribute( 'data-theme' ) : 'light',
				onRequest: function () {
					if ( !this.notification ) {
						this.notification = document.querySelector( '#notifications-area' ).notification(
							{
								text: 'Validate reCaptcha',
								icon: '<span class="icon snackbar-icon fa-circle-o-notch fa-spin"></span>',
								cls: 'snackbar-info'
							},
							{
								timeout: 0
							}
						);
					}
				},
				onResponse: function () {
					if ( this.notification ) {
						this.notification.hide();
						this.notification = null;
					}
				}
			});
		}
	});

	core.register({
		name: 'rdMailform',
		selector: '.rd-mailform',
		style: [
			'./components/rd-mailform/rd-mailform.css',
			'./components/intense-icons/intense-icons.css',
			'./components/font-awesome/font-awesome.css',
			'./components/mdi/mdi.css'
		],
		script: './components/rd-mailform/rd-mailform.js',
		init: function ( node ) {
			new RDMailform({
				node: node,
				type: node.hasAttribute( 'data-form-type' ) ? node.getAttribute( 'data-form-type' ) : 'contact',
				fields: 'input, select, textarea, .recaptcha',
				onInvalid: function () {
					document.querySelector( '#notifications-area' ).notification({
						text: 'Please check the entered data',
						icon: '<span class="icon snackbar-icon int-warning"></span>',
						cls: 'snackbar-danger'
					});
				},
				onSend: function ( data ) {
					if ( !this.notification ) {
						this.notification = document.querySelector( '#notifications-area' ).notification(
							{
								text: 'Sending',
								icon: '<span class="icon snackbar-icon fa-circle-o-notch fa-spin"></span>',
								cls: 'snackbar-info'
							},
							{
								timeout: 0
							}
						);
					}
				},
				onResponse: function ( res ) {
					if ( this.notification ) {
						this.notification.hide();
						this.notification = null;
					}
				},
				onError: function ( response ) {
					console.warn( response );
					document.querySelector( '#notifications-area' ).notification({
						text: 'Something went wrong.',
						icon: '<span class="icon snackbar-icon int-danger"></span>',
						cls: 'snackbar-danger'
					});
				},
				onSuccess: function ( code, message ) {
					if ( code === 'MF000' ) {
						document.querySelector( '#notifications-area' ).notification({
							text: message,
							icon: '<span class="icon snackbar-icon int-check"></span>'
						});
					} else {
						document.querySelector( '#notifications-area' ).notification({
							text: message,
							icon: '<span class="icon snackbar-icon int-danger"></span>',
							cls: 'snackbar-danger'
						});
					}
				},
				onBusy: function () {
					document.querySelector( '#notifications-area' ).notification({
						text: 'Your request is being sent.',
						icon: '<span class="icon snackbar-icon int-info"></span>',
						cls: 'snackbar-info'
					});
				}
			});
		}
	});

	core.register({
		name: 'mailchimp',
		selector: '.mailchimp-mailform',
		script: './components/mailchimp/mailchimp.js',
		init: function ( node ) {
			new ZemezMailchimp({
				node: node,
				action: node.getAttribute( 'action' ),
				fields: 'input, select, .recaptcha',
				onBusy: function () {
					document.querySelector( '#notifications-area' ).notification({
						text: 'Your request is being sent.',
						icon: '<span class="icon snackbar-icon int-info"></span>',
						cls: 'snackbar-info'
					});
				},
				onInvalid: function () {
					document.querySelector( '#notifications-area' ).notification({
						text: 'Please check the entered data',
						icon: '<span class="icon snackbar-icon int-warning"></span>',
						cls: 'snackbar-danger'
					});
				},
				onSend: function ( data ) {
					if ( !this.notification ) {
						this.notification = document.querySelector( '#notifications-area' ).notification(
							{
								text: 'Sending',
								icon: '<span class="icon snackbar-icon fa-circle-o-notch fa-spin"></span>',
								cls: 'snackbar-info'
							},
							{
								timeout: 0
							}
						);
					}
				},
				onSuccess: function ( response ) {
					if ( this.notification ) {
						this.notification.hide();
						this.notification = null;
					}

					if ( response.result === 'success' ) {
						document.querySelector( '#notifications-area' ).notification({
							text: response.msg,
							icon: '<span class="icon snackbar-icon int-check"></span>'
						});
					} else {
						document.querySelector( '#notifications-area' ).notification(
							{
								text: response.msg,
								icon: '<span class="icon snackbar-icon int-danger"></span>',
								cls: 'snackbar-danger'
							},
							{
								timeout: 5000
							}
						);
					}
				},
				onError: function ( error ) {
					console.warn( error );

					if ( this.notification ) {
						this.notification.hide();
						this.notification = null;
					}

					document.querySelector( '#notifications-area' ).notification({
						text: 'Something went wrong.',
						icon: '<span class="icon snackbar-icon int-danger"></span>',
						cls: 'snackbar-danger'
					});
				}
			});
		}
	});

	core.register({
		name: 'campaignMonitor',
		selector: '.campaign-mailform',
		script: './components/campaign-monitor/campaign-monitor.js',
		init: function ( node ) {
			new ZemezCampaignMonitor({
				node: node,
				action: node.getAttribute( 'action' ),
				id: node.getAttribute( 'data-id' ),
				fields: 'input, select, .recaptcha',
				onBusy: function () {
					document.querySelector( '#notifications-area' ).notification({
						text: 'Your request is being sent.',
						icon: '<span class="icon snackbar-icon int-info"></span>',
						cls: 'snackbar-info'
					});
				},
				onInvalid: function () {
					document.querySelector( '#notifications-area' ).notification({
						text: 'Please check the entered data',
						icon: '<span class="icon snackbar-icon int-warning"></span>',
						cls: 'snackbar-danger'
					});
				},
				onSend: function ( data ) {
					if ( !this.notification ) {
						this.notification = document.querySelector( '#notifications-area' ).notification(
							{
								text: 'Sending',
								icon: '<span class="icon snackbar-icon fa-circle-o-notch fa-spin"></span>',
								cls: 'snackbar-info'
							},
							{
								timeout: 0
							}
						);
					}
				},
				onSuccess: function ( response, request ) {
					if ( this.notification ) {
						this.notification.hide();
						this.notification = null;
					}

					if ( response.Status === 200 ) {
						document.querySelector( '#notifications-area' ).notification({
							text: response.Message,
							icon: '<span class="icon snackbar-icon int-check"></span>'
						});
					} else if ( response.Status === 400 && response.RedirectUrl ) {
						document.querySelector( '#notifications-area' ).notification(
							{
								text: response.Message +' (<a href="'+ request +'">Click here</a>)',
								icon: '<span class="icon snackbar-icon int-warning"></span>',
								cls: 'snackbar-info'
							},
							{
								timeout: 5000
							}
						);
					} else {
						document.querySelector( '#notifications-area' ).notification({
							text: 'Something went wrong.',
							icon: '<span class="icon snackbar-icon int-danger"></span>',
							cls: 'snackbar-danger'
						});
					}
				},
				onError: function ( error ) {
					console.warn( error );

					if ( this.notification ) {
						this.notification.hide();
						this.notification = null;
					}

					document.querySelector( '#notifications-area' ).notification({
						text: 'Something went wrong.',
						icon: '<span class="icon snackbar-icon int-danger"></span>',
						cls: 'snackbar-danger'
					});
				}
			});
		}
	});

	// TODO License problems
	core.register({
		name: 'highchartsDouble',
		selector: '[data-highcharts-double="container"]',
		style: './components/highchart/highchart.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/highchart/highchart.min.js',
			'./components/highchart/highchart-double.init.js'
		],
		init: function ( node ) {
			$.getJSON( node.getAttribute( 'data-file' ), initHighchartsDouble.bind( node ) );
		}
	});

	// TODO License problems
	core.register({
		name: 'highcharts',
		selector: '.highcharts-container',
		style: './components/highchart/highchart.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/highchart/highchart.min.js'
		],
		init: function ( node ) {
			Highcharts.chart( node, parseJSON( node.getAttribute( 'data-highcharts-options' ) ) );
		}
	});

	// TODO Update Flotchart
	core.register({
		name: 'flotchart',
		selector: '.flotchart-container',
		style: './components/flotchart/flotchart.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/flotchart/flotchart.min.js',
			'./components/flotchart/flotchart-resize.js',
			'./components/flotchart/flotchart-pie.js',
			'./components/flotchart/flotchart-tooltip.js'
		],
		depend: 'nav',
		init: function ( node ) {
			$.plot(
				$( node ),
				JSON.parse( node.getAttribute( 'data-flotchart-data' ) ),
				JSON.parse( node.getAttribute( 'data-flotchart-options' ) ) || {
					colors: ['#6b39bd', '#28A8FF', '#31c77f', '#F19711', '#E72660', '#C728FF'],
					grid: {
						show: true,
						aboveData: true,
						color: '#bebebe',
						clickable: true,
						hoverable: true
					},
					xaxis: {
						color: '#bebebe', // color for value in flotchart.scss
					},
					yaxis: {
						color: '#bebebe' // color for value in flotchart.scss
					},
					tooltip: {
						show: true,
						content: '%x : %y.0',
						defaultTheme: false
					},
					series: {
						lines: {
							lineWidth: 2
						},
						bars: {
							fillColor: { colors: [ { opacity: 0.7 }, { opacity: 1.0 } ] }
						}
					}
				}
			);
		}
	});


	core.register({
		name: 'icon',
		selector: '.icon',
		style: './components/icon/icon.css'
	});

	core.register({
		name: 'logo',
		selector: '.logo',
		style: './components/logo/logo.css'
	});

	core.register({
		name: 'badge',
		selector: '.badge',
		style: './components/badge/badge.css'
	});

	core.register({
		name: 'table',
		selector: '.table',
		style: './components/table/table.css'
	});

	core.register({
		name: 'tableCart',
		selector: '.table-cart',
		style: './components/table-cart/table-cart.css'
	});

	core.register({
		name: 'bradcrumb',
		selector: '.breadcrumb',
		style: './components/breadcrumb/breadcrumb.css'
	});

	core.register({
		name: 'accordion',
		selector: '.accordion',
		style: [
			'./components/accordion/accordion.css',
			'./components/intense-icons/intense-icons.css'
		]
	});

	core.register({
		name: 'pagination',
		selector: '.pagination, .pag',
		style: [
			'./components/pagination/pagination.css',
			'./components/pag/pag.css',
			'./components/intense-icons/intense-icons.css'
		]
	});

	core.register({
		name: 'thumbnailBorder',
		selector: '.thumbnail-border',
		style: './components/thumbnail-border/thumbnail-border.css'
	});

	core.register({
		name: 'thumbnailLight',
		selector: '.thumbnail-light',
		style: './components/thumbnail-light/thumbnail-light.css'
	});

	core.register({
		name: 'thumbnailBorder',
		selector: '.thumbnail-border',
		style: './components/thumbnail-border/thumbnail-border.css'
	});

	core.register({
		name: 'thumbnailSmall',
		selector: '.thumbnail-small',
		style: './components/thumbnail-small/thumbnail-small.css'
	});

	core.register({
		name: 'thumbnailJanes',
		selector: '.thumbnail-janes',
		style: './components/thumbnail-janes/thumbnail-janes.css'
	});

	core.register({
		name: 'thumbnailTamaz',
		selector: '.thumbnail-tamaz',
		style: './components/thumbnail-tamaz/thumbnail-tamaz.css'
	});

	core.register({
		name: 'thumbnailConnor',
		selector: '.thumbnail-connor',
		style: './components/thumbnail-connor/thumbnail-connor.css'
	});

	core.register({
		name: 'thumbnailFrode',
		selector: '.thumbnail-frode',
		style: './components/thumbnail-frode/thumbnail-frode.css'
	});

	core.register({
		name: 'thumbnailScaleup',
		selector: '.thumbnail-scaleup',
		style: './components/thumbnail-scaleup/thumbnail-scaleup.css'
	});

	core.register({
		name: 'thumbnailUpward',
		selector: '.thumbnail-upward',
		style: './components/thumbnail-upward/thumbnail-upward.css'
	});

	core.register({
		name: 'thumbnailUpShadow',
		selector: '.thumbnail-up-shadow',
		style: './components/thumbnail-up-shadow/thumbnail-up-shadow.css'
	});

	core.register({
		name: 'thumbnailJosip',
		selector: '.thumbnail-josip',
		style: './components/thumbnail-josip/thumbnail-josip.css'
	});

	core.register({
		name: 'thumbnailZoom',
		selector: '.thumbnail-zoom',
		style: [
			'./components/thumbnail-zoom/thumbnail-zoom.css',
			'./components/intense-icons/intense-icons.css'
		]
	});

	core.register({
		name: 'thumbnailRotate',
		selector: '.thumbnail-rotate',
		style: './components/thumbnail-rotate/thumbnail-rotate.css'
	});

	core.register({
		name: 'thumbnailGumba',
		selector: '.thumbnail-gumba',
		style: './components/thumbnail-gumba/thumbnail-gumba.css'
	});

	core.register({
		name: 'thumbnailCalma',
		selector: '.thumbnail-calma',
		style: './components/thumbnail-calma/thumbnail-calma.css'
	});

	core.register({
		name: 'thumbnailLouis',
		selector: '.thumbnail-louis',
		style: './components/thumbnail-louis/thumbnail-louis.css'
	});

	core.register({
		name: 'gallery',
		selector: '.gallery',
		style: './components/gallery/gallery.css'
	});

	core.register({
		name: 'pricingBox',
		selector: '.pricing',
		style: './components/pricing/pricing.css'
	});

	core.register({
		name: 'pricingTable',
		selector: '.pricing-table',
		style: './components/pricing-table/pricing-table.css'
	});

	core.register({
		name: 'pricingList',
		selector: '.pricing-list',
		style: './components/pricing-list/pricing-list.css'
	});

	core.register({
		name: 'plans',
		selector: '.plans',
		style: './components/plans/plans.css'
	});

	core.register({
		name: 'blog',
		selector: '.blog',
		style: './components/blog/blog.css'
	});

	core.register({
		name: 'blogArticle',
		selector: '.blog-article',
		style: './components/blog-article/blog-article.css'
	});

	core.register({
		name: 'post',
		selector: '.post',
		style: './components/post/post.css'
	});

	core.register({
		name: 'postMeta',
		selector: '.post-meta',
		style: './components/post-meta/post-meta.css'
	});

	core.register({
		name: 'postShare',
		selector: '.post-share',
		style: './components/post-share/post-share.css'
	});

	core.register({
		name: 'product',
		selector: '.product',
		style: './components/product/product.css'
	});

	core.register({
		name: 'productOverview',
		selector: '.product-overview',
		style: './components/product-overview/product-overview.css'
	});

	core.register({
		name: 'productToolbar',
		selector: '.product-toolbar',
		style: './components/product-toolbar/product-toolbar.css'
	});

	core.register({
		name: 'widget',
		selector: '.widget',
		style: './components/widget/widget.css'
	});

	core.register({
		name: 'offerBox',
		selector: '.offer-box',
		style: './components/offer-box/offer-box.css'
	});

	core.register({
		name: 'tag',
		selector: '.tag',
		style: './components/tag/tag.css'
	});

	core.register({
		name: 'intro',
		selector: '.intro',
		style: './components/intro/intro.css'
	});

	core.register({
		name: 'alert',
		selector: '.alert',
		style: './components/alert/alert.css'
	});

	core.register({
		name: 'snackbar',
		selector: '.snackbar',
		style: './components/snackbar/snackbar.css'
	});

	core.register({
		name: 'rights',
		selector: '.rights',
		style: './components/rights/rights.css'
	});

	core.register({
		name: 'iframe',
		selector: '.iframe',
		style: './components/iframe/iframe.css'
	});

	core.register({
		name: 'tab',
		selector: '.tab',
		style: './components/tab/tab.css'
	});

	core.register({
		name: 'snackbar',
		selector: '.snackbar',
		style: './components/snackbar/snackbar.css'
	});

	core.register({
		name: 'divider',
		selector: '.divider',
		style: './components/divider/divider.css'
	});

	core.register({
		name: 'dividerLayout',
		selector: '.divider-layout',
		style: './components/divider-layout/divider-layout.css'
	});

	core.register({
		name: 'blurb',
		selector: '.blurb',
		style: [
			'./components/media/media.css',
			'./components/blurb/blurb.css'
		]
	});

	core.register({
		name: 'person',
		selector: '.person',
		style: './components/person/person.css'
	});

	core.register({
		name: 'rating',
		selector: '.rating',
		style: './components/rating/rating.css'
	});

	core.register({
		name: 'award',
		selector: '.award',
		style: './components/award/award.css'
	});

	core.register({
		name: 'quote',
		selector: '.quote',
		style: [
			'./components/media/media.css',
			'./components/quote/quote.css'
		]
	});

	core.register({
		name: 'service',
		selector: '.service',
		style: './components/service/service.css'
	});

	core.register({
		name: 'layout',
		selector: '.layout',
		style: './components/layout/layout.css'
	});

	core.register({
		name: 'quoteSimple',
		selector: '.quote-simple',
		style: [
			'./components/media/media.css',
			'./components/quote-simple/quote-simple.css'
		]
	});

	core.register({
		name: 'comment',
		selector: '.comment',
		style: [
			'./components/media/media.css',
			'./components/comment/comment.css'
		]
	});

	core.register({
		name: 'review',
		selector: '.review',
		style: './components/review/review.css'
	});

	core.register({
		name: 'partner',
		selector: '.partner',
		style: './components/partner/partner.css'
	});

	core.register({
		name: 'list',
		selector: '.list',
		style: [
			'./components/list/list.css',
			'./components/intense-icons/intense-icons.css'
		]
	});

	core.register({
		name: 'sitelist',
		selector: '.sitelist',
		style: [
			'./components/sitelist/sitelist.css',
			'./components/intense-icons/intense-icons.css'
		]
	});

	core.register({
		name: 'term-list',
		selector: '.term-list',
		style: './components/term-list/term-list.css'
	});

	core.register({
		name: 'media',
		selector: '.media',
		style: './components/media/media.css'
	});

	core.register({
		name: 'jumbotron',
		selector: '.jumbotron',
		style: './components/jumbotron/jumbotron.css'
	});

	core.register({
		name: 'accentBox',
		selector: '.accent-box',
		style: './components/accent-box/accent-box.css'
	});

	core.register({
		name: 'iconBox',
		selector: '.icon-box',
		style: './components/icon-box/icon-box.css'
	});


	core.register({
		name: 'revolutionParallaxZoomSlices',
		selector: '#rev_slider_28_1_wrapper',
		style: [
			'./components/revolution/settings.css',
			'./components/revolution/parallax-zoom-slices.css'
		],
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/util/util.min.js',
			'./components/revolution/jquery.themepunch.tools.min.js',
			'./components/revolution/jquery.themepunch.revolution.min.js',
			'./components/revolution/revolution.addon.slicey.min.js',
			'./components/revolution/revolution.extension.actions.min.js',
			'./components/revolution/revolution.extension.carousel.min.js',
			'./components/revolution/revolution.extension.kenburn.min.js',
			'./components/revolution/revolution.extension.layeranimation.min.js',
			'./components/revolution/revolution.extension.migration.min.js',
			'./components/revolution/revolution.extension.navigation.min.js',
			'./components/revolution/revolution.extension.parallax.min.js',
			'./components/revolution/revolution.extension.slideanims.min.js',
			'./components/revolution/revolution.extension.video.min.js',
			'./components/revolution/revolution-parallax-zoom-slices.js'
		]
	});

	core.register({
		name: 'revolutionCrossFade',
		selector: '#rev_slider_crossfade_wrapper',
		style: './components/revolution/settings.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/util/util.min.js',
			'./components/revolution/jquery.themepunch.tools.min.js',
			'./components/revolution/jquery.themepunch.revolution.min.js',
			'./components/revolution/revolution.extension.actions.min.js',
			'./components/revolution/revolution.extension.carousel.min.js',
			'./components/revolution/revolution.extension.kenburn.min.js',
			'./components/revolution/revolution.extension.layeranimation.min.js',
			'./components/revolution/revolution.extension.migration.min.js',
			'./components/revolution/revolution.extension.navigation.min.js',
			'./components/revolution/revolution.extension.parallax.min.js',
			'./components/revolution/revolution.extension.slideanims.min.js',
			'./components/revolution/revolution.extension.video.min.js',
			'./components/revolution/revolution-crossfade.js'
		]
	});

	core.register({
		name: 'revolutionFadeThrough',
		selector: '#rev_slider_fade_through_wrapper',
		style: './components/revolution/settings.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/util/util.min.js',
			'./components/revolution/jquery.themepunch.tools.min.js',
			'./components/revolution/jquery.themepunch.revolution.min.js',
			'./components/revolution/revolution.extension.actions.min.js',
			'./components/revolution/revolution.extension.carousel.min.js',
			'./components/revolution/revolution.extension.kenburn.min.js',
			'./components/revolution/revolution.extension.layeranimation.min.js',
			'./components/revolution/revolution.extension.migration.min.js',
			'./components/revolution/revolution.extension.navigation.min.js',
			'./components/revolution/revolution.extension.parallax.min.js',
			'./components/revolution/revolution.extension.slideanims.min.js',
			'./components/revolution/revolution.extension.video.min.js',
			'./components/revolution/revolution-fade-through.js'
		]
	});

	core.register({
		name: 'revolutionSlideHorizontal',
		selector: '#rev_slider_slide_horizontal_wrapper',
		style: './components/revolution/settings.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/util/util.min.js',
			'./components/revolution/jquery.themepunch.tools.min.js',
			'./components/revolution/jquery.themepunch.revolution.min.js',
			'./components/revolution/revolution.extension.actions.min.js',
			'./components/revolution/revolution.extension.carousel.min.js',
			'./components/revolution/revolution.extension.kenburn.min.js',
			'./components/revolution/revolution.extension.layeranimation.min.js',
			'./components/revolution/revolution.extension.migration.min.js',
			'./components/revolution/revolution.extension.navigation.min.js',
			'./components/revolution/revolution.extension.parallax.min.js',
			'./components/revolution/revolution.extension.slideanims.min.js',
			'./components/revolution/revolution.extension.video.min.js',
			'./components/revolution/revolution-slide-horizontal.js'
		]
	});

	core.register({
		name: 'revolutionOverlayHorizontal',
		selector: '#rev_slider_overlay_horizontal_wrapper',
		style: './components/revolution/settings.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/util/util.min.js',
			'./components/revolution/jquery.themepunch.tools.min.js',
			'./components/revolution/jquery.themepunch.revolution.min.js',
			'./components/revolution/revolution.extension.actions.min.js',
			'./components/revolution/revolution.extension.carousel.min.js',
			'./components/revolution/revolution.extension.kenburn.min.js',
			'./components/revolution/revolution.extension.layeranimation.min.js',
			'./components/revolution/revolution.extension.migration.min.js',
			'./components/revolution/revolution.extension.navigation.min.js',
			'./components/revolution/revolution.extension.parallax.min.js',
			'./components/revolution/revolution.extension.slideanims.min.js',
			'./components/revolution/revolution.extension.video.min.js',
			'./components/revolution/revolution-overlay-horizontal.js'
		]
	});

	core.register({
		name: 'revolutionZoomHorizontal',
		selector: '#rev_slider_zoom_horizontal_wrapper',
		style: './components/revolution/settings.css',
		script: [
			'./components/jquery/jquery-3.4.1.min.js',
			'./components/util/util.min.js',
			'./components/revolution/jquery.themepunch.tools.min.js',
			'./components/revolution/jquery.themepunch.revolution.min.js',
			'./components/revolution/revolution.extension.actions.min.js',
			'./components/revolution/revolution.extension.carousel.min.js',
			'./components/revolution/revolution.extension.kenburn.min.js',
			'./components/revolution/revolution.extension.layeranimation.min.js',
			'./components/revolution/revolution.extension.migration.min.js',
			'./components/revolution/revolution.extension.navigation.min.js',
			'./components/revolution/revolution.extension.parallax.min.js',
			'./components/revolution/revolution.extension.slideanims.min.js',
			'./components/revolution/revolution.extension.video.min.js',
			'./components/revolution/revolution-zoom-horizontal.js'
		]
	});


	core.prepare();
});

window.addEventListener( 'load', function () {
	if ( !window.xMode ) {
		window.core.observe();
	}

	window.core.init( true );
});
