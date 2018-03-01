	class Router {
		constructor ({active = true, callback = function () {}, css = {current: "dr-current", hidden: "dr-hidden"}, ctx = document.body, start = null, delimiter = "/", logging = false, stop = true} = {}) {
			this.active = active;
			this.callback = callback;
			this.css = css;
			this.ctx = ctx;
			this.start = start;
			this.delimiter = delimiter;
			this.history = [];
			this.logging = logging;
			this.routes = [];
			this.stop = stop;
		}

		current () {
			return this.history[0];
		}

		hashchange (ev) {
			const self = this,
				oldHash = includes(ev.oldURL, "#") ? ev.oldURL.replace(not_hash, "") : null,
				newHash = includes(ev.newURL, "#") ? ev.newURL.replace(not_hash, "") : null;

			if (this.active) {
				if (this.stop === true && typeof ev.stopPropagation === "function") {
					ev.stopPropagation();

					if (typeof ev.preventDefault === "function") {
						ev.preventDefault();
					}
				}

				if (!includes(this.routes, newHash)) {
					this.route(this.routes.filter(i => includes(i, newHash))[0] || this.start);
				} else {
					render(() => {
						let oldHashes = oldHash ? oldHash.split(self.delimiter) : [];
						let newHashes = newHash.split(self.delimiter);
						let newEl, newTrigger;

						newHashes.forEach((i, idx) => {
							let nth = idx + 1;
							let valid = oldHashes.length >= nth;
							let oldEl = valid ? self.select("#" + oldHashes.slice(0, nth).join(" > #"))[0] : null;
							let oldTrigger = valid ? self.select("a[href='#" + oldHashes.slice(0, nth).join(self.delimiter) + "']")[0] : null;

							newEl = self.select("#" + newHashes.slice(0, nth).join(" > #"))[0];
							newTrigger = self.select("a[href='#" + newHashes.slice(0, nth).join(self.delimiter) + "']")[0];

							self.load(oldTrigger || null, oldEl || null, newTrigger || null, newEl || null);
						}, this);

						if (self.css.current && self.history.length > 0) {
							self.history[0].trigger.classList.remove(self.css.current);
						}

						let r = new Route({element: newEl || null, hash: newHash, trigger: newTrigger || null});

						self.log(r);
						self.callback(r);
					});
				}
			}
		}

		load (oldTrigger, oldEl, newTrigger, newEl) {
			if (oldTrigger && this.css.current) {
				oldTrigger.classList.remove(this.css.current);
			}

			if (oldEl && oldEl.id !== newEl.id) {
				oldEl.classList.add(this.css.hidden);
			}

			if (newTrigger && this.css.current) {
				newTrigger.classList.add(this.css.current);
			}

			if (newEl) {
				this.sweep(newEl, this.css.hidden);
			}

			return this;
		}

		log (arg) {
			if (this.logging) {
				this.history.unshift(arg);
			}

			return this;
		}

		route (arg = "") {
			document.location.hash = arg;

			return this;
		}

		select (arg) {
			return from(this.ctx.querySelectorAll.call(this.ctx, arg));
		}

		scan (arg) {
			this.routes = this.select("a").filter(i => includes(i.href, "#")).map(i => i.href.replace(not_hash, ""));
			this.start = arg || this.routes[0] || null;

			return this;
		}

		sweep (obj, klass) {
			from(obj.parentNode.childNodes).filter(i => i.nodeType === 1 && i.id && i.id !== obj.id).forEach(i => i.classList.add(klass));
			obj.classList.remove(klass);

			return this;
		}
	}

	function factory (arg) {
		const obj = new Router(arg),
			hash = document.location.hash.replace("#", ""),
			facade = ev => obj.hashchange.call(obj, ev);

		if ("addEventListener" in window) {
			window.addEventListener("hashchange", facade, false);
		} else {
			window.onhashchange = facade;
		}

		obj.scan(obj.start);

		if (!has(obj.css.hidden, obj.ctx.classList)) {
			if (hash !== "" && includes(obj.routes, hash)) {
				obj.hashchange({oldURL: "", newURL: document.location.hash});
			} else {
				obj.route(obj.start);
			}
		}

		return obj;
	}

	factory.version = "{{VERSION}}";
