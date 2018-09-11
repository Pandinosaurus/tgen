(function (fn) {

	var tgen = window[fn];


	// fill a layer
	tgen.effect('fill', {
		blend: "",
		rgba: "randomalpha"
	}, function ($g, params) {

		$g.shape.rect($g, 1, 1, $g.texture.width, $g.texture.height);

		return params;

	});


	// noise
	tgen.effect('noise', {
		blend: "lighten",
		mode: 'monochrome', // monochrome or color
		channels: [255,255,255], // max rgb per channels in color mode
		opacity: 128,		
		seed: [1, 262140]
	}, function ($g, params) {

		switch (params.mode) {

			case 'color':
				$g.walk(function (color) {
					
					var r = params.channels[0] ? $g.randIntSeed(0, params.channels[0]) : 0;
					var g = params.channels[1] ? $g.randIntSeed(0, params.channels[1]) : 0;
					var b = params.channels[2] ? $g.randIntSeed(0, params.channels[2]) : 0;
					color = [r, g, b, params.opacity];
					return color;

				});
				break;

			case 'monochrome':
				$g.walk(function (color) {
					var rnd = $g.randIntSeed(0, 255);
					color = [rnd, rnd, rnd, params.opacity];
					return color;
				});
				break;

			case 'colorize':
				$g.walk(function (color) {
					color = $g.point.colorize(color, params.rgba);
					return color;
				});
				break;

		}

		return params;

	});


	// spheres
	tgen.effect('spheres', {
		blend: "lighten",
		rgba: "random",
		origin: "random",
		dynamic: false,
		count: 21,
		size: [20, 70],
		seed: [1, 262140]
	}, function ($g, params) {

		for (var i = 0; i < params.count; i++) {

			var xys = $g.xysize(i, params);
			$g.shape.sphere($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true, params.rgba, params.dynamic);

		}

		return params;

	});


	// pyramids
	tgen.effect('pyramids', {
		blend: "lighten",
		rgba: "random",
		origin: "random",
		dynamic: false,
		count: 21,
		size: [21, 100],
		seed: [1, 262140]
	}, function ($g, params) {

		for (var i = 0; i < params.count; i++) {

			var xys = $g.xysize(i, params);
			$g.shape.pyramid($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), $g.percentXY(xys.size), true, params.rgba, params.dynamic);

		}

		return params;

	});


	// squares
	tgen.effect('squares', {
		blend: "lighten",
		rgba: "random",
		origin: "random",
		count: [4, 7],
		size: [2, 50],
		seed: [1, 262140]
	}, function ($g, params) {

		for (var i = 0; i < params.count; i++) {

			var xys = $g.xysize(i, params);
			$g.shape.rect($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), $g.percentXY(xys.size), false);


		}

		return params;

	});


	// circles
	tgen.effect('circles', {
		blend: "lighten",
		rgba: "random",
		origin: "random",
		count: 21,
		size: [1, 15],
		seed: [1, 262140]
	}, function ($g, params) {

		for (var i = 0; i < params.count; i++) {

			var xys = $g.xysize(i, params);
			$g.shape.circle($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true);

		}

		return params;

	});


	// lines
	tgen.effect('lines', {
		blend: "opacity",
		rgba: "random",
		size: [100, 200],
		count: [100, 400],
		freq1s: [21, 150],
		freq1c: [21, 150],
		freq2s: [21, 150],
		freq2c: [21, 150]
	}, function ($g, params) {

		params.freq1s = $g.randByArraySeed(params.freq1s, true);
		params.freq1c = $g.randByArraySeed(params.freq1c, true);
		params.freq2s = $g.randByArraySeed(params.freq2s, true);
		params.freq2c = $g.randByArraySeed(params.freq2c, true);
		params.size = $g.randByArraySeed(params.size);

		for (var i = 0; i < params.count; i++) {

			var x1 = $g.texture.width / 2 + Math.sin(i / params.freq1s * $g.calc.pi) * params.size;
			var y1 = $g.texture.height / 2 + Math.cos(i / params.freq1c * $g.calc.pi) * params.size;
			var x2 = $g.texture.width / 2 + Math.sin(i / params.freq2s * $g.calc.pi) * params.size;
			var y2 = $g.texture.height / 2 + Math.cos(i / params.freq2c * $g.calc.pi) * params.size;

			$g.shape.line($g, x1, y1, x2, y2);

		}

		return params;

	});


	// lines2
	tgen.effect('lines2', {
		blend: ["opacity", "lighten", "screen"],
		rgba: "random",
		type: "vertical",
		size: [0.1, 12],
		count: [2, 32],
		seed: [1, 262140]
	}, function ($g, params) {

		var item = null;

		for (var i = 0; i < params.count; i++) {

			if (params.elements != undefined) {

				item = params.elements[i];

			} else {

				item = {
					size: $g.randByArraySeed(params.size, true),
					d: $g.randRealSeed(0.1, 100)
				}

			}

			if (params.type == 'vertical') {
				$g.shape.rect($g, $g.percentX(item.d), 0, $g.percentX(item.size), $g.texture.height);
			} else {
				$g.shape.rect($g, 0, $g.percentX(item.d), $g.texture.width, $g.percentX(item.size));
			}

		}

		return params;

	});


	// subplasma - aDDict2
	tgen.effect('subplasma', {
		seed: [1, 262140],
		size: [3, 4],
		rgba: "random"
	}, function ($g, params) {

		params.size = $g.randByArray(params.size);

		var np = 1 << params.size;
		var rx = $g.texture.width;
		var ry = rx;
		var buffer = [];
		var x, y;

		if (np > rx) {
			np = rx;
		}

		var ssize = rx / np;

		for (y = 0; y < np; y++) {
			for (x = 0; x < np; x++) {
				buffer[x * ssize + y * ssize * rx] = $g.calc.randomseed();
			}
		}

		for (y = 0; y < np; y++) {
			for (x = 0; x < rx; x++) {
				var p = x & (~(ssize - 1));
				var zy = y * ssize * rx;
				buffer[x + zy] = $g.calc.interpolate.catmullrom(
					buffer[((p - ssize * 1) & (rx - 1)) + zy],
					buffer[((p - ssize * 0) & (rx - 1)) + zy],
					buffer[((p + ssize * 1) & (rx - 1)) + zy],
					buffer[((p + ssize * 2) & (rx - 1)) + zy],
					x % ssize, ssize);
			}
		}

		for (y = 0; y < ry; y++) {
			for (x = 0; x < rx; x++) {
				var p = y & (~(ssize - 1));
				buffer[x + y * rx] = $g.calc.interpolate.catmullrom(
					buffer[x + ((p - ssize * 1) & (ry - 1)) * rx],
					buffer[x + ((p - ssize * 0) & (ry - 1)) * rx],
					buffer[x + ((p + ssize * 1) & (ry - 1)) * rx],
					buffer[x + ((p + ssize * 2) & (ry - 1)) * rx],
					y % ssize, ssize);
			}
		}

		// colorize
		for (x = 0; x < $g.texture.width; x++) {
			for (y = 0; y < $g.texture.height; y++) {

				var color = 255 * buffer[x + y * rx];
				$g.point.rgba = $g.point.colorize(params.rgba, [color, color, color, 255]);
				$g.point.set(x, y);

			}
		}

		return params;

	});


	// waves
	tgen.effect('waves', {
		blend: "opacity",
		rgba: "random",
		level: 50,
		xsines: [1, 10],
		ysines: [1, 10]
	}, function ($g, params) {


		if (params.xsines === undefined) {
			params.xsines = $g.randIntSeed(1, 10);
		} else if (typeof params.xsines == 'object') {
			params.xsines = $g.randIntSeed(params.xsines[0], params.xsines[1]);
		}

		if (params.ysines === undefined) {
			params.ysines = $g.randIntSeed(1, 10);
		} else if (typeof params.ysines == 'object') {
			params.ysines = $g.randIntSeed(params.ysines[0], params.ysines[1]);
		}

		if (params.rgba === undefined) {
			var o = (params.opacity !== undefined) ? params.opacity : 255;
			params.rgba = $g.rgba([
				[0, 255],
				[0, 255],
				[0, 255],
				o
			]);
		}


		for (var x = 0; x < $g.texture.width; x++) {
			for (var y = 0; y < $g.texture.height; y++) {

				var c = 127 + 63.5 * Math.sin(x / $g.texture.width * params.xsines * 2 * $g.calc.pi) + 63.5 * Math.sin(y / $g.texture.height * params.ysines * 2 * $g.calc.pi);
				if (typeof params.channels == "object") {
					$g.point.rgba = [params.channels[0] ? c : 0, params.channels[1] ? c : 0, params.channels[2] ? c : 0, params.channels[3] ? c : 0];
				} else {
					$g.point.rgba = $g.point.colorize([c, c, c, 255], params.rgba, params.level);
				}

				$g.point.set(x, y);

			}
		}

		return params;

	});


	// crosshatch
	tgen.effect('crosshatch', {
		blend: "opacity",
		level: 50
	}, function ($g, params) {


		if (params.xadjust == undefined) {
			params.xadjust = $g.randIntSeed(1, 10);
		}
		if (params.yadjust === undefined) {
			params.yadjust = $g.randIntSeed(1, 10);
		}
		if (params.rgba === undefined) {
			params.rgba = [$g.randIntSeed(0, 255), $g.randIntSeed(0, 255), $g.randIntSeed(0, 255), 255];
		}


		for (var x = 0; x < $g.texture.width; x++) {
			for (var y = 0; y < $g.texture.height; y++) {

				var c = 127 + 63.5 * Math.sin(x * x / params.xadjust) + 63.5 * Math.cos(y * y / params.yadjust);
				$g.point.rgba = $g.point.colorize([c, c, c, 255], params.rgba, params.level);
				$g.point.set(x, y);

			}
		}


		return params;

	});


	// clouds - midpoint displacement
	tgen.effect('clouds', {
		blend: "opacity",
		rgba: "random",
		seed: [1, 262140],
		roughness: [2, 16],
		colormap: null
	}, function ($g, params) {

		params.roughness = $g.randByArraySeed(params.roughness);

		var width = $g.texture.width;
		var height = $g.texture.height;
		var map = [];

		var generateMap = function () {
			for (var x = 0; x <= width; x++) {
				map[x] = [];
				for (var y = 0; y <= height; y++) {
					map[x][y] = 0;
				}
			}
		}

		var mapV = function (x, y, value) {

			x = Math.round(x);
			y = Math.round(y);

			if (x < 0) {
				x = width + x;
			}

			if (x >= width) {
				x = x - width;
			}

			if (y < 0) {
				y = height + y;

			}

			if (y >= height) {
				y = y - height;
			}

			if (value !== undefined) {
				return map[x][y] = value;
			} else {
				return map[x][y];
			}

		}

		var displace = function (num) {
			return ($g.calc.randomseed() - 0.5) * (num / (width + width) * params.roughness);
		}

		var generateCloud = function (step) {

			var stepHalf = (step / 2);
			if (stepHalf <= 1) {
				return params;
			}

			for (var i = stepHalf - stepHalf; i <= (width + stepHalf); i += stepHalf) {
				for (var j = stepHalf - stepHalf; j <= (height + stepHalf); j += stepHalf) {

					var topLeft = mapV(i - stepHalf, j - stepHalf);
					var topRight = mapV(i, j - stepHalf);
					var bottomLeft = mapV(i - stepHalf, j);
					var bottomRight = mapV(i, j);

					var x = i - (stepHalf / 2);
					var y = j - (stepHalf / 2);

					// center
					var center = mapV(x, y, $g.calc.normalize1((topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(step)));

					// left
					var xx = i - (step) + (stepHalf / 2);
					mapV(i - stepHalf, y, $g.calc.normalize1((topLeft + bottomLeft + center + mapV(xx, y)) / 4 + displace(step)));

					// top
					var yy = j - (step) + (stepHalf / 2);
					mapV(x, j - stepHalf, $g.calc.normalize1((topLeft + topRight + center + mapV(x, yy)) / 4 + displace(step)));

				}

			}

			generateCloud(stepHalf);

		}

		// init random seeder
		$g.calc.randomseed(params.seed);

		// generate empty map
		generateMap();

		// generate cloud
		generateCloud(width);

		// render colormap
		$g.colormap.init(params.colormap, 255, function (cmap) {
			params.colormap = cmap;
		});

		// colorize
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {

				var color = parseInt(255 * map[x][y], 10);

				if ($g.colormap.data !== null) {
					$g.point.rgba = $g.colormap.get(color, params.rgba);
				} else {
					$g.point.rgba = $g.point.colorize(params.rgba, [color, color, color, 255]);
				}

				$g.point.set(x, y);

			}
		}

		return params;

	});


	// colorbar
	tgen.effect('colorbar', {
		type: "horizontal",
		colormap: "random",
		mirror: true
	}, function ($g, params) {

		var width = $g.texture.width;
		var height = $g.texture.height;

		// render colormap
		var size = (params.type == 'horizontal') ? width : height;
		var colormap = $g.colormap.init(params.colormap, size, function (cmap) {
			params.colormap = cmap;
		});

		if (params.type == 'horizontal') {

			for (var x = 0; x < width; x++) {

				if (params.mirror) {
					var q = (x < width / 2) ? x * 2 : (width * 2) - (x * 2);
					$g.point.rgba = $g.colormap.get(q);
				} else {
					$g.point.rgba = $g.colormap.get(q);
				}

				for (var y = 0; y < height; y++) {
					$g.point.set(x, y);
				}

			}

		} else {

			for (var y = 0; y < height; y++) {

				if (params.mirror) {
					var q = (y < height / 2) ? y * 2 : (height * 2) - (y * 2);
					$g.point.rgba = $g.colormap.get(q);
				} else {
					$g.point.rgba = $g.colormap.get(q);
				}


				for (var x = 0; x < width; x++) {
					$g.point.set(x, y);
				}

			}

		}


		return params;

	});


	// checkerboard
	tgen.effect('checkerboard', {
		size: [
			[2, 32],
			[2, 32]
		],
		rgba: "randomalpha"
	}, function ($g, params) {

		var width = $g.texture.width;
		var height = $g.texture.height;

		if (typeof params.size == 'object') {

			var sizeX = params.size[0] = $g.randByArraySeed(params.size[0]);
			var sizeY = params.size[1] = $g.randByArraySeed(params.size[1]);

		} else {
			var sizeX = params.size;
			var sizeY = params.size;
		}

		var cellX = width / sizeX;
		var cellY = height / sizeY;

		var drawCell = function (offsetX, offsetY) {
			for (var x = 0; x < cellX; x++) {
				for (var y = 0; y < cellY; y++) {
					if (x + offsetX < width && y + offsetY < height) {
						$g.point.set(x + offsetX, y + offsetY);
					}
				}
			}
		};

		for (var cx = 0; cx < sizeX; cx++) {
			if (cx % 2 == 0) {
				for (var cy = 0; cy < sizeY; cy++) {
					if (cy % 2 == 0) {
						drawCell(cx * cellX, cy * cellY);
					} else {
						drawCell(cx * cellX + cellX, cy * cellY);
					}
				}
			}
		}

		return params;

	});


	// dotsdots
	tgen.effect('dots', {
		blend: "opacity",
		gridX: [2, 64],
		gridY: [2, 64],
		size: [1, 250],
		seed: [1, 262140],
		rgba: "randomalpha",
		shape: "sphere",
		dynamic: true,
		xsines: [1, 16],
		ysines: [1, 16]
	}, function ($g, params) {

		params.gridX = $g.randByArray(params.gridX);
		params.gridY = $g.randByArray(params.gridY);		

		if (params.xsines === undefined) {
			params.xsines = $g.randInt(1, 10);
		} else if (typeof params.xsines == 'object') {
			params.xsines = $g.randInt(params.xsines[0], params.xsines[1]);
		}

		if (params.ysines === undefined) {
			params.ysines = $g.randInt(1, 10);
		} else if (typeof params.ysines == 'object') {
			params.ysines = $g.randInt(params.ysines[0], params.ysines[1]);
		}

		var percent = $g.randByArraySeed(params.size) / 100;
		var width = $g.texture.width;
		var height = $g.texture.height;
		var stepX = ((width) / params.gridX);
		var stepY = ((height) / params.gridY);
		var halfstepX = (stepX / 2);
		var halfstepY = (stepY / 2);

		for (var gx = 1; gx <= params.gridX; gx++) {
			for (var gy = 1; gy <= params.gridY; gy++) {

				//var percent = $g.randByArraySeed(params.size) / 100;
				//var size = (percent * (stepX + stepY) / 2);

				var m = (percent * (stepX + stepY) / 2 / 2);

				var size = m - (m / 2) * Math.sin(gx / params.gridX * params.xsines * 2 * $g.calc.pi) + (m / 2) * Math.sin(gy / params.gridY * params.ysines * 2 * $g.calc.pi);

				switch (params.shape) {

					case 'sphere':
						$g.shape.sphere($g, (gx * stepX) - halfstepX, (gy * stepY) - halfstepY, size * 2, true, params.rgba, params.dynamic);
						break;
					case 'pyramid':
						$g.shape.pyramid($g, (gx * stepX) - halfstepX, (gy * stepY) - halfstepY, size, size, true, params.rgba, params.dynamic);
						break;
					case 'rect':
						$g.shape.rect($g, (gx * stepX) - halfstepX, (gy * stepY) - halfstepY, size, size, true, params.rgba, params.dynamic);
						break;
					default:
						size = size / 2;
						$g.shape.circle($g, (gx * stepX) - halfstepX, (gy * stepY) - halfstepY, size, true);
						break;

				}

			}
		}

		return params;

	});


	// fractal [UNDER DEVELOPMENT]
	tgen.effect('mandelbrot', {
		blend: "opacity",
		rgba: "randomalpha",
		seed: [1, 262140],
		iteration: [8, 512],
		skip: [0, 8]
	}, function ($g, params) {

		params.skip = $g.randByArraySeed(params.skip);
		params.iteration = $g.randByArraySeed(params.iteration);

		var width = $g.texture.width;
		var height = $g.texture.height;

		var xMin = -2.0;
		var xMax = 1.0;
		var yMin = -1.5;
		var yMax = 1.5;

		var mr0 = params.rgba[0];
		var mg0 = params.rgba[1];
		var mb0 = params.rgba[2];

		var mr1 = 256 / mr0;
		var mg1 = 256 / mg0;
		var mb1 = 256 / mb0;

		var maxIt = params.iteration;
		var x = 0.0;
		var y = 0.0;
		var zx = 0.0;
		var zx0 = 0.0;
		var zy = 0.0;
		var zx2 = 0.0;
		var zy2 = 0.0;

		for (var ky = 0; ky < height; ky++) {

			y = yMin + (yMax - yMin) * ky / height;

			for (var kx = 0; kx < width; kx++) {

				x = xMin + (xMax - xMin) * kx / width;
				zx = x;
				zy = y;

				for (var i = 0; i < maxIt; i++) {

					zx2 = zx * zx;
					zy2 = zy * zy;

					if (zx2 + zy2 > 4.0) {
						break;
					}

					zx0 = zx2 - zy2 + x;
					zy = 2.0 * zx * zy + y;
					zx = zx0;

				}

				if (i > params.skip) {
					$g.point.rgba = [i % mr0 * mr1, i % mg0 * mg1, i % mb0 * mb1, $g.point.rgba[3]];
					$g.point.set(kx, ky);
				}

			}
		}


		return params;

	});


})('tgen');