function rot(as) {
    var m = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    for (var i = 0; i < 3; i++) {
	var j = (i+1)%3, k = (i+2)%3;
	var c = Math.cos(as[i]), s = Math.sin(as[i]);
	var n = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	n[i][i] = 1;
	n[j][j] = c;
	n[j][k] = -s;
	n[k][j] = s;
	n[k][k] = c;
	var o = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	for (var p = 0; p < 3; p++)
	    for (var q = 0; q < 3; q++)
		for (var r = 0; r < 3; r++)
		    o[p][r] += m[p][q] * n[q][r];
	m = o;
    }
    return m;
}

function binom_gaussian(n) {
    // Generate a Gaussian approximation by taking a bunch of uniforms
    var x = -n / 2;
    for (var i = 0; i < n; i++)
	x += Math.random();
    return x / Math.sqrt(n);
}

var a = Math.random(), b = Math.random(), c = Math.random();
var points = [];
var xyz = [];

function render() {
    // console.log('render!');
    a += 0.0010;
    b += 0.0007;
    c += 0.0008;

    m = rot([a, b, c]);

    for (var i = 0; i < points.length; i++) {
	var corners = [];
	for (var j = 0; j < 8; j++) {
	    var size = 0.1;
	    var p = (j>>2) * size, q = ((j>>1)&1) * size, r = (j&1) * size;
	    var x = m[0][0] * (xyz[i][0]+p) + m[0][1] * (xyz[i][1]+q) + m[0][2] * (xyz[i][2]+r);
	    var y = m[1][0] * (xyz[i][0]+p) + m[1][1] * (xyz[i][1]+q) + m[1][2] * (xyz[i][2]+r);
	    var z = m[2][0] * (xyz[i][0]+p) + m[2][1] * (xyz[i][1]+q) + m[2][2] * (xyz[i][2]+r);
	    var depth = 0.9;
	    x *= depth / (z + depth);
	    y *= depth / (z + depth);
	    corners.push([(x + 0.5) * 1000, (y + 0.5) * 1000]);
	}
	points[i].attr('d', 'M' + d3.geom.hull(corners).join('L') + 'Z');
    }
}

function do3d(elmId, delay, color) {
    // Make an SVG Container
    var svgContainer = d3.select(elmId).append("svg")
	.attr("width", 10000)
	.attr("height", 10000);


    for (var i = 0; i < 50; i++) {
	var p = svgContainer.append('path').attr('fill', color).attr('stroke-width', '1px');
	points.push(p);
	xyz.push([binom_gaussian(10), binom_gaussian(10), binom_gaussian(10)]);
    }

    setInterval(render, delay);
}
