export const COLOR = {
	CLEAR_COLOR: {
		R: 219/255,
		G: 219/255,
		B: 219/255,
		A: 1,
	},
	VERTEX_COLOR: {
		R: 1,
		G: 1,
		B: 1,
		A: 1,
	},
	RED: {
		R: 0.5,
		G: 0,
		B: 0,
		A: 1,
	},
	GREEN: {
		R: 0,
		G: 0.5,
		B: 0,
		A: 1,
	},
	BLUE: {
		R: 0,
		G: 0,
		B: 0.5,
		A: 1,
	},
};

const generateYRange = (range) => {
	const a = 0;
	const n = range + 1;
	const Sn = 0.5;
	const b = ((2 * Sn) / n - 2 * a) / (n - 1);

	const res = [];
	const raw_list = [];

	for (let i = 1; i <= range; i++) {
		raw_list.push(a + b * i);
	}

	let y_prev = 0;

	for (let i = range - 1; i >= 0; i--) {
		y_prev += raw_list[i];
		res.push(y_prev);
	}

	return res;
};

export const SHAPE = {
	TRIANGLE: [
		[-0.5, -0.5],
		[0.5, -0.5],
		[0, 0.5],
	],
	SQUARE: [
		[-0.5, -0.5],
		[0.5, -0.5],
		[0.5, 0.5],
		[-0.5, 0.5],
	],
	POLYGON(n) {
		const upper_count = Math.ceil((n - 2) / 2);
		const lower_count = Math.floor((n - 2) / 2);
		const res = [];
		let x_range, y_range, y_mid;
		res.push([-0.5, 0]);
		y_mid = upper_count / 2;

		x_range = 1 / (upper_count + 1);
		y_range = generateYRange(Math.ceil(y_mid));

		if (y_mid % 1 == 0 || y_mid === 1) {
			y_range = [...y_range, ...y_range.reverse()];
		} else {
			y_range = [...y_range, ...y_range.slice(0, -1).reverse()];
		}
		for (let i = 1; i <= upper_count; i++) {
			let x, y;
			x = -0.5 + x_range * i;
			y = y_range[i - 1];
			res.push([x, y]);
		}
		res.push([0.5, 0]);
		y_mid = lower_count / 2;
		x_range = 1 / (lower_count + 1);
		y_range = generateYRange(Math.ceil(y_mid));
		if (y_mid % 1 == 0 || y_mid === 1) {
			y_range = [...y_range, ...y_range.reverse()];
		} else {
			y_range = [...y_range, ...y_range.slice(0, -1).reverse()];
		}

		for (let i = 1; i <= lower_count; i++) {
			let x, y;
			x = 0.5 - x_range * i;
			y = 0 - y_range[i - 1];
			res.push([x, y]);
		}

		return res;
	},

	// tes wibi
	LETTERG: [
		[0.4, 0.5],
		[0.0, 0.5],
		[0.0, 0.0],
		[0.4, 0.0],
		[0.4, 0.3],
		[0.2, 0.3],
		[0.2, 0.2],
		[0.3, 0.2],
		[0.3, 0.1],
		[0.1, 0.1],
		[0.1, 0.4],
		[0.4, 0.4]
	],
	CONVEX: [
		[0.2, 0.1],
		[0.0, 0.0],
		[0.2, 0.3],
		[0.4, 0.0],
	],
	WEIRDCONVEX: [
		[0.0, 0.0],
		[0.4, 0.1],
		[0.0, 0.2],
		[0.4, 0.3],
		[0.0, 0.4],
		[0.4, 0.5],
		[0.5, 0.4],
		[0.5, 0.2],
		[0.6, 0.1],
		[0.2, -0.2],
		[-0.2, -0.2],
		[-0.2, 0.4],
		[-0.1, 0.4],
		[-0.1, 0.0]
	],
	NOTSIMPLE: [
		[0.0, 0.0],
		[0.0, 0.1],
		[0.2, 0.1],
		[0.2, 0.2],
		[0.1, 0.2],
		[0.1, 0.0]
	],
	HOLE: [
		[0.0, -0.1],
		[-0.1, -0.1],
		[-0.1, 0.1],
		[0.1, 0.1],
		[0.1, -0.1],
		[0.0, -0.1],
		[0.0, -0.2],
		[0.2, -0.2],
		[0.2, 0.2],
		[-0.2, 0.2],
		[-0.2, -0.2],
		[0.0, -0.2]
	],
};
