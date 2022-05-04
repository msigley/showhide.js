/*
 * showhide.js v1.2.1
 */
(function() {
	var mLine = document.createElement( 'span' );
	mLine.style.display = 'inline-block';
	mLine.style.padding = '0';
	mLine.style.lineHeight = '1';
	mLine.style.position = 'absolute';
	mLine.style.visibility = 'hidden';
	mLine.style.fontSize = '1em';
	mLine.textContent = 'M';

	var resizeObserver = null,
		resizeFrame = null,
		resizeEntries = [];

	var resizeHandler = function( isObserver ) {
		var entries = resizeEntries;
		if( isObserver )
			resizeEntries = [];

		var entry, i;
		for(i = 0; i < entries.length; i++) {
			entry = entries[i];
			if( isObserver )
				entry = entry.target;
			if( entry.showHideParent )
				entry = entry.showHideParent;

			if( null === entry.parentElement )
				continue;

			entry.style.fontSize = '';
			entry.showHideOptions.linkElement.style.fontSize = '';

			//Calculate linkElement font size based on M height (ems).
			entry.showHideOptions.linkElement.append( mLine );
			entry.showHideOptions.linkElement.style.fontSize = mLine.clientHeight + 'px';
			mLine.remove();

			entry.fontSize = '0';
		}
	};

	var resizeObserverHandler = function() {
		resizeHandler( true );
	};

	var resizeEventHandler = function() {
		resizeHandler( false );
	};

	if( "ResizeObserver" in window ) {
		resizeObserver = new ResizeObserver( function( entries ) {
			cancelAnimationFrame( resizeFrame );
			resizeEntries.push( ...entries );
			resizeFrame = requestAnimationFrame( resizeObserverHandler ); //Run observer handler when not busy
		} );
	} else {
		var events = [ 'resize', 'load', 'transitionend', 'animationend' ];
		for(i = 0; i < events.length; i++) {
			window.addEventListener( events[i], function( e ) {
				cancelAnimationFrame( resizeFrame );
				resizeFrame = requestAnimationFrame( resizeEventHandler ); //Run event handler when not busy
			} );
		}
	}

	Element.prototype.hideContent = function( event = false ) {
		if( this.showHideOptions.state === 'hidden' )
			return;

		if( this.showHideOptions.onHide ) {
			if( false === this.showHideOptions.onHide( this, event ) )
				return;
		}

		for( let child of this.children ) { // Hide elements
			if( child === this.showHideOptions.linkElement )
				continue;

			if( typeof child.showHideOriginalDisplay === 'undefined' )
				child.showHideOriginalDisplay = window.getComputedStyle( child ).display;

			child.style.display = 'none';
			child.style.visibility = 'hidden';
		}

		this.style.fontSize = '0'; // Hide text nodes

		for( let extraElement of this.showHideOptions.extraElements ) { // Hide extraElements
			if( typeof extraElement.showHideOriginalDisplay === 'undefined' )
				extraElement.showHideOriginalDisplay = window.getComputedStyle( extraElement ).display;

			extraElement.style.display = 'none';
			extraElement.style.visibility = 'hidden';
			extraElement.classList.remove( 'shown' );
			extraElement.classList.add( 'notshown' );
		}

		this.showHideOptions.linkElement.classList.remove( 'shown' );
		this.showHideOptions.linkElement.classList.add( 'notshown' );

		if( this.showHideOptions.showText ) {
			this.showHideOptions.linkTextNode.textContent = this.showHideOptions.showText;
		} else {
			if( resizeObserver )
				resizeObserver.unobserve( this );
			this.showHideOptions.linkElement.remove();
		}

		this.showHideOptions.state = 'hidden';
	};

	Element.prototype.showContent = function( event = false ) {
		if( this.showHideOptions.state === 'shown' )
			return;

		if( this.showHideOptions.onShow ) {
			if( false === this.showHideOptions.onShow( this, event ) )
				return;
		}

		for( let child of this.children ) { // Show elements
			if( child === this.showHideOptions.linkElement )
				continue;

			if( typeof child.showHideOriginalDisplay !== 'undefined' )
				child.style.display = child.showHideOriginalDisplay;
			child.style.visibility = 'visible';
		}

		this.style.fontSize = ''; // Show text nodes

		for( let extraElement of this.showHideOptions.extraElements ) { // Show extraElements
			if( typeof extraElement.showHideOriginalDisplay !== 'undefined' )
				extraElement.style.display = extraElement.showHideOriginalDisplay;
			extraElement.style.visibility = 'visible';

			extraElement.classList.remove( 'notshown' );
			extraElement.classList.add( 'shown' );
		}

		this.showHideOptions.linkElement.classList.remove( 'notshown' );
		this.showHideOptions.linkElement.classList.add( 'shown' );

		if( this.showHideOptions.hideText ) {
			this.showHideOptions.linkTextNode.textContent = this.showHideOptions.hideText;
		} else {
			if( resizeObserver )
				resizeObserver.unobserve( this );
			this.showHideOptions.linkElement.remove();
		}

		this.showHideOptions.state = 'shown';


		// Scroll Content into view
		if( this.showHideOptions.onShowScroll ) {
			this.showHideOptions.onShowScroll( this, event );
		} else {
			var offsetParent = this.showHideOptions.linkContainer.offsetParent;
			var linkContainer = this.showHideOptions.linkContainer;
			var element = linkContainer;
			while( offsetParent !== null && offsetParent !== document.body ) {
				offsetParent.scroll( { left: element.offsetLeft, top: element.offsetTop - ( offsetParent.clientHeight / 2 ), behavior: 'auto' } );
				if( window.getComputedStyle( offsetParent ).position === 'fixed' )
					break;

				element = offsetParent;
				offsetParent = offsetParent.offsetParent;
			}

			if( offsetParent === document.body ) {
				var linkContainerRect = linkContainer.getBoundingClientRect();
				window.scrollBy( { left: linkContainerRect.left, top: linkContainerRect.top - ( window.innerHeight / 2 ), behavior: 'auto' } );
			}
		}
	};

	Element.prototype.showHide = function( args ) {
		// TODO: Add width option

		if( document.readyState === 'loading' ) {
			if( !this.showHideLoadedEvent ) {
				var target = this;
				document.addEventListener( 'DOMContentLoaded', function() {
					target.showHide( args );
				}, true );
				this.showHideLoadedEvent = true;
			}
			return;
		}

		if( this.showHideOptions )
			return; //Do nothing if this element has already been processed
		
		this.showHideOptions = { 
			linkContainer: this,
			linkElement: null,
			extraElements: [],
			showText: 'Show Content',
			hideText: 'Hide Content',
			showOnHover: false,
			hideOnOffClick: false,
			subLinkQuery: false,
			hideOnSublinkClick: false,
			onShow: false,
			onShowScroll: false,
			onHide: false 
		};
		Object.assign( this.showHideOptions, args );

		if( this.showHideOptions.linkElement === null ) {
			this.showHideOptions.linkElement = document.createElement( 'span' );
			this.showHideOptions.linkElement.classList.add( 'showHideText' );
		}

		this.showHideOptions.linkTextNode = null;
		for( let childNode of this.showHideOptions.linkElement.childNodes ) {
			if( childNode.nodeType === Node.TEXT_NODE ) {
				this.showHideOptions.linkTextNode = childNode;
				break;
			}
		}

		if( this.showHideOptions.linkTextNode === null ) {
			this.showHideOptions.linkTextNode = document.createTextNode('');
			this.showHideOptions.linkElement.appendChild( this.showHideOptions.linkTextNode );
		}

		for( let extraElement of this.showHideOptions.extraElements )
			extraElement.showHideParent = this;

		this.showHideOptions.linkElement.style.msUserSelect = 'none';
		this.showHideOptions.linkElement.style.mozUserSelect = 'none';
		this.showHideOptions.linkElement.style.webkitUserSelect = 'none';
		this.showHideOptions.linkElement.style.userSelect = 'none';

		//Prepend linkElement if it is not a direct decendant of linkContainer
		if( this.showHideOptions.linkElement.parentElement !== this.showHideOptions.linkContainer )
			this.showHideOptions.linkContainer.prepend( this.showHideOptions.linkElement );

		//Calculate linkElement font size based on M height (ems).
		this.showHideOptions.linkElement.append( mLine );
		this.showHideOptions.linkElement.style.fontSize = mLine.clientHeight + 'px';
		mLine.remove();

		var subLinks = [];
		if( this.showHideOptions.subLinkQuery ) {
			subLinks.push( ...this.querySelectorAll( ':scope ' + this.showHideOptions.subLinkQuery ) );
			for( let extraElement of this.showHideOptions.extraElements ) {
				subLinks.push( ...extraElement.querySelectorAll( ':scope ' + this.showHideOptions.subLinkQuery ) );
			}
			var linkElementIndex = subLinks.indexOf( this.showHideOptions.linkElement );
			if( linkElementIndex !== -1 )
				subLinks = [ ...subLinks.slice( 0, linkElementIndex ), ...subLinks.slice( linkElementIndex + 1 ) ];
		}

		if( this.showHideOptions.hideOnSublinkClick ) {
			var target = this;
			var hideOnSublinkClickListener = function( e ) {
				console.log( e );
				target.hideContent( e );
			};
			for( let subLink of subLinks ) {
				if( !subLink.getAttribute( 'href' ) || subLink.getAttribute( 'href' ) === '#' )
					continue;

				subLink.addEventListener( 'click', hideOnSublinkClickListener, true );
			}
		}

		this.hideContent();
		this.showHideOptions.state = 'hidden';

		// Add click event for showing and hiding the content
		var clickListener = function( e ) {
			e.preventDefault();
			let target = e.target.parentElement;
			let i = 0;
			while( !target.showHideOptions && i < 3 ) {
				target = target.parentElement;
				i++;
			}

			var showHideOptions = target.showHideOptions;
			if( showHideOptions.state && showHideOptions.state === 'hidden' ) {
				target.showContent( e );
				if( showHideOptions.hideText && showHideOptions.hideOnOffClick ) {
					var hideOnOffClickListener = function( ee ) {
						var element = ee.target;
						while( element ) {
							if( showHideOptions.linkContainer === element
								|| ( showHideOptions.extraElements.length && showHideOptions.extraElements.indexOf( element ) !== -1 ) )
								return;
							element = element.parentElement;
						}

						target.hideContent();
						document.removeEventListener( 'click', hideOnOffClickListener, true );
					};
					document.addEventListener( 'click', hideOnOffClickListener, true );
				}
			} else {
				target.hideContent( e );
			}
		};
		this.showHideOptions.linkElement.addEventListener( 'click', clickListener );

		// Add hover events for showing and hiding the content. Hover events are not supported when using the extraElements option.
		if( this.showHideOptions.showOnHover && !this.showHideOptions.extraElements.length ) {
			this.showHideOptions.linkContainer.addEventListener( 'mouseenter', function( e ) {
				e.target.showHideOptions.linkElement.removeEventListener( 'click', clickListener ); // Prevent click events if hover is supported
				e.target.showContent( e );
				if( e.target.showHideOptions.hideText && e.target.showHideOptions.hideOnOffClick ) {
					e.target.addEventListener( 'mouseleave', function( ee ) {
						e.target.hideContent();
					}, { once: true } );
				}
			} );
		}

		// Handle resize events
		if( resizeObserver )
			resizeObserver.observe( this );
		else
			resizeEntries.push( this );
		
		for( let extraElement of this.showHideOptions.extraElements ) {
			if( resizeObserver )
				resizeObserver.observe( extraElement );
			else
				resizeEntries.push( extraElement );
		}
	};

	Element.prototype.showHideNav = function( args ) {
		if( this.showHideNavOptions )
			return; //Do nothing if this element has already been processed
		
		this.showHideNavOptions = { 
			linkQuery: false,
			showOnHover: true,
			hideOnOffClick: true,
			subLinkQuery: false,
			hideOnSublinkClick: false,
			onShow: function() { console.log( 'onShow' ) },
			onHide: function() { console.log( 'onHide' ) }
		};
		Object.assign( this.showHideNavOptions, args );

		if( !this.showHideNavOptions.linkQuery ) {
			var firstLink = this.querySelector( 'A' );
			this.showHideNavOptions.linkQuery = 'A';

			var parentElement = firstLink.parentElement;
			while( parentElement && parentElement !== this ) {
				this.showHideNavOptions.linkQuery = parentElement.tagName + '>' + this.showHideNavOptions.linkQuery;
				parentElement = parentElement.parentElement;
			}
		}

		var linkElements = Array.from( this.querySelectorAll( ':scope > ' + this.showHideNavOptions.linkQuery ) );
		linkElements = linkElements.filter( function( linkElement ) {
			if( !linkElement.nextElementSibling )
				return false;

			linkElement.removeAttribute( 'href' );
			return true;
		} );

		for( let linkElement of linkElements ) {
			var showHideArgs = { 
				linkElement: linkElement,
				showText: linkElement.textContent,
				hideText: linkElement.textContent,
				showOnHover: this.showHideNavOptions.showOnHover,
				hideOnOffClick: this.showHideNavOptions.hideOnOffClick,
				subLinkQuery: this.showHideNavOptions.subLinkQuery,
				hideOnSublinkClick: this.showHideNavOptions.hideOnSublinkClick,
				onShow: this.showHideNavOptions.onShow,
				onHide: this.showHideNavOptions.onHide
			};

			linkElement.parentElement.showHide( showHideArgs );
		}
	};
})();
