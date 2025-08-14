(function() {
	'use strict';

	/**
	 * Utilities
	 */
	const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
	const deviceRatio = () => Math.max(1, Math.min(2, window.devicePixelRatio || 1));

	/**
	 * Load an image as a Promise with decoding
	 */
	function loadImage(src) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.loading = 'lazy';
			img.src = src;
			img.decode ? img.decode().then(() => resolve(img)).catch(() => resolve(img)) : img.onload = () => resolve(img);
			img.onerror = reject;
		});
	}

	/**
	 * Comparison component
	 */
	class CanvasCompare {
		constructor(root) {
			this.root = root;
			this.canvas = root.querySelector('.compare-canvas');
			this.range = root.querySelector('.compare-range');
			this.handle = root.querySelector('.handle');
			this.ctx = this.canvas.getContext('2d');
			this.beforeSrc = root.getAttribute('data-before');
			this.afterSrc = root.getAttribute('data-after');
			this.ratio = deviceRatio();
			this.images = { before: null, after: null };
			this._unsub = [];
			this._dragging = false;
			this._value = Number(this.range.value);
			this._initLazy();
		}

		_initLazy() {
			const onEnter = async () => {
				await this._load();
				this._bind();
				this._draw();
			};
			const io = new IntersectionObserver((entries) => {
				entries.forEach(e => {
					if (e.isIntersecting) {
						io.disconnect();
						onEnter();
					}
				});
			}, { rootMargin: '200px' });
			io.observe(this.root);
		}

		async _load() {
			const [before, after] = await Promise.all([
				loadImage(this.beforeSrc),
				loadImage(this.afterSrc)
			]);
			this.images.before = before;
			this.images.after = after;
			this._resizeCanvas();
		}

		_bind() {
			const onResize = () => { this._resizeCanvas(); this._draw(); };
			window.addEventListener('resize', onResize, { passive: true });
			this._unsub.push(() => window.removeEventListener('resize', onResize));

			const onInput = () => { this._value = Number(this.range.value); this._draw(); };
			this.range.addEventListener('input', onInput);
			this._unsub.push(() => this.range.removeEventListener('input', onInput));

			// Pointer dragging on the canvas area
			const startDrag = (ev) => {
				this._dragging = true;
				updateFromPointer(ev);
			};
			const moveDrag = (ev) => {
				if (!this._dragging) return;
				updateFromPointer(ev);
			};
			const endDrag = () => { this._dragging = false; };

			const updateFromPointer = (ev) => {
				const rect = this.canvas.getBoundingClientRect();
				const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
				const pct = clamp((x / rect.width) * 100, 0, 100);
				this.range.value = String(pct);
				this._value = pct;
				this._draw();
			};

			this.root.addEventListener('pointerdown', startDrag);
			window.addEventListener('pointermove', moveDrag);
			window.addEventListener('pointerup', endDrag);
			this.root.addEventListener('touchstart', startDrag, { passive: true });
			window.addEventListener('touchmove', moveDrag, { passive: true });
			window.addEventListener('touchend', endDrag, { passive: true });
			this._unsub.push(() => {
				this.root.removeEventListener('pointerdown', startDrag);
				window.removeEventListener('pointermove', moveDrag);
				window.removeEventListener('pointerup', endDrag);
				this.root.removeEventListener('touchstart', startDrag);
				window.removeEventListener('touchmove', moveDrag);
				window.removeEventListener('touchend', endDrag);
			});

			// Double tap to center
			let lastTap = 0;
			this.root.addEventListener('click', (e) => {
				const now = Date.now();
				if (now - lastTap < 300) {
					this.range.value = '50';
					this._value = 50; this._draw();
				}
				lastTap = now;
			});
		}

		_resizeCanvas() {
			const rect = this.canvas.getBoundingClientRect();
			const ratio = deviceRatio();
			if (this.canvas.width !== Math.round(rect.width * ratio)) {
				this.canvas.width = Math.round(rect.width * ratio);
				this.canvas.height = Math.round(rect.height * ratio);
				this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
			}
		}

		_draw() {
			if (!this.images.before || !this.images.after) return;
			const { width, height } = this.canvas;
			const ratio = deviceRatio();
			const w = Math.floor(width / ratio);
			const h = Math.floor(height / ratio);

			// Clear
			this.ctx.clearRect(0, 0, w, h);

			// Draw after full, then clip before
			this._drawCover(this.images.after, 0, 0, w, h);

			const clipW = (this._value / 100) * w;
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.rect(0, 0, clipW, h);
			this.ctx.clip();
			this._drawCover(this.images.before, 0, 0, w, h);
			this.ctx.restore();

			// Update handle position
			const left = `${this._value}%`;
			this.handle.style.left = left;
		}

		_drawCover(img, dx, dy, dw, dh) {
			// cover algorithm like background-size: cover
			const ir = img.width / img.height;
			const cr = dw / dh;
			let rw, rh, sx, sy, sw, sh;
			if (ir > cr) {
				rh = dh; rw = rh * ir;
				sx = (rw - dw) / 2; sy = 0; sw = dw; sh = dh;
				this.ctx.drawImage(img, -sx, 0, rw, rh);
			} else {
				rw = dw; rh = rw / ir;
				sx = 0; sy = (rh - dh) / 2; sw = dw; sh = dh;
				this.ctx.drawImage(img, 0, -sy, rw, rh);
			}
		}
	}

	/**
	 * Init all comparisons
	 */
	document.addEventListener('DOMContentLoaded', () => {
		const wraps = Array.from(document.querySelectorAll('.canvas-wrap'));
		wraps.forEach(wrap => new CanvasCompare(wrap));
	});
})();