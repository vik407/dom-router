class Router {
	constructor () {
		this.active = true;
		this.callback = () => {};
		this.css = { current: "current", hidden: "hidden" };
		this.ctx = document.body;
		this[ "default" ] = null;
		this.delimiter = "/";
		this.history = [];
		this.logging = false;
		this.routes = [];
		this.stop = true;
	}

	current () {
		return this.history[ 0 ];
	}

	hashchange ( ev ) {
		let self = this;
		let oldHash = contains( ev.oldURL, "#" ) ? ev.oldURL.replace( not_hash, "" ) : null;
		let newHash = contains( ev.newURL, "#" ) ? ev.newURL.replace( not_hash, "" ) : null;

		if ( this.active ) {
			if ( this.stop === true && typeof ev.preventDefault == "function" ) {
				ev.preventDefault();
				ev.stopPropagation();
			}

			if ( !contains( this.routes, newHash ) ) {
				return this.route( this.routes.filter( ( i ) => {
					return contains(i, newHash );
				} )[0] || this["default"] );
			}

			render( () => {
				let oldHashes = oldHash ? oldHash.split( self.delimiter ) : [];
				let newHashes = newHash.split( self.delimiter );
				let newEl, newTrigger;

				newHashes.forEach( ( i, idx ) => {
					let nth = idx + 1;
					let valid = oldHashes.length >= nth;
					let oldEl = valid ? self.select( "#" + oldHashes.slice( 0, nth ).join( " > #" ) )[ 0 ] : null;
					let oldTrigger = valid ? self.select( "a[href='#" + oldHashes.slice( 0, nth ).join( self.delimiter ) + "']" )[ 0 ] : null;

					newEl = self.select( "#" + newHashes.slice( 0, nth ).join( " > #" ) )[ 0 ];
					newTrigger = self.select( "a[href='#" + newHashes.slice( 0, nth ).join( self.delimiter ) + "']" )[ 0 ];

					self.load( oldTrigger || null, oldEl || null, newTrigger || null, newEl || null );
				}, this );

				if ( self.css.current && self.history.length > 0 ) {
					self.history[ 0 ].trigger.classList.remove( self.css.current );
				}

				let r = route( { element: newEl || null, hash: newHash, trigger: newTrigger || null } );
				self.log( r );
				self.callback( r );
			} );
		}
	}

	load ( oldTrigger, oldEl, newTrigger, newEl ) {
		if ( oldTrigger && this.css.current ) {
			oldTrigger.classList.remove( this.css.current );
		}

		if ( oldEl && oldEl.id !== newEl.id ) {
			oldEl.classList.add( this.css.hidden );
		}

		if ( newTrigger && this.css.current ) {
			newTrigger.classList.add( this.css.current );
		}

		if ( newEl ) {
			this.sweep( newEl, this.css.hidden );
		}

		return this;
	}

	log ( arg ) {
		if ( this.logging ) {
			this.history.unshift( arg );
		}

		return this;
	}

	route ( arg ) {
		document.location.hash = arg;
		return this;
	}

	select ( arg ) {
		return Array.from( this.ctx.querySelectorAll.call( this.ctx, arg ) );
	}

	scan ( arg ) {
		this.routes = this.select( "a" ).filter( ( i ) => {
			return contains( i.href, "#" );
		} ).map( ( i ) => {
			return i.href.replace( not_hash, "" );
		} );

		this[ "default" ] = arg || this.routes[ 0 ];
		return this;
	}

	sweep ( obj, klass ) {
		Array.from( obj.parentNode.childNodes ).filter( ( i ) => {
			return i.nodeType === 1 && i.id && i.id !== obj.id;
		} ).forEach( ( i ) => {
			i.classList.add( klass );
		}, this );

		obj.classList.remove( klass );
		return this;
	}
}

let router = ( arg ) => {
	let r = new Router(),
		hash = document.location.hash.replace( "#", "" );

	let facade = ( ev ) => {
		r.hashchange.call( r, ev );
	}

	if ( "addEventListener" in window ) {
		window.addEventListener( "hashchange", facade, false );
	}
	else {
		window.onhashchange = facade;
	}

	if ( arg instanceof Object ) {
		r.active = arg.active !== undefined ? ( arg.active === true ) : r.active;
		r.callback = arg.callback || r.callback;
		r.css = arg.css || r.css;
		r.ctx = arg.ctx && typeof arg.ctx.querySelectorAll == "function" ? arg.ctx : r.ctx;
		r.delimiter = arg.delimiter || r.delimiter;
		r.logging = arg.logging !== undefined ? ( arg.logging === true ) : r.logging;
		r.stop = arg.stop !== undefined ? ( arg.stop === true ) : r.stop;
	}

	r.scan( r[ "default" ] );

	if ( !( r.css.hidden in r.ctx.classList ) ) {
		if ( hash !== "" && contains( r.routes, hash ) ) {
			r.hashchange( {oldURL: "", newURL: document.location.hash} );
		}
		else {
			r.route( r[ "default" ] );
		}
	}

	return r;
}
